import { RootManager } from "./RootManager";
import { GeneralManager } from "./GeneralManager";
import { Admin } from "@/models/user/Admin";
import { CultivationManager } from "./CultivationManager";
import { WarehouseManager } from "./WarehouseManager";
import { FinancialManager } from "./FinancialManager";
import { ProductionManager } from "./ProductionManager";
import dbConnect from "@/lib/db/mongooseConnect";

await dbConnect();

export default {
  RootManager,
  Admin,
  CultivationManager,
  WarehouseManager,
  GeneralManager,
  FinancialManager,
  ProductionManager,
};
