import { PROCURMENT_APPROVED } from "@/lib/constants/documents/procurments";

export const procurmentValue = (proc) => {
  return proc.items.reduce((acc, item) => {
    return acc + item.quantity * item.price;
  }, 0);
};

export const paidProcurmentsValue = (procs) => {
  return procs
    .filter((proc) => proc.status === PROCURMENT_APPROVED)
    .map(procurmentValue)
    .reduce((acc, value) => acc + value, 0);
};
