export const usernameToModel = {
  gm: "GeneralManager",
  cm: "CultivationManager",
  fm: "FinancialManager",
  pm: "ProductionManager",
  wm: "WarehouseManager",
};

function createModelToUsername() {
  const modelToUsername = {};

  for (const [username, model] of Object.entries(usernameToModel)) {
    modelToUsername[model] = username;
  }

  return modelToUsername;
}

export const modelToUsername = createModelToUsername();

export const GENERAL_MANAGER_USERNAME = "gm";
export const CULTIVATION_MANAGER_USERNAME = "cm";
export const FINANCIAL_MANAGER_USERNAME = "fm";
export const PRODUCTION_MANAGER_USERNAME = "pm";
export const WAREHOUSE_MANAGER_USERNAME = "wm";