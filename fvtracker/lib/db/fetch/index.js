import dbConnect from "@/lib/db/mongooseConnect";
await dbConnect();
import { getByUsername } from "@/lib/db/fetch/users/appUser";

export default {
  users: {
    appUsers: {
      getByUsername,
    },
  },
};
