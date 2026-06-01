import { Procurment } from "@/models/documents/Procurment";

export const getProcurments = async (rootManagerId) => {
  return await Procurment.find({ manager: rootManagerId });
};
