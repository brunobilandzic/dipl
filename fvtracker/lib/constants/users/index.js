import { usernameToModel, modelToUsername } from "./managersUsernameModel";

const ROLE_STATUSES = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

export default {
  usernameToModel,
  modelToUsername,
  ROLE_STATUSES,
};
