import { getAppUser } from "@/lib/users/appUser";
import { fetchManager } from "@/lib/users/managers";

export default {
  appUsers: {
    getOne: getAppUser,
  },
  managers: {
    fetchManager,
  },
};
