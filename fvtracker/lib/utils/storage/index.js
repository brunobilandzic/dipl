import { fetchWarehouseRequests } from "@/store/warehouse";
import { fetchWarehouses } from "@/store/warehouse";
import { fillOrdersRedux } from "../webstore/orders";

export const fillWarehouseRedux = ({ dispatch }) => {
  dispatchActions({ dispatch });
};

const dispatchActions = ({ dispatch }) => {
  dispatch(fetchWarehouses());
  dispatch(fetchWarehouseRequests());
  fillOrdersRedux({ dispatch });
};
