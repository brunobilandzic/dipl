import { createPlantedCropVarietiesCells } from "@/lib/cultivation/plants";

const { Cultivation } = require("@/models/sectors/cultivation/Cultivation");

export const createCultivation = async ({ cultivationArea, planted }) => {
  const newCultivation = new Cultivation({
    cultivationArea: cultivationArea._id,
    name: `Kultivacija ${new Date().toLocaleTimeString()}`,
    description: "Opis kultivacije 1",
  });
  const relativeCoords = [];
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      relativeCoords.push(`${i},${j}`);
    }
  }

  const plantedCropVarieties = await createPlantedCropVarietiesCells({
    relativeCoords,
    planted: cultivationArea.planted,
    cultivationId: newCultivation._id.toString(),
  });

  newCultivation.plantedCropVarieties = plantedCropVarieties.map((p) => p._id);

  cultivationArea.cultivations.push(newCultivation._id);
  await cultivationArea.save();

  await newCultivation.save();
  console.log({ newCultivation });
  return newCultivation;
};
