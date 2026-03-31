import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import errorReducer from "./error";
import loadingReducer from "./loading";
import cultivationReducer from "./cultivation";
import generalManagerReducer from "./generalManager";
import productsReducer from "./production/products";

const store = configureStore({
  reducer: {
    user: userReducer,
    error: errorReducer,
    loading: loadingReducer,
    cultivation: cultivationReducer,
    generalManager: generalManagerReducer,
    products: productsReducer,
  },
});

export default store;
