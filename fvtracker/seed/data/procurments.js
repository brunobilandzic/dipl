import {
  CULTIVATION_MANAGER,
  PRODUCTION_MANAGER,
  WAREHOUSE_MANAGER,
  FINANCIAL_MANAGER,
} from "@/lib/constants/users/managerTypes";

export const procurments = {
  [CULTIVATION_MANAGER]: [
    {
      name: "Lopata metalna",
      quantity: 10,
      price: 150,
    },
    {
      name: "Gnojivo",
      quantity: 20,
      price: 200,
    },
  ],
  [PRODUCTION_MANAGER]: [
    {
      name: "Mlin za žito",
      quantity: 2,
      price: 5000,
    },
    {
      name: "Transporter",
      quantity: 1,
      price: 3000,
    },
  ],
  [WAREHOUSE_MANAGER]: [
    {
      name: "Polica za skladištenje",
      quantity: 5,
      price: 800,
    },
    {
      name: "Paleta",
      quantity: 10,
      price: 500,
    },
  ],
  [FINANCIAL_MANAGER]: [
    { name: "Računovodstveni softver", quantity: 1, price: 2000 },
    {
      name: "Knjigovodstvene usluge",
      quantity: 1,
      price: 1500,
    },
  ],
};
