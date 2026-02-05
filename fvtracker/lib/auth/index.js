import { handleCredentials, handleOAuth } from "./handlers";
import { fetchSessionAppUser} from "./fetchSessionData";

export default {
  authorizationHandlers: {
    handleOAuth,
    handleCredentials,
  },
  session: {
    fetchSessionAppUser,
  },
};
