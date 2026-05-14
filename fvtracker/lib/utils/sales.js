import { refreshOrdersThunk } from "@/store/webstore";
import api from "../api";

export const fillSalesRedux = async ({ dispatch }) => {
  const ordersRes = await api.get("/orders");
  dispatchPayloads({ orders: ordersRes.data.orders, dispatch });
};

const dispatchPayloads = ({ orders, dispatch }) => {
  dispatch(refreshOrdersThunk.fulfilled(orders));
  dispatch(refreshOrders());
};
