import { handleCredentials, handleOAuth } from "./handlers";
import {
  fetchSessionAppUser,
  fetchSessionSpecificManager,
} from "./fetchSessionData";

export default {
  authorizationHandlers: {
    handleOAuth,
    handleCredentials,
  },
  session: {
    fetchSessionAppUser,
    fetchSessionSpecificManager,
  },
};
