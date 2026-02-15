import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import fieldReducer from "./cultivation/fieldSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    cultivation: {
      field: fieldReducer
    },
    error: errorReducer,
  },
});
