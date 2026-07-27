import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import errorReducer from "./error";
import loadingReducer from "./loading";
import cultivationReducer from "./cultivation";
import generalManagerReducer from "./generalManager";
import productionReducer from "./production/index.js";
import warehouseReducer from "./warehouse";
import storeReducer from "./webstore";
import salesReducer from "./sales";
import managersReducer from "./managers";
import workersReducer from "./workers";
import procurmentsReducer from "./procurments";

const store = configureStore({
  reducer: {
    user: userReducer,
    error: errorReducer,
    loading: loadingReducer,
    cultivation: cultivationReducer,
    generalManager: generalManagerReducer,
    production: productionReducer,
    warehouse: warehouseReducer,
    webstore: storeReducer,
    sales: salesReducer,
    managers: managersReducer,
    workers: workersReducer,
    procurments: procurmentsReducer,
  },
});

export default store;
