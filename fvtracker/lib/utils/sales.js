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

export const orderAmount = (order) => {
  console.log("Calculating order amount for order:", order.items);
  return order.items.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);
};

export const ordersTotalAmount = (orders) => {
  return orders.reduce((total, order) => total + orderAmount(order), 0);
};
