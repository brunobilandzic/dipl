import api from "../../../api";
import handleError from "../../../constants/errors/client/handleError";

export const harvestingBatchItemData = ({ batchItem }) => {
  const cropVarietyName = batchItem.cropVariety?.name || "N/A";
  const plcvCount = batchItem.plantedCropVarieties?.length || 0;
  const quantity = batchItem.batchQuantity;
  
  return { quantity, cropVarietyName, plcvCount };
};

export const refreshResourceBatches = async ({ dispatch, router }) => {
  try {
    const res = await api.get("/harvest/batches");
    return res.data.harvestingBatches;
  } catch (error) {
    console.error(error);
    handleError(
      {
        ...error,
        generalMessage: "Greška prilikom osvježavanja žetvenih serija",
      },
      router,
    );
  }
};
