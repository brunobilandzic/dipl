export const usernameToModel = {
  "gm": "GeneralManager",
  "cm": "CultivationManager",
  "fm": "FinancialManager",
  "pm": "ProductionManager",
  "wm": "WarehouseManager",
};

function createModelToUsername() {
  const modelToUsername = {};

  for (const [username, model] of Object.entries(usernameToModel)) {
    modelToUsername[model] = username;
  }

  return modelToUsername;
}

export const modelToUsername = createModelToUsername();