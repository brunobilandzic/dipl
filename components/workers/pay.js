import { AppInput } from "../form/inputs";
import { FormModal } from "../layout/modals/form";
import { useDispatch } from "react-redux";
import { payWorker } from "@/lib/utils/workers/pay";
import { useState } from "react";
import { preventEvent } from "@/lib/utils/dev";
import { checkValue } from "@/lib/utils/formValidation";

export const PayWorkerModal = ({ worker, onClose }) => {
  const [amount, setAmount] = useState("");
  const dispatch = useDispatch();

  return (
    <>
      <FormModal
        title="Isplata radnika"
        onClose={onClose}
        onSubmit={async () => {
          await payWorker({ workerId: worker._id, amount, dispatch });
          onClose();
        }}
        isOpen={true}
      >
        <div className="form-group">
          <AppInput
            label="Iznos isplate"
            type="number"
            value={amount}
            onChange={(e) => {
              preventEvent(e);
              const { value, error } = checkValue(e.target.value);
              if (error) {
                alert(error);
              }
              setAmount(value);
            }}
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
