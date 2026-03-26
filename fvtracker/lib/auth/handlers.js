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
  console.log("handleCredentials called with:", credentials);

  if (credentials.isSignUp) return signUpCredentials(credentials);
  return logInCredentials(credentials);
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
  console.log("Required role for new user:", requestedRole);
  console.log("Signing up user with email:", email);
  const existingUser = await AppUser.findOne({ email });
  console.log("Existing user check:", existingUser);
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

  console.log("Creating new user...");

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
      appUser: newUser._id,
      rootManager: rootManager._id,
    });

    rootManager.specificManager = specificManager._id;

    console.log("created specific manager:", specificManager);

    await specificManager.save();
    await rootManager.save();
    newUser.rootManager = rootManager._id;
  }

  await newUser.save();
  console.log("New user created:", newUser);
  return newUser;
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
    if (authorized) {
      console.log("User authorized:", appUser.email);
      return {
        appUserId: appUser._id.toString(),
        email: appUser.email,
        name: appUser.username || appUser.name,
        managerModelName:
          appUser.username === GENERAL_MANAGER_USERNAME
            ? GENERAL_MANAGER
            : appUser.rootManager?.managerModelName || null,
      };
    }
  }
  return null;
}

export async function authorizeCredentials({
  email,
  name,
  surname,
  password,
  passwordConfirm,
  signUp,
}) {
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
