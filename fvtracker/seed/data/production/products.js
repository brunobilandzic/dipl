import { PREMIUM, STANDARD } from "@/lib/constants/cultivation/plants";

export const productsData = [
  /* {
    name: "Cherry rajčica Paket 10 komada",
    description: "Paket od 10 komada cherry rajčice",
    price: 5,
    ingredients: [
      {
        cropVarietyName: "Cherry rajčica",
        quantity: 10,
      },
    ],
  },
  {
    name: "Kuhani špinat konzerva 400g",
    description: "Konzerva od kuhanih špinata",
    price: 2,
    ingredients: [
      {
        cropVarietyName: "Obični špinat",
        quantity: 5,
      },
    ],
  },
  {
    name: "Salata mix",
    description: "Mješavina različitih salata",
    price: 4,
    ingredients: [
      {
        cropVarietyName: "Iceberg",
        quantity: 5,
      },
      {
        cropVarietyName: "Kristalka",
        quantity: 5,
      },
    ],
  }, */
  {
    name: "Jabuka Idared 1kg",
    description: "1 kilogram jabuka sorte Idared",
    price: 3,
    ingredients: [
      {
        cropVarietyName: "Idared",
        quantity: 10,
        quality: STANDARD,
      },
    ],
    stockVolume: 4,
  },
  {
    name: "Kristalka mix",
    description: "Mješavina različitih kristalka",
    price: 4,
    ingredients: [
      {
        cropVarietyName: "Kristalka",
        quantity: 10,
        quality: STANDARD,
      },
    ],
    stockVolume: 3,
  },
  {
    name: "Premium Idared 1kg",
    description: "1 kilogram premium jabuka sorte Idared",
    price: 5,
    ingredients: [
      {
        cropVarietyName: "Idared",
        quantity: 10,
        quality: PREMIUM,
      },
    ],
    stockVolume: 2,
  },
];
