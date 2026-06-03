import { setLoading } from "@/store/loading";
import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import { updateWorker } from "@/store/workers";

export const workPayCultivation = ({ hourlyRate, works }) => {
  let totalPay = 0;
  let totalHours = 0;
  for (const work of works) {
    totalPay += work.hoursWorked * hourlyRate;
    totalHours += work.hoursWorked;
  }
  return { totalPay, totalHours };
};

export const workPayProduction = ({ hourlyRate, processes }) => {
  let totalPay = 0;
  let totalHours = 0;
  for (const process of processes) {
    totalPay += process.quantity * hourlyRate;
    totalHours += process.quantity;
  }
  return { totalPay, totalHours };
};
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
