import { Procurment } from "@/models/documents/Procurment";
import populateProcurmenConfig from "./populate";

export const createProcurment = async (procurmentData) => {
  const procurment = new Procurment(procurmentData);
  await procurment.populate(populateProcurmenConfig);
  await procurment.save();
  return procurment;
};
