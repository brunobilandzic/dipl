import { AppSelect } from "../form/inputs";

export const ChooseWorker = ({ workers, onChoose }) => {
  return (
    <AppSelect
      label="Radnik"
      name="workerId"
      onChange={onChoose}
      options={workers.map((worker) => ({
        label: `${worker.appUser.name} ${worker.appUser.surname}`,
        value: worker._id,
      }))}
      placeholder="Odaberi radnika"
    />
  );
};
