import { CropVariety } from "@/models/sectors/cultivation/Crops";
import { Ingredient } from "@/models/sectors/production/Product";

const fooo = async ({ ingredientsDb, updatedIngredients }) => {
  const existingIngredientIds = ingredientsDb.map((ing) => ing._id.toString());
  const updatedIngredientIds = updatedIngredients
    .filter((ing) => ing.id)
    .map((ing) => ing.id);

  const toDeleteIngredientIds = existingIngredientIds.filter(
    (id) => !updatedIngredientIds.includes(id),
  );

  await Ingredient.deleteMany({ _id: { $in: toDeleteIngredientIds } });

  const ingredients = [];
  for (const ing of updatedIngredients) {
    if (ing.id) {
      const ingredient = await Ingredient.findOneAndUpdate(
        { _id: ing.id },
        { ...ing },
        { new: true },
      );
    } else {
      const cropVariety = await CropVariety.findOne({
        name: ing.cropVarietyName,
      });
      const ingredient = new Ingredient({
        product: product._id,
        cropVariety: cropVariety._id,
        quantity: ing.quantity,
      });
      cropVariety.ingredients.push(ingredient._id);
      await ingredient.save();
      ingredients.push(ingredient);
    }
  }
};
