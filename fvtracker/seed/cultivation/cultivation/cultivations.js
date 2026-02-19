import { Field } from "@/models/sectors/cultivation/Field";

export async function seedCultivations() {
    const fields = await Field.find({});

    console.log(`Seeding cultivations for ${fields.length} fields...`);  
}