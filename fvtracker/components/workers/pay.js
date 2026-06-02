import { AppInput } from "../form/inputs";
import { FormModal } from "../layout/modals/form";
import { useDispatch } from "react-redux";
import { payWorker } from "@/lib/utils/workers/pay";
import { useState } from "react";

export const PayWorkerModal = ({ worker, onClose }) => {
  const [amount, setAmount] = useState("");
  const dispatch = useDispatch();

  return (
    <>
      <FormModal
        title="Isplata radnika"
        onClose={onClose}
        onSubmit={async () => {
          await payWorker({ workerId: worker.id, amount, dispatch });
          onClose();
        }}
        isOpen={true}
      >
        <div className="form-group">
          <AppInput
            label="Iznos isplate"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </FormModal>
    </>
  );
};

export const PayActionButton = ({ setShowPayModal }) => {
  return (
    <>
      <div className="btn btnSm" onClick={() => setShowPayModal(true)}>
        Isplata
      </div>
    </>
  );
};
