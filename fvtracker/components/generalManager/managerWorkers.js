export const ManagerWorkers = ({ workers }) => {
  return (
    <>
      <div>
        Plaće ukupno:{" "}
        {workers.reduce((total, worker) => total + worker.hourlyRate, 0)} €/h
      </div>
      <div>
        Isplaćeno:{" "}
        {workers.reduce((total, worker) => total + worker.payedAmount, 0)} €
      </div>
    </>
  );
};
