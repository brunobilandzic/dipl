import { AppUser } from "./AppUser.js";
import { Admin } from "./Admin.js";
import managers from "./managers";

export default {
  AppUser,
  Admin,
  ...managers,
};
