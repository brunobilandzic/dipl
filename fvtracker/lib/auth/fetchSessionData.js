import { auth } from "@/auth";
import dbConnect from "@/lib/db/mongooseConnect";
import { AppUser } from "@/models/user/AppUser";
import mongoose from "mongoose";

export async function fetchSessionAppUser() {
  const email = await fetchSessionEmail();
  if (!email) {
    throw new Error("No email found in session: cannot fetch app user");
  }
  await dbConnect();
  const appUser = await AppUser.findOne({ email });
  if (!appUser) {
    console.log("Failed to fetch app user for session with email:", email);
    throw new Error(
      "Failed to fetch app user for session with email: " + email,
    );
  }
  return appUser;
}

async function fetchSessionEmail() {
  const session = await auth();
  if (!session) {
    throw new Error("No session found: fetch email failed");
  }
  return session.user.email;
}

export async function fetchSessionSpecificManager(managerModelName) {
  const appUser = await fetchSessionAppUser();
  const specificManager = await mongoose.models[managerModelName].findOne({
    rootManager: appUser.rootManager,
  });
  if (!specificManager) {
    throw new Error(
      `No ${managerModelName} found for session user with email: ${appUser.email}`,
    );
  }

  return specificManager;
}
