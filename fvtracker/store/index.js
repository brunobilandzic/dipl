import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import fieldReducer from "./cultivation/fieldSlice";
import errorReducer from "./error";

export default configureStore({
  reducer: {
    user: userReducer,
    cultivation: {
      field: fieldReducer
    },
    error: errorReducer,
  },
});
