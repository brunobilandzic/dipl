export const getProcurments = async (rootManagerId) => {
  return await Procurment.find({ manager: rootManagerId });
};
