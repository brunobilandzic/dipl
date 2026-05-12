import { Customer } from "@/models/user/Customer";

export const getCustomer = async ({ customerData }) => {
  try {
    let customer = await Customer.findOne({ email: customerData.email });
    if (!customer) {
      customer = await new Customer({
        ...customerData,
      });
    }
    return customer;
  } catch (error) {
    console.error(error);
  }
};
