import {
  CULTIVATION_MANAGER,
  PROCESSING_MANAGER,
  WAREHOUSE_MANAGER,
  FINANCIAL_MANAGER,
} from "@/lib/constants/users/managerTypes";

export const procurments = {
  [CULTIVATION_MANAGER]: [
    {
      item: "Lopata metalna",
      quantity: 10,
      price: 150,
    },
    {
      item: "Gnojivo",
      quantity: 20,
      price: 200,
    },
  ],
  [PROCESSING_MANAGER]: [
    {
      item: "Mlin za žito",
      quantity: 2,
      price: 5000,
    },
    {
      item: "Transporter",
      quantity: 1,
      price: 3000,
    },
  ],
  [WAREHOUSE_MANAGER]: [
    {
      item: "Polica za skladištenje",
      quantity: 5,
      price: 800,
    },
    {
      item: "Paleta",
      quantity: 10,
      price: 500,
    },
  ],
  [FINANCIAL_MANAGER]: [
    { item: "Računovodstveni softver", quantity: 1, price: 2000 },
    {
      item: "Knjigovodstvene usluge",
      quantity: 1,
      price: 1500,
    },
  ],
};
