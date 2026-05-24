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
  let specificManager = await mongoose.models[managerName].findOne({
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

  return specificManager;
}

export const fetchAdmin = async () => {
  const appUser = await fetchSessionAppUser();
  const admin = await mongoose.models.Admin.findOne({ appUser: appUser._id });
  if (!admin) {
    return { unauthorized: true };
  }
  return { admin };
};

export async function fetchManager({ managerNames = [] }) {
  const response = {
    generalManager: null,
    specificManager: null,
  };
  const generalManager = await fetchSessionSpecificManager({
    managerName: GENERAL_MANAGER,
    throwError: false,
  });

  if (generalManager) {
    response.generalManager = generalManager;
  }
  if (managerNames.length === 0) {
    // if no specific manager types provided, return general manager if exists or unauthorized
    console.log(
      "No specific manager types provided, returning general manager if exists",
    );
    return response.generalManager ? response : { unauthorized: true };
  }
  for (const managerName of managerNames) {
    const specificManager = await fetchSessionSpecificManager({
      managerName,
      throwError: false,
    });
    if (specificManager) {
      // return first manager found
      // needs better logic, but for now we will only use one manager type per page so it will do for that
      response.specificManager = specificManager;
      return response;
    }
  }

  return { unauthorized: true };

  console.log("did not throw error yet");
  throw new Error(
    `No manager found for session user among types: ${managerNames.join(", ")}`,
  );
}

export const checkManager = async ({ managerNames = [] }) => {
  const { unauthorized, specificManager } = await fetchManager({
    managerNames,
  });
  if (unauthorized) {
    throw new Error("Unauthorized: no manager found for session user");
  }
  return specificManager;
};

export const fetchSessionRootManager = async () => {
  const appUser = await fetchSessionAppUser();
  const rootManager = await mongoose.models.RootManager.findOne({
    appUser: appUser._id,
  });

  if (!rootManager) {
    return { unauthorized: true };
  }
  return {
    rootManager,
  };
};
