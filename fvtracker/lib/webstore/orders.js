import { Order } from "@/models/sectors/sales";
import { getCustomer } from "./customer";

export const placeOrder = async ({ cartItems, customerData }) => {
  const lastOrderNumber = await Order.findOne()
    .sort({ number: -1 })
    .select("number");
  const newOrderNumber = lastOrderNumber
    ? String(Number(lastOrderNumber.number) + 1).padStart(6, "0")
    : "000001";
  const customer = await getCustomer({ customerData });
  const order = await new Order({
    customer: customer._id,
    items: cartItems.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
    })),
    number: newOrderNumber,
  }).save();
  customer.orders.push(order._id);

  await order.save();
  await customer.save();
};
