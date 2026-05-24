import {
  GENERAL_MANAGER_USERNAME,
  CULTIVATION_MANAGER_USERNAME,
  PRODUCTION_MANAGER_USERNAME,
  WAREHOUSE_MANAGER_USERNAME,
  FINANCIAL_MANAGER_USERNAME,
} from "@/lib/constants/users/managersUsernameModel";

const appUsersJsonArray = [
  {
    username: GENERAL_MANAGER_USERNAME,
    modelName: "GeneralManager",
    name: "General",
    surname: "Manager",
    email: "general.manager@example.com",
    password: "$2b$10$bZhXazmzlsC6dlhBw1qunurJDu8eoZ4dmxquWu6Km4Wgm15plMYra",
    provider: "credentials",
  },
  {
    username: "admin",
    modelName: "Admin",
    name: "Admin",
    surname: "Admin",
    email: "admin@example.com",
    password: "$2b$10$bZhXazmzlsC6dlhBw1qunurJDu8eoZ4dmxquWu6Km4Wgm15plMYra",
    provider: "credentials",
  },
  {
    username: CULTIVATION_MANAGER_USERNAME,
    modelName: "CultivationManager",
    sector: "Cultivation",
    name: "Cultivation",
    surname: "Manager",
    email: "cultivation.manager@example.com",
    password: "$2b$10$bZhXazmzlsC6dlhBw1qunurJDu8eoZ4dmxquWu6Km4Wgm15plMYra",
    provider: "credentials",
  },
  {
    username: FINANCIAL_MANAGER_USERNAME,
    modelName: "FinancialManager",
    sector: "Financial",
    name: "Financial",
    surname: "Manager",
    email: "financial.manager@example.com",
    password: "$2b$10$bZhXazmzlsC6dlhBw1qunurJDu8eoZ4dmxquWu6Km4Wgm15plMYra",
    provider: "credentials",
  },
  {
    username: PRODUCTION_MANAGER_USERNAME,
    modelName: "ProductionManager",
    sector: "Production",
    name: "Production",
    surname: "Manager",
    email: "production.manager@example.com",
    password: "$2b$10$bZhXazmzlsC6dlhBw1qunurJDu8eoZ4dmxquWu6Km4Wgm15plMYra",
    provider: "credentials",
  },
  {
    username: WAREHOUSE_MANAGER_USERNAME,
    modelName: "WarehouseManager",
    sector: "Warehouse",
    name: "Warehouse",
    surname: "Manager",
    email: "warehouse.manager@example.com",
    password: "$2b$10$bZhXazmzlsC6dlhBw1qunurJDu8eoZ4dmxquWu6Km4Wgm15plMYra",
    provider: "credentials",
  },
];

export const workersAppUsers = [
  {
    username: "cmw",
    name: "Cultivation",
    surname: "Worker",
    email: "cultivation.worker@example.com",
    password: "$2b$10$bZhXazmzlsC6dlhBw1qunurJDu8eoZ4dmxquWu6Km4Wgm15plMYra",
    provider: "credentials",
  },
];

export const customers = [
  {
    name: "Adam",
    surname: "Johnson",
    email: "adam.johnson@example.com",
    address: "123 Main St, Anytown, USA",
  },
];

export default appUsersJsonArray;
