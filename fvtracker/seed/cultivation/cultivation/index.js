import { createPlantedCropVarietiesCells } from "@/lib/cultivation/plants";
import { Cultivation } from "@/models/sectors/cultivation/Cultivation";

export const createCultivation = async ({ cultivationArea, planted }) => {
  const newCultivation = new Cultivation({
    cultivationArea: cultivationArea._id,
    name: `Kultivacija ${new Date().toLocaleTimeString()}`,
    description: "Opis kultivacije 1",
  });
  await newCultivation.save();
  const relativeCoords = [];
  for (let i = 0; i < Math.floor(cultivationArea.dimensions.width / 2); i++) {
    for (
      let j = 0;
      j < Math.floor(cultivationArea.dimensions.length / 2);
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
  console.log(`created empty planted crop varieties, e.g. created cultivation`);
  newCultivation.plantedCropVarieties = plantedCropVarieties.map((p) => p._id);

  cultivationArea.cultivations.push(newCultivation._id);
  await cultivationArea.save();

  await newCultivation.save();
  return newCultivation;
};
