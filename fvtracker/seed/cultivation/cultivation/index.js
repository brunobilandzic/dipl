import { MAX_CULTIVATION_SIZE } from "@/lib/constants/cultivation/field";
import { createPlantedCropVarietiesCells } from "@/lib/cultivation/plants";
import { min } from "lodash";

const { Cultivation } = require("@/models/sectors/cultivation/Cultivation");

export const createCultivation = async ({ cultivationArea, planted }) => {
  const newCultivation = new Cultivation({
    cultivationArea: cultivationArea._id,
    name: `Kultivacija ${new Date().toLocaleTimeString()}`,
    description: "Opis kultivacije 1",
  });
  await newCultivation.save();
  const relativeCoords = [];
  for (
    let i = 0;
    i <
    min([
      Math.floor(cultivationArea.dimensions.width / 2),
      MAX_CULTIVATION_SIZE,
    ]);
    i++
  ) {
    for (
      let j = 0;
      j <
      min([
        Math.floor(cultivationArea.dimensions.length / 2),
        MAX_CULTIVATION_SIZE,
      ]);
      j++
    ) {
      relativeCoords.push(`${i},${j}`);
    }
  }

  console.log(
    `creating ${relativeCoords.length} empty planted crop varieties...`,
  );

  const plantedCropVarieties = await createPlantedCropVarietiesCells({
    relativeCoords,
    planted: cultivationArea.planted,
    cultivationId: newCultivation._id.toString(),
    fieldId: cultivationArea.field._id.toString(),
  });
  console.log(`created`);
  newCultivation.plantedCropVarieties = plantedCropVarieties.map((p) => p._id);

  cultivationArea.cultivations.push(newCultivation._id);
  await cultivationArea.save();

  await newCultivation.save();
  return newCultivation;
};
