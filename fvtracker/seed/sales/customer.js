import { Customer } from "@/models/user/Customer";
import { customers } from "../data/appUsers";

export const createCustomers = async () => {
  await Customer.deleteMany({});
  const createdCustomers = [];
  for (const customer of customers) {
    const newCustomer = await Customer.create(customer);
    createdCustomers.push(newCustomer);
  }
  return createdCustomers;
};

export const getCustomer = async () => {
  const createdCustomers = await createCustomers();
  return createdCustomers[0];
};
