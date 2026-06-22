import api from "../../../api";
import handleError from "../../../constants/errors/client/handleError";
import { cropVarietyFullName } from "../../strings";

export const harvestingBatchItemData = ({ batchItem }) => {
  const cropVarietyString = cropVarietyFullName(batchItem.cropVariety);
  const quality = batchItem.quality;
  const plcvCount = batchItem.plantedCropVarieties?.length || 0;
  const quantity = batchItem.batchQuantity;

  return {
    quantity,
    batchItemString: `${cropVarietyString} (${quality})`,
    plcvCount,
  };
};

