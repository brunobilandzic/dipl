import Modals from "@/components/layout/modals";
import { AppInput, AppSelect, AppTextArea } from "@/components/form/inputs";
import styles from "@/components/form/form.module.css";
import culConstants from "@/lib/constants/cultivation";
import { use, useEffect } from "react";
import { useSelector } from "react-redux";
import { checkEmpty } from "@/lib/utils/objects";

export function CreateCultivation({
  isOpen,
  onCancel,
  onSubmit,
  newCUDetails,
  setNewCUDetails,
  existingCultivations,
}) {
  const onFormChange = (field, value) => {
    setNewCUDetails({
      ...newCUDetails,
      [field]: value,
    });
  };

  useEffect(() => {
    console.log("newCUDetails:", newCUDetails);
  }, [newCUDetails]);

  const isSubmitDisabled = () => {
    if (!existingCultivations || existingCultivations.length === 0 || !newCUDetails.existingCulName) {
      const { existingCulName, ...dataToCheck } = newCUDetails;
      return checkEmpty(dataToCheck, true);
    } else if (newCUDetails.existingCulName) {
      return false;
    }
  };
  return (
    <>
      <Modals.FormModal
        isOpen={isOpen}
        onCancel={onCancel}
        title="Napravi nove gredice"
        onSubmit={onSubmit}
        submitDisabled={isSubmitDisabled()}
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
                value={newCUDetails.existingCulName}
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
