import { Order, OrderItem } from "@/models/sectors/sales";
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
    const orderItem = new OrderItem({
      order: order._id,
      product: item.product._id,
      quantity: item.quantity,
    });
    order.items.push(orderItem._id);
    await orderItem.save();
  }

  customer.orders.push(order._id);
  console.log({ order, customer });

  await order.save();
  console.log(
    `Created order ${order.number} with ${order.items.length} items. `,
  );
  await customer.save();
};

export const getOrders = async ({ customerId = null }) => {
  const orders = await Order.find({
    ...(customerId && { customer: customerId }),
  }).populate([
    {
      path: "customer",
    },
    {
      path: "items",
      populate: [
        {
          path: "product",
        },
        {
          path: "shipmentItems",
          populate: {
            path: "product",
            select: "name",
          },
        },
      ],
    },
  ]);

  console.log(orders);
  return orders;
};

export const deleteOrder = async ({ orderId }) => {
  await Order.findByIdAndDelete(orderId);
};
