import { FaPlus } from "react-icons/fa";
import utils from "@/lib/utils";
import { useEffect, useState } from "react";
import Modals from "@/components/layout/modals";
import { AppInput, AppTextArea } from "@/components/form/inputs";
import { handleApiError } from "@/lib/constants/errors/client/api";
import api from "@/lib/api";

export function FieldEditDashboard({
  getNewCOCoordinates,
  cultivationAreaDimensions,
  fieldId,
}) {
  return (
    <div className="w-full flex justify-center items-center">
      <CreateNewField
        getNewCOCoordinates={getNewCOCoordinates}
        cultivationAreaDimensions={cultivationAreaDimensions}
        fieldId={fieldId}
      />
    </div>
  );
}

function CreateNewField({
  getNewCOCoordinates,
  cultivationAreaDimensions,
  fieldId,
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

  const [isOpen, setIsOpen] = useState(false);
  const [newCADetails, setnewCADetails] = useState(initialnewCADetails);
  const [newCACoordinates, setNewCACoordinates] = useState(null);

  const updateDimensions = (beginX, beginY, endX, endY) => {
    const dimensions = utils.cultivation.cultivationAreas.getDimensionsForNewCA(
      beginX,
      beginY,
      endX,
      endY,
    );
    setnewCADetails({
      ...newCADetails,
      dimensions,
    });
  };

  useEffect(() => {
    if (newCACoordinates?.planted?.length > 0) {
      updateDimensions(
        newCACoordinates.begin.x,
        newCACoordinates.begin.y,
        newCACoordinates.end.x,
        newCACoordinates.end.y,
      );
    }
  }, [newCACoordinates]);

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
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label>Ime</label>
            <AppInput
              type="text"
              value={newCADetails.name}
              onChange={(e) => onFormChange("name", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Opis</label>
            <AppTextArea
              value={newCADetails.description}
              onChange={(e) => onFormChange("description", e.target.value)}
            />
          </div>
          <div className="">
            <div className="grid grid-cols-2 grid-rows-2 w-fit gap-2">
              <div className="font-bold">Duljina</div>
              <div className="font-bold">Širina</div>
              <div className="">
                {newCACoordinates?.dimensions?.length || 0}
              </div>
              <div className="">{newCACoordinates?.dimensions?.width || 0}</div>
            </div>
          </div>
        </div>
      </Modals.FormModal>
      <div
        onClick={onAdd}
        className="flex flex-col justify-center items-center gap-4 cursor-pointer"
      >
        <FaPlus className="text-4xl" />
        <div className="text-sm">Add Cultivation Area</div>
      </div>
    </>
  );
}
