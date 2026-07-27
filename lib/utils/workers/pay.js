import { setLoading } from "@/store/loading";
import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import { updateWorker } from "@/store/workers";

export const workPayCultivation = ({
  hourlyRate,
  plantageWorks,
  harvestWorks,
}) => {
  let totalPay = 0;
  let totalHours = 0;
  for (const work of plantageWorks) {
    totalPay += work.hoursWorked * hourlyRate;
    totalHours += work.hoursWorked;
  }
  for (const work of harvestWorks) {
    totalPay += work.hoursWorked * hourlyRate;
    totalHours += work.hoursWorked;
  }
  return { totalPay, totalHours };
};

export const workPayProduction = ({
  hourlyRate,
  productionProcesses,
  warehouseAcceptanceProcesses,
}) => {
  let totalPay = 0;
  let totalHours = 0;
  for (const process of productionProcesses) {
    totalPay += process.quantity * hourlyRate;
    totalHours += process.quantity;
  }
  for (const process of warehouseAcceptanceProcesses) {
    totalPay += process.quantity * hourlyRate;
    totalHours += process.quantity;
  }
  return { totalPay, totalHours };
};

export const workPayWarehouse = ({ hourlyRate, shipmentItems }) => {
  let totalPay = 0;
  let totalHours = 0;
  for (const item of shipmentItems) {
    for (const source of item.sources) {
      totalPay += source.quantity * hourlyRate;
      totalHours += source.quantity;
    }
  }
  return { totalPay, totalHours };
};

export const workPayFinancial = ({
  hourlyRate,
  receipts,
  warehouseRequests,
}) => {
  let totalPay = 0;
  let totalHours = 0;
  totalHours += receipts.length;
  totalPay += receipts.length * hourlyRate;
  totalHours += warehouseRequests.length;
  totalPay += warehouseRequests.length * hourlyRate;
  return { totalPay, totalHours };
};

export const payWorker = async ({ workerId, amount, dispatch }) => {
  try {
    dispatch(setLoading(true));
    const res = await api.post("/pay", { workerId, amount });
    dispatch(updateWorker(res.data.worker));
  } catch (error) {
    console.error("Error paying worker:", error);
    handleError({
      ...error,
      generalMessage: "Došlo je do greške pri isplati radnika.",
    });
  } finally {
    dispatch(setLoading(false));
  }
};

export const workerTotalPay = (worker) => {
  switch (worker.__t) {
    case "CultivationWorker":
      return workPayCultivation(worker);
    case "ProductionWorker":
      return workPayProduction(worker);
    case "WarehouseWorker":
      return workPayWarehouse(worker);
    case "FinancialWorker":
      return workPayFinancial(worker);
    default:
      return { totalPay: 0, totalHours: 0 };
  }
};
