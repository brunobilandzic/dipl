export const workPayCultivation = ({ hourlyRate, works }) => {
  let totalPay = 0;
  for (const work of works) {
    totalPay += work.hoursWorked * hourlyRate;
  }
  return totalPay;
};

export const workPayProduction = ({ hourlyRate, processes }) => {
  let totalPay = 0;
  for (const process of processes) {
    totalPay += process.quantity * hourlyRate;
  }
  return totalPay;
};
