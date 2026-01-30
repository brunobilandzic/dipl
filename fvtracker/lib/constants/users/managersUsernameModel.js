export const userNameToModel = {
  "general.manager": "GeneralManager",
  "cultivation.manager": "CultivationManager",
  "financial.manager": "FinancialManager",
  "production.manager": "ProductionManager",
  "warehouse.manager": "WarehouseManager",
};

function modelToUsername() {
  modelToUsername = {};

  for (const [username, model] of Object.entries(userNameToModel)) {
    modelToUsername[model] = username;
  }

  return modelToUsername;
}

export const userModelToName = modelToUsername();
