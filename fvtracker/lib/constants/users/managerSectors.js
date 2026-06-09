import {
  CULTIVATION_MANAGER,
  FINANCIAL_MANAGER,
  PRODUCTION_MANAGER,
  WAREHOUSE_MANAGER,
} from "./managerTypes";

export default {
  [CULTIVATION_MANAGER]: "Kultivacija",
  [PRODUCTION_MANAGER]: "Proizvodnja",
  [WAREHOUSE_MANAGER]: "Skladište",
  [FINANCIAL_MANAGER]: "Financije",
};

export const sectorManagerMap = {
  Kultivacija: CULTIVATION_MANAGER,
  Proizvodnja: PRODUCTION_MANAGER,
  Skladište: WAREHOUSE_MANAGER,
  Financije: FINANCIAL_MANAGER,
};
