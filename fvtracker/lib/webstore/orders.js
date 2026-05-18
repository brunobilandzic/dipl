import { Order } from "@/models/sectors/sales";
import { getCustomer } from "./customer";

export const createOrder = async ({ cartItems, customerData }) => {
  const lastOrder = await Order.findOne().sort({ number: -1 }).select("number");

  const newOrderNumber = lastOrder
    ? String(Number(lastOrder?.number) + 1).padStart(6, "0")
    : "000001";
  const customer = await getCustomer({ customerData });
  const order = await new Order({
    customer: customer._id,
    number: newOrderNumber,
  }).save();
  for (const item of cartItems) {
    const orderItem = new orderItem
  customer.orders.push(order._id);
  console.log({ order, customer });

  await order.save();
  await customer.save();
};

export const getOrders = async ({ customerId = null }) => {
  const orders = await Order.find({
    ...(customerId && { customer: customerId }),
  })
    .populate("customer")
    .populate("items.product");
  return orders;
};

export const deleteOrder = async ({ orderId }) => {
  await Order.findByIdAndDelete(orderId);
};
