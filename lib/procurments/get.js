import { Procurment } from "@/models/documents/Procurment";
import populateConfigProcurments from "./populate";

export const getProcurments = async (rootManagerId) => {
  return await Procurment.find({ manager: rootManagerId });
};

export const getAllProcurments = async () => {
  return await Procurment.find().populate(populateConfigProcurments);
};
