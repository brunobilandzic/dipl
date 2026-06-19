import { Order, OrderItem } from "@/models/sectors/sales";
import { getCustomer } from "./customer";
import { Product } from "@/models/sectors/production/Product";

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
    const product = await Product.findById(item.product._id);
    const orderItem = new OrderItem({
      order: order._id,
      product: item.product._id,
      quantity: item.quantity,
    });

    product.orderItems.push(orderItem._id);
    await product.save();
    order.items.push(orderItem._id);
    await orderItem.save();
  }

  customer.orders.push(order._id);

  await order.save();
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
          path: "shipmentSources",
          populate: {
            path: "product",
            select: "name",
          },
        },
      ],
    },
    {
      path: "receipts",
      populate: {
        path: "shipmentItem",
        populate: {
          path: "sources",
          populate: {
            path: "product",
            select: "name",
          },
        },
      },
    },
  ]);
  return orders;
};

export const deleteOrder = async ({ orderId }) => {
  await Order.findByIdAndDelete(orderId);
};
