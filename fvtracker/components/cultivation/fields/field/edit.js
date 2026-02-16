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
    dimensions:
      newCACoordinates?.planted?.length > 0
        ? utils.cultivation.cultivationAreas.getDimensionsForNewCA(
            newCACoordinates.beginX,
            newCACoordinates.beginY,
            newCACoordinates.endX,
            newCACoordinates.endY,
          )
        : {
            width: "",
            length: "",
          },
  });

  useEffect(() => {
    console.log("createForm\n", createForm);
  }, [createForm]);

  function onAdd() {}
  return (
    <>
      <Modals.FormModal isOpen={true} onClose={() => {setCreateForm({ ...createForm, isOpen: false })}} title="Create Cultivation Area">

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
