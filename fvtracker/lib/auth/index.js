import { handleCredentials, handleOAuth } from "./handlers";
import {
  fetchManager,
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
    manager: fetchManager,
  },
};
