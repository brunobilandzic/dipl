import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import errorReducer from "./error";
import loadingReducer from "./loading";
import cultivationReducer from "./cultivation";
import generalManagerReducer from "./generalManager";
import productionReducer from "./production/index.js";
import warehouseReducer from "./warehouse";
import storeReducer from "./store";

const store = configureStore({
  reducer: {
    user: userReducer,
    error: errorReducer,
    loading: loadingReducer,
    cultivation: cultivationReducer,
    generalManager: generalManagerReducer,
    production: productionReducer,
    warehouse: warehouseReducer,
    store: storeReducer,
  },
});

export default store;
