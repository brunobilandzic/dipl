import Modals from "@/components/layout/modals";
import { AppInput, AppTextArea } from "@/components/form/inputs";
import styles from "@/components/form/form.module.css";


export function Cultivate({
  cultivationAreaId,
  cultivations,
  cultivationOpen,
  setCultivationOpen,
  onSubmit,
  newCUDetails,
  setNewCUDetails,
}) {

    const onFormChange = (field, value) => {
    setNewCUDetails({
      ...newCUDetails,
      [field]: value,
    });
  };

  return (
    <>
      <Modals.FormModal
        isOpen={cultivationOpen}
        onCancel={() => setCultivationOpen(false)}
        title="Napravi novo područje"
        onSubmit={onSubmit}
      >
        <div className={`form`}>
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
              label="opis"
              value={newCUDetails.description}
              onChange={(e) => onFormChange("description", e.target.value)}
            />
          </div>
          <div
            className={`${styles.info} grid grid-cols-2 grid-rows-2 w-fit gap-2 mt-6`}
          >
            <div className="font-bold">Duljina</div>
            <div className="font-bold">Širina</div>
            <div className="">{newCUDetails?.dimensions?.length || 0}</div>
            <div className="">{newCUDetails?.dimensions?.width || 0}</div>
          </div>
        </div>
      </Modals.FormModal>
    </>
  );
}
