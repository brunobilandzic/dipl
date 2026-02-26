import { getDimensionsFromPlanted } from "@/lib/utils/cultivationAreas";

export async function createCultivation({ cultivationArea }) {
    const variety = await chooseRandomCropVariety();
    const caCells = cultivationArea.planted;


    const caDimensios = getDimensionsFromPlanted(caCells);
}

async function chooseRandomCropVariety() {
  const varieties = await CropVariety.find({}).populate("cropType");
  const randomVariety = varieties[Math.floor(Math.random() * varieties.length)];
}
