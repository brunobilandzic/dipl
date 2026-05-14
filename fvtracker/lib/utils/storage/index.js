import { fetchWarehouseRequests } from "@/store/warehouse";
import { fetchWarehouses } from "@/store/warehouse";

export const fillWarehouseRedux = ({ dispatch }) => {
  dispatchActions({ dispatch });
};

const dispatchActions = ({ dispatch }) => {
  dispatch(fetchWarehouses());
  dispatch(fetchWarehouseRequests());
};
