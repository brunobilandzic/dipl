import { FaPlus } from "react-icons/fa";
import utils from "@/lib/utils";
import { useEffect, useState } from "react";
import Modals from "@/components/layout/modals";

export function FieldEditDashboard({ newCACoordinates }) {
  return (
    <div className="w-full flex justify-center items-center">
      <CreateField newCACoordinates={newCACoordinates} />
    </div>
  );
}

function CreateField({ newCACoordinates }) {
  const [createForm, setCreateForm] = useState({
    isOpen: false,
    name: "",
    description: "",
    dimensions: {
      width: "",
      length: "",
    },
  });

  const updateDimensions = (beginX, beginY, endX, endY) => {
    const dimensions = utils.cultivation.cultivationAreas.getDimensionsForNewCA(
      beginX,
      beginY,
      endX,
      endY,
    );
    console.log("dimensions\n", dimensions);
    setCreateForm({
      ...createForm,
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
  }, [newCACoordinates?.end]);

  useEffect(() => {
    console.log("createForm\n", createForm);
  }, [createForm]);

  function onAdd() {
    setCreateForm({
      ...createForm,
      isOpen: true,
    });
  }
  return (
    <>
      <Modals.FormModal
        isOpen={createForm.isOpen}
        onCancel={() => {
          console.log("closing modal");
          setCreateForm({ ...createForm, isOpen: false });
        }}
        title="Create Cultivation Area"
      ></Modals.FormModal>
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
