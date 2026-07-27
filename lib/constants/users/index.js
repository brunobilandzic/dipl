import { usernameToModel, modelToUsername } from "./managersUsernameModel";

export const ROLE_STATUSES = {
  PENDING: "NA ČEKANJU",
  APPROVED: "ODOBRENO",
  REJECTED: "ODBIJENO",
};

export default {
  usernameToModel,
  modelToUsername,
  ROLE_STATUSES,
};

export const UNAUTHORIZED_PAGE = "/uloga-nije-odobrena";
