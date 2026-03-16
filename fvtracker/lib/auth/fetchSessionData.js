import { auth } from "@/auth";
import { AppUser } from "@/models/user/AppUser";
import mongoose from "mongoose";

export async function fetchSessionAppUser() {
  const email = await fetchSessionEmail();
  if (!email) {
    throw new Error("No email found in session: cannot fetch app user");
  }
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

export async function fetchSessionSpecificManager({
  managerName,
  throwError = true,
}) {
  const appUser = await fetchSessionAppUser();
  const specificManager = await mongoose.models[managerName].findOne({
    rootManager: appUser.rootManager,
  });
  if (!specificManager) {
    if (throwError) {
      throw new Error(
        `No ${managerName} found for session user with email: ${appUser.email}`,
      );
    }
    return null;
  }

  return specificManager;
}

export async function checkGeneralOrOtherManager({ managerNames = [] }) {
  const generalManager = await fetchSessionSpecificManager({
    managerName: "GeneralManager",
    throwError: false,
  });

  if (generalManager) {
    return { hasAccess: true, manager: generalManager };
  }

  for (const managerName of managerNames) {
    const specificManager = await fetchSessionSpecificManager({
      managerName,
      throwError: false,
    });
    if (specificManager) {
      return { hasAccess: true, manager: specificManager };
    }
  }

  return { hasAccess: false, manager: null };
}
