import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import fieldReducer from "./cultivation/fieldSlice";
import errorReducer from "./error";
import loadingReducer from "./loading";

export default configureStore({
  reducer: {
    user: userReducer,
    fields: fieldReducer,
    error: errorReducer,
    loading: loadingReducer,
  },
});
