export const workPay = ({ works }) => {
  let totalPay = 0;
  for (const work of works) {
    totalPay += work.hoursWorked * work.worker.hourlyRate;
  }
  return totalPay;
};
