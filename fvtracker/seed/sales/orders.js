import { getCustomer } from "./customer";
import { Product } from "@/models/sectors/production/Product";
import { ordersSeedData } from "../data/sales/orders";
import { Order } from "@/models/sectors/sales";

export const createOrders = async () => {
  await Order.deleteMany({}); // Clear existing orders
  console.log("Creating orders...");
  const createdOrders = [];
  const customer = await getCustomer();
  const items = await buildOrderItems();

  for (const orderData of ordersSeedData) {
    const newOrder = await Order.create({
      ...orderData,
      customer: customer._id,
      items,
    });
    createdOrders.push(newOrder);
  }

  return createdOrders;
};

const buildOrderItems = async () => {
  const products = await Product.find({});
  return products.map((product) => ({
    product: product._id,
    quantity: 1,
  }));
};
