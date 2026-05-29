export const workPay = ({ hourlyRate, works }) => {
  let totalPay = 0;
  for (const work of works) {
    totalPay += work.hoursWorked * hourlyRate;
  }
  return totalPay;
};
