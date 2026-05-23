import { getCustomer } from "./customer";
import { Product } from "@/models/sectors/production/Product";
import { ordersSeedData } from "../data/sales/orders";
import { Order, OrderItem } from "@/models/sectors/sales";

export const createOrders = async () => {
  await Order.deleteMany({}); // Clear existing orders
  console.log("Creating orders...");

  const createdOrders = [];
  const customer = await getCustomer();
  const items = await buildOrderItems();

  const financialManager = await FinancialManager.findOne({}).select(
    "_id orders ",
  );

  for (const orderData of ordersSeedData) {
    const newOrder = await Order.create({
      ...orderData,
      customer: customer._id,
    });
    for (const item of items) {
      const orderItem = new OrderItem({
        order: newOrder._id,
        product: item.product,
        quantity: item.quantity,
      });
      const product = await Product.findById(item.product);
      product.orderItems.push(orderItem._id);

      createdOrders.push(newOrder);

      newOrder.items.push(orderItem._id);

      await product.save();
      await orderItem.save();
    }
    await newOrder.save();
  }

  financialManager.orders.push(createdOrders.map((o) => o._id));
  await financialManager.save();
  return createdOrders;
};

const buildOrderItems = async () => {
  const products = await Product.find({});
  return products.map((product) => ({
    product: product._id,
    quantity: 2,
  }));
};
