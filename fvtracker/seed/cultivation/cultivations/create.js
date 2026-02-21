import cultivation from "@/lib/cultivation";

export async function createCultivations() {
  const { fields, cropData } = await cultivation.crops.fieldCropData();

  console.log(`\nSeeding cultivations for ${fields.length} fields...`);

  // Here you would implement the logic to create cultivation areas based on the fields and crop data.
  // This is a placeholder to indicate where that logic would go.
  console.log("Creating cultivation areas...\n");

  for (const field of fields) {
    console.log(`Creating cultivation area for field: ${field.name}`);

    for (const cultivationArea of field.cultivationAreas) {
      console.log(`Processing cultivation area: ${cultivationArea.name}`);
      const planted = cultivationArea.planted;
      console.log(typeof planted);
    }
  }
}


function getCultivationDimensions(cultivationArea, planted) {
  const { length, width } = cultivationArea;
  const plantedEmpty = Object.keys(planted).reduce((acc, key) => {
    if (planted[key] === null) acc += 1;
    return acc;
  }, 0);
}
