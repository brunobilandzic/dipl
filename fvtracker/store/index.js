import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import errorReducer from "./error";
import loadingReducer from "./loading";
import cultivationReducer from "./cultivation";
import cultivateReducer from "./cultivation/cultivate";

export default configureStore({
  reducer: {
    user: userReducer,
    error: errorReducer,
    loading: loadingReducer,
    cultivation: cultivationReducer,
    cultivate: cultivateReducer,
  },
});
