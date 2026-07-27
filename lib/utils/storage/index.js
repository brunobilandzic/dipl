import { fetchWarehouseRequests } from "@/store/warehouse";
import { fetchWarehouses } from "@/store/warehouse";
import { fillOrdersRedux } from "../webstore/orders";

export const fillWarehouseRedux = ({ dispatch, router }) => {
  dispatchActions({ dispatch, router });
};

const dispatchActions = ({ dispatch, router }) => {
  dispatch(fetchWarehouses());
  dispatch(fetchWarehouseRequests());
  fillOrdersRedux({ dispatch, router });
};
