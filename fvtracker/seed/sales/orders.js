import { getCustomer } from "./customer";
import { Product } from "@/models/sectors/production/Product";
import { ordersSeedData } from "../data/sales/orders";
import { Order } from "@/models/sectors/sales";

export const createOrders = async () => {
  await Order.deleteMany({}); // Clear existing orders
  console.log("Creating orders...");

  const customer = await getCustomer();
  const items = await buildOrderItems();

  for (const orderData of ordersSeedData) {
    const newOrder = await Order.create({
      ...orderData,
      customer: customer._id,
      items,
    });
  }
};

const buildOrderItems = async () => {
  const product = await Product.findOne({}).select("name");

  console.log(`Adding ${product.name} to order items...`);

  return [
    {
      product: product._id,
      quantity: 1,
    },
  ];
};
