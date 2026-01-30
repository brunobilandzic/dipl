export const usernameToModel = {
  "general.manager": "GeneralManager",
  "cultivation.manager": "CultivationManager",
  "financial.manager": "FinancialManager",
  "production.manager": "ProductionManager",
  "warehouse.manager": "WarehouseManager",
};

function createModelToUsername() {
  const modelToUsername = {};

  for (const [username, model] of Object.entries(usernameToModel)) {
    modelToUsername[model] = username;
  }

  return modelToUsername;
}

export const modelToUsername = createModelToUsername();