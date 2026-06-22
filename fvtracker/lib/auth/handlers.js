import dbConnect from "@/lib/db/mongooseConnect";
import models from "@/models";
import { AppUser } from "@/models/user/AppUser";
import bcrypt from "bcrypt";
import { GENERAL_MANAGER_USERNAME } from "../constants/users/managersUsernameModel";
import {
  GENERAL_MANAGER,
  MANAGER_TYPES,
} from "../constants/users/managerTypes";
import { GeneralManager } from "@/models/user/managers/GeneralManager";
import { RootManager } from "@/models/user/managers/RootManager";
import { ROLE_STATUSES } from "../constants/users";
import mongoose from "mongoose";
import { Admin } from "@/models/user/Admin";
import { GeneralManagerRequest } from "@/models/documents/requests/RoleRequest";
import { EMPLOYMENT_STATUS_EMPLOYED } from "../constants/users/workers";

export async function handleCredentials(credentials) {
  await dbConnect();
  let user;

  if (credentials.isSignUp) {
    user = await signUpCredentials(credentials);
  } else {
    user = await logInCredentials(credentials);
  }
  if (!user) {
    return null;
  }
  const getManagerModelName = () => {
    if (!user.rootManager) {
      return null;
    }
    if (credentials.requestedRole === GENERAL_MANAGER) {
      return GENERAL_MANAGER;
    } else {
      return user.rootManager.managerModelName;
    }
  };

  const managerModelName = getManagerModelName();

  const manager = managerModelName
    ? await mongoose
        .model(getManagerModelName())
        .findOne({ rootManager: user.rootManager?._id })
    : null;
  return {
    appUserId: user._id.toString(),
    email: user.email,
    managerModelName: getManagerModelName(),
    name: user.name,
    roleStatus: user.roleStatus,
    username: user.username,
    name: user.name,
    surname: user.surname,
    managerId: manager?._id.toString() || null,
    isAdmin: user.isAdmin || false,
    workerType: user.workerType || null,
    workerId: user.worker?._id.toString() || null,
    generalManagerRequest: user.generalManagerRequest || null,
    employed: user.employed ?? null,
  };
}

async function signUpCredentials({
  email,
  username,
  name,
  surname,
  password,
  passwordConfirm,
  requestedRole,
}) {
  const existingUser = await AppUser.findOne({ email });

  if (existingUser) {
    return null;
  }
  if (password !== passwordConfirm) {
    console.log(
      "Password and confirmation do not match",
      password,
      passwordConfirm,
    );
    return null;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new AppUser({
    email,
    username,
    name,
    surname,
    password: hashedPassword,
    provider: "credentials",
  });
  if (requestedRole) {
    if (requestedRole === GENERAL_MANAGER) {
      const existingGeneralManager = await GeneralManager.findOne().populate(
        "generalManagerRequest",
      );
      if (
        existingGeneralManager &&
        existingGeneralManager.generalManagerRequest.status ===
          ROLE_STATUSES.APPROVED
      ) {
        console.log(
          "General Manager already exists, cannot create another one",
        );
        return null;
      }
      const generalManager = await new GeneralManager();
      const generalManagerRootManager = await new RootManager({
        appUser: newUser._id,
        managerModelName: GENERAL_MANAGER,
        generalManager: generalManager._id,
      });
      generalManager.rootManager = generalManagerRootManager._id;
      await generalManager.save();
      await generalManagerRootManager.save();
      newUser.rootManager = generalManagerRootManager._id;
      await newUser.populate("rootManager");
      await newUser.save();
      return { ...newUser._doc, generalManagerRequest: ROLE_STATUSES.PENDING };
    }
    if (!MANAGER_TYPES.includes(requestedRole)) {
      throw new Error("Invalid manager type requested: " + requestedRole);
    }
    console.log({ requestedRole });
    const existingManagers = await mongoose
      .model(requestedRole)
      .find()
      .populate({
        path: "rootManager",
        select: "roleRequest",
        populate: { path: "roleRequest", select: "status" },
      });
    const hasApprovedManager = existingManagers.some((manager) => {
      return (
        manager.rootManager?.roleRequest?.status === ROLE_STATUSES.APPROVED
      );
    });
    if (hasApprovedManager) {
      console.log(
        `An approved ${requestedRole} already exists. Cannot create another one.`,
      );
      return null;
    }
    const generalManager = await GeneralManager.findOne();
    if (!generalManager) {
      console.log(
        "No General Manager found. Cannot create manager without a General Manager.",
      );
      return null;
    }
    const rootManager = await new RootManager({
      appUser: newUser._id,
      managerModelName: requestedRole,
      generalManager: generalManager._id,
    });
    generalManager.managers.push(rootManager._id);
    const specificManager = await models.user[requestedRole].create({
      rootManager: rootManager._id,
    });

    console.log("created specific manager:", specificManager);

    rootManager.appUser = newUser._id;

    await specificManager.save();
    await rootManager.save();
    await generalManager.save();
    newUser.rootManager = rootManager._id;
    await newUser.populate("rootManager");
  }

  await newUser.save();
  console.log("New user created:", newUser);
  return {
    ...newUser._doc,
    roleStatus: ROLE_STATUSES.PENDING,
  };
}

async function logInCredentials({ login, password }) {
  login = login.trim().toLowerCase();
  let appUser = await models.user.AppUser.findOne({ email: login }).populate(
    "rootManager",
  );

  if (!appUser) {
    appUser = await models.user.AppUser.findOne({ username: login }).populate(
      "rootManager",
    );
  }

  if (!appUser) {
    console.log("No user found with email or username:", login);
    return null;
  }
  if (appUser) {
    const authorized = await bcrypt.compare(password, appUser.password);
    if (!authorized) {
      console.log("Incorrect password for user:", login);
      return null;
    }
    if (appUser.worker) {
      await appUser.populate({
        path: "worker",
        select: "_id __t employmentRequest",
        populate: "employmentRequest",
      });
      const workerType = appUser.worker.__t;
      return {
        ...appUser._doc,
        workerType,
        employed:
          appUser.worker.employmentRequest.status ===
          EMPLOYMENT_STATUS_EMPLOYED,
      };
    }
    if (!appUser.rootManager) {
      console.log("User has no Root Manager:", login);
      return appUser;
    }
    if (
      !appUser.rootManager.roleRequest &&
      appUser.rootManager.managerModelName !== GENERAL_MANAGER
    ) {
      console.log("User's Root Manager has no Role Request:", login);
      return null;
    }
    let generalManagerRequest = null;
    if (appUser.rootManager.managerModelName === GENERAL_MANAGER) {
      const generalManager = await GeneralManager.findOne({
        rootManager: appUser.rootManager._id,
      }).populate("generalManagerRequest");
      generalManagerRequest = generalManager.generalManagerRequest;
    }
    await appUser.rootManager?.populate({
      path: "roleRequest",
      select: "status",
    });

    console.log("User authorized:", appUser.email);
    return {
      ...appUser._doc,
      roleStatus: appUser.rootManager?.roleRequest?.status || null,
      worker: appUser.worker || null,
      generalManagerRequest: generalManagerRequest?.status || null,
    };
  }
  return null;
}
