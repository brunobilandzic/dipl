import { EMPLOYMENT_STATUS_EMPLOYED } from "@/lib/constants/users/workers";
import { AppSelect } from "../form/inputs";

export const ChooseWorker = ({ workers, onChoose }) => {
  const workerOptions = workers.filter(
    (w) => w.employmentRequest.status === EMPLOYMENT_STATUS_EMPLOYED,
  );
  return (
    <AppSelect
      label="Radnik"
      name="workerId"
      onChange={onChoose}
      options={workerOptions.map((worker) => ({
        label: `${worker.appUser.name} ${worker.appUser.surname}`,
        value: worker._id,
      }))}
      placeholder="Odaberi radnika"
    />
  );
};
