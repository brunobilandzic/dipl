import { Field } from "@/models/sectors/cultivation/Field";
import { CultivationManager } from "@/models/user/managers/CultivationManager";

export const seedFields = async () => {
  const width_max = 1000;
  const length_max = 1000;
  const width_min = 100;
  const length_min = 100;
  
  const manager = await CultivationManager.findOne()
  let width, length;

  while (true) {
    width = Math.floor(Math.random() * (width_max - width_min + 1)) + width_min;
    length =
      Math.floor(Math.random() * (length_max - length_min + 1)) + length_min;
    if (width <= width_max && length <= length_max) break;
  }

  const field = new Field({
    name: `Field`,
    description: `Auto-generated field`,
    manager: manager._id,
    location: KRC_LOCATION,
    width: width,
    length: length,
  });

  console.log(`\n\nPOLJE SKORIN KRC\n\n${field}\n\n`);

  await field.save();
};

const KRC_LOCATION = { latitude: 43.614585, longitude: 16.629554 };
