import React, {useEffect} from "react";
import Modals from "@/components/layout/modals";

export const EditCA = ({
  selectedCultivationArea,
  setSelectedCultivationArea,
}) => {
  
  return (
    <>
      {selectedCultivationArea ? (
        <Modals.FormModal
        onCancel={() => setSelectedCultivationArea(null)}
        isOpen={!!selectedCultivationArea}
          title="Edit Cultivation Area"
          onClose={() => setSelectedCultivationArea(null)}
        >
          {" "}
          <div>modal</div>{" "}
        </Modals.FormModal>
      ) : null}
    </>
  );
};
