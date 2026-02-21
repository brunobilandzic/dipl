import cultivation from "@/lib/cultivation";

export async function createCultivations() {
  const { fields, cropData } = await getFieldAndCropData();

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

async function getFieldAndCropData() {
  const fields = await cultivation.fields.list();
  fields.forEach(async (field) => {
    await field.populate({path: "cultivationAreas"});
  });
  const cropData = await cultivation.crops.data();
  return { fields, cropData };
}
