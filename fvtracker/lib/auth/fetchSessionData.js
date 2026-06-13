import { auth } from "@/auth";
import { AppUser } from "@/models/user/AppUser";
import mongoose from "mongoose";
import { GENERAL_MANAGER } from "../constants/users/managerTypes";
import { ROLE_STATUSES } from "../constants/users";
import "@/models/documents/requests/RoleRequest";
import { cache } from "react";
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

export const checkGeneralManagerRequest = async (generalManager) => {
  if (
    !generalManager.generalManagerRequest ||
    generalManager.generalManagerRequest.status != ROLE_STATUSES.APPROVED
  ) {
    return { unauthorized: true };
  }
  return { unauthorized: false };
};

// ── Cached jezgra: prima primitivni argument (string = stabilan cache ključ),
// nikad ne baca, vraća rezultat + razlog neuspjeha ──────────────────────────
const fetchSpecificManagerCached = cache(async (managerName) => {
  const appUser = await fetchSessionAppUser(); // također cache-irana

  const specificManager = await mongoose.models[managerName]
    .findOne({ rootManager: appUser.rootManager })
    .populate([
      {
        path: "rootManager",
        populate: { path: "roleRequest", select: "status" },
      },
      ...(managerName === GENERAL_MANAGER
        ? [{ path: "generalManagerRequest" }]
        : []),
    ]);

  if (!specificManager || !specificManager.rootManager) {
    return { specificManager: null, failReason: "NOT_FOUND" };
  }

  if (managerName !== GENERAL_MANAGER) {
    const roleRequest = specificManager.rootManager.roleRequest;
    if (!roleRequest) {
      return { specificManager: null, failReason: "NO_ROLE_REQUEST" };
    }
    if (roleRequest.status !== ROLE_STATUSES.APPROVED) {
      return { specificManager: null, failReason: "NOT_APPROVED" };
    }
  }

  return { specificManager, failReason: null };
});

// ── Javni API: isti potpis kao prije, throw logika izvan cachea ────────────
export async function fetchSessionSpecificManager({
  managerName,
  throwError = true,
}) {
  const { specificManager, failReason } =
    await fetchSpecificManagerCached(managerName);

  if (specificManager) return specificManager;

  // status postoji ali nije odobren → tiho null, nikad ne baca (staro ponašanje)
  if (failReason === "NOT_APPROVED") return null;

  if (throwError) {
    const appUser = await fetchSessionAppUser(); // cache hit, ne košta ništa
    if (failReason === "NO_ROLE_REQUEST") {
      throw new Error(
        `No Role Request associated with Root Manager for ${managerName} for session user with email: ${appUser.email}`,
      );
    }
    throw new Error(
      `No ${managerName} found for session user with email: ${appUser.email}`,
    );
  }

  return null;
}

export async function fetchSessionSpecificManager_bup({
  managerName,
  throwError = true,
}) {
  const appUser = await fetchSessionAppUser();
  let specificManager = await mongoose.models[managerName]
    .findOne({
      rootManager: appUser.rootManager,
    })
    .populate({
      path: "rootManager",
      populate: {
        path: "roleRequest",
        select: "status",
      },
    });

  if (
    !specificManager ||
    !specificManager.rootManager ||
    (managerName != GENERAL_MANAGER &&
      specificManager.rootManager.roleRequest?.status !==
        ROLE_STATUSES.APPROVED)
  ) {
    if (throwError) {
      throw new Error(
        `No ${managerName} found for session user with email: ${appUser.email}`,
      );
    }
    return null;
  }

  if (managerName == GENERAL_MANAGER) {
    await specificManager.populate([
      {
        path: "rootManager",
        populate: {
          path: "roleRequest",
          select: "status",
        },
      },
      {
        path: "generalManagerRequest",
      },
    ]);
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
  if (
    specificManager.rootManager.roleRequest.status !== ROLE_STATUSES.APPROVED
  ) {
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

export async function fetchWorker({ workerType }) {
  const appUser = await fetchSessionAppUser();
  const worker = await mongoose.models.Worker.findOne({
    appUser: appUser._id,
  })?.populate("manager");
  if (!worker) {
    return { worker: null, unauthorized: true };
  }
  return { worker, unauthorized: false };
}

export async function fetchManagerWorker({ managerNames = [], workerType }) {
  const { specificManager, generalManager, unauthorized, isAdmin } =
    await fetchManager({
      managerNames,
      worker: true,
    });
  if (unauthorized) {
    return { unauthorized: true };
  }
  if (!unauthorized && (specificManager || generalManager || isAdmin)) {
    return { specificManager, generalManager, unauthorized: false, isAdmin };
  }
  const { worker, unauthorized: workerUnauthorized } = await fetchWorker({
    workerType,
  });
  if (workerUnauthorized) {
    return { unauthorized: true };
  }

  return { worker, specificManager, unauthorized: false };
}

export async function fetchManager({ managerNames = [], worker = false }) {
  const { admin } = await fetchAdmin();
  if (admin) {
    return { unauthorized: false, isAdmin: true };
  }
  const response = {
    generalManager: null,
    specificManager: null,
  };
  const generalManager = await fetchSessionSpecificManager({
    managerName: GENERAL_MANAGER,
    throwError: false,
  });

  if (generalManager) {
    const { unauthorized } = await checkGeneralManagerRequest(generalManager);
    if (unauthorized) {
      return { unauthorized: true };
    }
    response.generalManager = generalManager;
  }
  if (managerNames.length === 0 && !worker) {
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
      response.specificManager = specificManager;
    }
  }

  if (!response.generalManager && !response.specificManager && !worker) {
    return { unauthorized: true };
  }
  return response;
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
  const { admin } = await fetchAdmin();
  const { generalManager } = await fetchManager({
    managerNames: [GENERAL_MANAGER],
  });
  if (admin || generalManager) {
    console.log("Admin user authenticated, granting access to root manager");
    return {
      unauthorized: false,
      rootManager: null,
      isAdmin: true,
      generalManager,
    };
  }
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

export const fetchSessionManagerModelName = async () => {
  const { rootManager, unauthorized, isAdmin } =
    await fetchSessionRootManager();
  if (unauthorized) {
    return { unauthorized: true };
  }
  if (isAdmin) {
    return { unauthorized: false, managerModelName: "Admin", isAdmin: true };
  }
  return { managerModelName: rootManager.managerModelName };
};

export const isAuthorizedGeneralManager = cache(async () => {
  const appUser = await fetchSessionAppUser(); // već cache-iran

  const [admin, gm] = await Promise.all([
    mongoose.models.Admin.exists({ appUser: appUser._id }),
    mongoose.models.GeneralManager.findOne({
      rootManager: appUser.rootManager,
    })
      .select("generalManagerRequest")
      .populate({ path: "generalManagerRequest", select: "status" })
      .lean(),
  ]);

  return Boolean(
    admin || gm?.generalManagerRequest?.status === ROLE_STATUSES.APPROVED,
  );
});
