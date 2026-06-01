import { Procurment } from "@/models/documents/Procurment";

export const createProcurment = async (procurmentData) => {
  const procurment = new Procurment(procurmentData);
  await procurment.save();
  return procurment;
};
