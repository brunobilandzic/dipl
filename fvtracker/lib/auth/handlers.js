import dbConnect from "@/lib/db/mongooseConnect";
import { AppUser } from "@/models/user/AppUser";
import bcrypt from "bcrypt";

export async function handleOAuth({ email, given_name, family_name }) {
  await dbConnect();
  const appUser = await AppUser.findOne({ email });
  if (appUser) {
    return true;
  } else {
    const newUser = new AppUser({
      email,
      name: given_name,
      surname: family_name,
      provider: "google",
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
}) {
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
  await newUser.save();
  console.log("New user created:", newUser);
  return newUser;
}

async function logInCredentials({ login, password }) {
  
  login = login.trim().toLowerCase();
  let appUser = await AppUser.findOne({ email: login });
  if (!appUser) {
    appUser = await AppUser.findOne({ username: login });
  }
  if (appUser) {
    const authorized = await bcrypt.compare(password, appUser.password);
    if (authorized) {
      return appUser;
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
