import { FaPlus } from "@react-icons/all-files/fa/FaPlus";
import utils from "@/lib/utils";
import { useEffect, useState } from "react";
import Modals from "@/components/layout/modals";
import { AppInput, AppTextArea } from "@/components/form/inputs";
import { handleApiError } from "@/lib/constants/errors/client/api";
import api from "@/lib/api";
import { useDispatch } from "react-redux";
import { createCultivationArea } from "@/store/cultivation/";
import styles from "@/components/form/form.module.css";
import { checkEmpty } from "@/lib/utils/objects";

function CreateCA({
  getNewCOCoordinates,
  emptyCACoordinates,
  setField,
  fieldId,
  setIsBeginSelected,
  newCACoordinates,
  setNewCACoordinates,
}) {
  const initialnewCADetails = {
    field: fieldId,
    name: "",
    description: "",
    dimensions: {
      width: "",
      length: "",
    },
  };
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [newCADetails, setnewCADetails] = useState(initialnewCADetails);

  const onFormChange = (field, value) => {
    setnewCADetails({
      ...newCADetails,
      [field]: value,
    });
  };

  function onAdd() {
    setIsOpen(true);
    setNewCACoordinates(getNewCOCoordinates());
  }

  async function onSubmit() {
    if (!newCACoordinates?.planted?.length > 0) {
      alert("Niste odabrali područje za sadnju");
      return;
    }
    try {
      const cultivationArea =
        utils.cultivation.cultivationAreas.prepareCulitvationArea({
          newCADetails,
          newCACoordinates,
        });

      if (
        cultivationArea.planted.size === 0 ||
        !cultivationArea.dimensions.width ||
        !cultivationArea.dimensions.length
      ) {
        alert("Područje za sadnju nije ispravno definirano");
        return;
      }
      const res = await api.post(
        "/cultivation/cultivation-area",
        cultivationArea,
      );
      const { newCultivationArea } = res.data;
      alert(
        `Uspješno kreirano područje: ${newCultivationArea?.name} dimenzija ${utils.strings.dimensionsString(newCultivationArea.dimensions)} sa ${Object.keys(newCultivationArea.planted).length} ćelija.`,
      );
      setIsBeginSelected(false);
      setIsOpen(false);
      setnewCADetails(initialnewCADetails);
      emptyCACoordinates();
      dispatch(createCultivationArea(newCultivationArea));
      setField((prevField) => ({
        ...prevField,
        cultivationAreas: [...prevField.cultivationAreas, newCultivationArea],
      }));
    } catch (error) {
      console.log("api error", error);
      handleApiError({
        ...error,
        generalMessage: "Greška prilikom kreiranja polja",
      });
    }
  }

  const onCancel = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Modals.FormModal
        isOpen={isOpen}
        onCancel={onCancel}
        title="Napravi novo područje"
        onSubmit={onSubmit}
        submitDisabled={checkEmpty(newCADetails, true)}
      >
        <div className={`form`}>
          <div className={``}>
            <AppInput
              type="text"
              label="Ime"
              value={newCADetails.name}
              onChange={(e) => onFormChange("name", e.target.value)}
            />
          </div>
          <div className={` `}>
            <AppTextArea
              label="Opis"
              value={newCADetails.description}
              onChange={(e) => onFormChange("description", e.target.value)}
            />
          </div>
          <div
            className={`${styles.info} grid grid-cols-2 grid-rows-2 w-fit gap-2 mt-6`}
          >
            <div className="font-bold">Duljina</div>
            <div className="font-bold">Širina</div>
            <div className="">{newCACoordinates?.dimensions?.length || 0}</div>
            <div className="">{newCACoordinates?.dimensions?.width || 0}</div>
          </div>
        </div>
      </Modals.FormModal>
      <div
        onClick={onAdd}
        className={`${newCACoordinates?.planted?.length > 1 ? "flex" : "hidden"} flex flex-col justify-center items-center gap-4 cursor-pointer`}
      >
        <div>
          <FaPlus className="text-4xl" />
        </div>
        <div className="text-sm">Dodaj područje kultivacije</div>
      </div>
    </>
  );
}

export default CreateCA;
