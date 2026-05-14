import {
  CULTIVATION_MANAGER,
  PRODUCTION_MANAGER,
  GENERAL_MANAGER,
  WAREHOUSE_MANAGER,
} from "@/lib/constants/users/managerTypes";

export const managerSelectionTypes = {
  CULTIVATION_MANAGER: "cultivationManagers",
  FINANCIAL_MANAGER: "financialManagers",
  PRODUCTION_MANAGER: "productionManagers",
  WAREHOUSE_MANAGER: "warehouseManagers",
  GENERAL_MANAGER: "generalManagers",
};

export const findManagerName = ({ managersType }) => {
  switch (managersType) {
    case managerSelectionTypes.CULTIVATION_MANAGER:
      return CULTIVATION_MANAGER;
    case managerSelectionTypes.FINANCIAL_MANAGER:
      return FINANCIAL_MANAGER;
    case managerSelectionTypes.PRODUCTION_MANAGER:
      return PRODUCTION_MANAGER;
    case managerSelectionTypes.WAREHOUSE_MANAGER:
      return WAREHOUSE_MANAGER;
    case managerSelectionTypes.GENERAL_MANAGER:
      return GENERAL_MANAGER;
    default:
      return null;
  }
};
