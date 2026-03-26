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

export async function handleOAuth({ email, given_name, family_name }) {
  await dbConnect();
  const appUser = await models.user.AppUser.findOne({ email });
  if (appUser) {
    return true;
  } else {
    const newUser = new models.user.AppUser({
      email,
      name: given_name,
      surname: family_name,
      provider: "google",
      username: email.split("@")[0],
    });

    await newUser.save();
    return true;
  }
}

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

  return {
    appUserId: user._id.toString(),
    email: user.email,
    managerModelName: getManagerModelName(),
    name: user.name,
    roleStatus: user.roleStatus,
    username: user.username,
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
    // right now, app is built for only one gen manager
    if (!MANAGER_TYPES.includes(requestedRole)) {
      console.log("Invalid requested role:", requestedRole);
      return null;
    }
    const generalManager = await GeneralManager.findOne();
    const rootManager = await new RootManager({
      appUser: newUser._id,
      managerModelName: requestedRole,
      generalManager: generalManager._id,
    });

    const specificManager = await models.user[requestedRole].create({
      rootManager: rootManager._id,
    });

    console.log("created specific manager:", specificManager);

    rootManager.appUser = newUser._id;

    await specificManager.save();
    await rootManager.save();
    newUser.rootManager = rootManager._id;
    await newUser.populate("rootManager");
  }

  await newUser.save();
  console.log("New user created:", newUser);
  return { ...newUser._doc, roleStatus: ROLE_STATUSES.PENDING };
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
    await appUser.rootManager?.populate({
      path: "roleRequest",
      select: "status",
    });
    const authorized = await bcrypt.compare(password, appUser.password);
    if (!authorized) {
      console.log("Incorrect password for user:", login);
      return null;
    }

    console.log("User authorized:", appUser.email);
    return {
      ...appUser._doc,
      roleStatus: appUser.rootManager?.roleRequest?.status || null,
    };
  }
  return null;
}

export async function authorizeCredentials({ email, password, signUp }) {
  console.log("authorizeCredentials called with email:", email);
  // compare passwords, otherwise return null
  await dbConnect();
  const appUser = await AppUser.findOne({ email });
  if (appUser && signUp) {
    // User is trying to sign up but already exists
    console.log("User already exists, cannot sign up:", email);
    return null;
  }

  if (appUser) {
    console.log("Found user in DB:", appUser);
    const authorized = await bcrypt.compare(password, appUser.password);
    if (authorized) {
      return appUser;
    } else {
      return null;
    }
  }

  if (signUp) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new AppUser({
      email,
      password: hashedPassword,
      provider: "credentials",
    });
    await newUser.save();
    console.log("New user created:", newUser);
    return newUser;
  }

  return null;
}
