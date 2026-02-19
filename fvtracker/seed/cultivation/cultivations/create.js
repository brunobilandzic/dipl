import cultivation from "@/lib/cultivation";

export async function createCultivations() {
  const fields = await cultivation.fields.list();
  console.log(`Seeding cultivations for ${fields.length} fields...`);
}
