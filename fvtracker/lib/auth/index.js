import { handleCredentials, handleOAuth } from "./handlers";
import {
  fetchGeneralAndOtherManagers,
  fetchSessionAppUser,
  fetchSessionSpecificManager,
} from "./fetchSessionData";

export default {
  authorizationHandlers: {
    handleOAuth,
    handleCredentials,
  },
  session: {
    appUser: fetchSessionAppUser,
    specificManager: fetchSessionSpecificManager,
    generalAndOtherManagers: fetchGeneralAndOtherManagers,
  },
};
