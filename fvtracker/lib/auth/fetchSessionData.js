import { auth } from "@/auth";
import { AppUser } from "@/models/user/AppUser";
import mongoose from "mongoose";
import { GENERAL_MANAGER } from "../constants/users/managerTypes";

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

  let specificManager = await mongoose.models[managerName].findOne();
  console.log({ specificManager });
  if (!specificManager) {
    if (throwError) {
      throw new Error(
        `No ${managerName} found for session user with email: ${appUser.email}`,
      );
    }
    return null;
  }

  if (managerName == GENERAL_MANAGER) {
    return specificManager;
  }

  if (!specificManager.rootManager) {
    if (throwError) {
      throw new Error(
        `No Root Manager associated with ${managerName} for session user with email: ${appUser.email}`,
      );
    }
    return null;
  }

  await specificManager.populate({
    path: "rootManager",
    populate: {
      path: "roleRequest",
      select: "status",
    },
  });

  if (!specificManager.rootManager?.roleRequest) {
    if (throwError) {
      throw new Error(
        `No Role Request associated with Root Manager for ${managerName} for session user with email: ${appUser.email}`,
      );
    }
    return null;
  }

  const status = specificManager.rootManager.roleRequest.status;

  return { ...specificManager._doc, status };
}

export async function fetchGeneralAndOtherManagers({ managerNames = [] }) {
  const response = {
    hasAccess: false,
    generalManager: null,
    otherManagers: [],
  };
  const generalManager = await fetchSessionSpecificManager({
    managerName: "GeneralManager",
    throwError: false,
  });

  if (generalManager) {
    response.hasAccess = true;
    response.generalManager = generalManager;
  }

  for (const managerName of managerNames) {
    const specificManager = await fetchSessionSpecificManager({
      managerName,
      throwError: false,
    });
    if (specificManager) {
      response.hasAccess = true;
      response.otherManagers.push(specificManager);
    }
  }

  if (!response.hasAccess) {
    throw new Error(
      `Unauthorized access: session user does not have required managers: ${managerNames.join(", ")}`,
    );
  }

  return response;
}
