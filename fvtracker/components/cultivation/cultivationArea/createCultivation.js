import Modals from "@/components/layout/modals";
import { AppInput, AppSelect, AppTextArea } from "@/components/form/inputs";
import styles from "@/components/form/form.module.css";
import culConstants from "@/lib/constants/cultivation";
import { use, useEffect } from "react";
import { useSelector } from "react-redux";

export function CreateCultivation({
  isOpen,
  onCancel,
  onSubmit,
  newCUDetails,
  setNewCUDetails,
  existingCultivations,
}) {
  const workers = useSelector((state) => state.workers.items);
  const workerType = useSelector((state) => state.user.session.workerType);
  
  const onFormChange = (field, value) => {
    setNewCUDetails({
      ...newCUDetails,
      [field]: value,
    });
  };

  useEffect(() => {
    console.log("newCUDetails:", newCUDetails);
  }, [newCUDetails]);

  return (
    <>
      <Modals.FormModal
        isOpen={isOpen}
        onCancel={onCancel}
        title="Napravi nove gredice"
        onSubmit={onSubmit}
      >
        <div className={`form`}>
          <div className={``}>
            {existingCultivations && existingCultivations.length > 0 ? (
              <AppSelect
                label={culConstants.names.CHOOSE_CULTIVATION}
                onChange={(e) =>
                  onFormChange("existingCulName", e.target.value)
                }
                options={existingCultivations.map((cul) => ({
                  label: cul.name,
                  value: cul.name,
                }))}
                defaultValue={newCUDetails.existingCulName}
              ></AppSelect>
            ) : null}
          </div>
          {!newCUDetails.existingCulName ||
          newCUDetails.existingCulName ===
            culConstants.names.NEW_CULTIVATION ? (
            <>
              <div className={``}>
                <AppInput
                  type="text"
                  label="Ime"
                  value={newCUDetails.name}
                  onChange={(e) => onFormChange("name", e.target.value)}
                />
              </div>
              <div className={` `}>
                <AppTextArea
                  label="Opis"
                  value={newCUDetails.description}
                  onChange={(e) => onFormChange("description", e.target.value)}
                />
              </div>
              <div>
                {!workerType && (
                  <AppSelect
                    label="Radnik"
                    onChange={(e) => onFormChange("workerId", e.target.value)}
                    options={workers.map((worker) => ({
                      label: `${worker.appUser.name} ${worker.appUser.surname}`,
                      value: worker._id,
                    }))}
                    defaultValue={newCUDetails.workerId}
                  />
                )}
              </div>
              <div
                className={`${styles.info} grid grid-cols-2 grid-rows-2 w-fit gap-2 mt-6`}
              >
                <div className="font-bold">Duljina</div>
                <div className="font-bold">Širina</div>
                <div className="">{newCUDetails?.dimensions?.length || 1}</div>
                <div className="">{newCUDetails?.dimensions?.width || 1}</div>
              </div>
            </>
          ) : null}
        </div>
      </Modals.FormModal>
    </>
  );
}
