import { seed as seedAppUsers, create as createAppUser } from "./appUsers";
import { create as createAdmin } from "./admin";

export default {
  allUsers: {
    seed: async () => {
      const appUsers = await seedAppUsers();
      const adminUser = await createAdmin();
      if (!adminUser) {
        throw new Error("Admin user creation failed");
      }
      if (!appUsers || appUsers.length === 0) {
        throw new Error("App users seeding failed");
      }
      
      return { appUsers, adminUserId: adminUser.id };
    },
  },
  appUsers: {
    seed: seedAppUsers,
    create: createAppUser,
  },
  admin: {
    create: createAdmin,
  },
};
