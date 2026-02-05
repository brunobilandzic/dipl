import { getAppUser } from "@/lib/users/appUser";
import { fetchManagerData } from "@/lib/users/managers";

export default {
  appUsers: {
    getOne: getAppUser,
  },
  managers: {
    fetchManagerData,
  },
};
