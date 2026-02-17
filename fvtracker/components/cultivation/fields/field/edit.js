import { FaPlus } from "react-icons/fa";
import utils from "@/lib/utils";
import { useEffect, useState } from "react";
import Modals from "@/components/layout/modals";
import { AppInput, AppTextArea } from "@/components/form/inputs";
import { handleApiError } from "@/lib/constants/errors/client/api";

export function FieldEditDashboard({
  getNewCOCoordinates,
  cultivationAreaDimensions,
}) {
  return (
    <div className="w-full flex justify-center items-center">
      <CreateField
        getNewCOCoordinates={getNewCOCoordinates}
        cultivationAreaDimensions={cultivationAreaDimensions}
      />
    </div>
  );
}

function CreateField({ getNewCOCoordinates, cultivationAreaDimensions }) {
  const initialnewCADetails = {
    isOpen: false,
    name: "",
    description: "",
    dimensions: {
      width: "",
      length: "",
    },
  };

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
    setnewCADetails((prev) => ({
      ...prev,
      isOpen: !prev.isOpen,
    }));
    setNewCACoordinates(getNewCOCoordinates());
  }

  function onSubmit() {
    if (!newCACoordinates?.planted?.length > 0) {
      alert("Niste odabrali područje za sadnju");
      setnewCADetails(initialnewCADetails);
      return;
    }

    try {
    } catch (error) {
      handleApiError({
        ...error,
        generalMessage: "Greška prilikom kreiranja polja",
      });
    }
  }

  const onCancel = () => {
    setnewCADetails(initialnewCADetails);
  };

  return (
    <>
      <Modals.FormModal
        isOpen={newCADetails.isOpen}
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
