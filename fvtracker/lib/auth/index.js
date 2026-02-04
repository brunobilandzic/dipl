import { handleCredentials, handleOAuth } from "./authentification/handlers";

export default {
  authorizationHandlers: {
    handleOAuth,
    handleCredentials,
  },
};
