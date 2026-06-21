import { handleCredentials } from "./handlers";
import {
  fetchManager,
  fetchSessionAppUser,
  fetchSessionSpecificManager,
} from "./fetchSessionData";

export default {
  authorizationHandlers: {
    handleCredentials,
  },
  session: {
    appUser: fetchSessionAppUser,
    specificManager: fetchSessionSpecificManager,
    manager: fetchManager,
  },
};
