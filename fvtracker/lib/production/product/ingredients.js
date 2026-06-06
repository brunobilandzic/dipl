import { CropVariety } from "@/models/sectors/cultivation/Crops";
import { Ingredient } from "@/models/sectors/production/Product";

export const updateIngredients = async ({
  ingredientsDb,
  updatedIngredients,
  productId,
}) => {
  const existingIngredientIds = ingredientsDb.map((ing) => ing._id.toString());
  const updatedIngredientIds = updatedIngredients
    .filter((ing) => ing._id)
    .map((ing) => ing._id);

  const toDeleteIngredientIds = existingIngredientIds.filter(
    (id) => !updatedIngredientIds.includes(id),
  );

  await Ingredient.deleteMany({ _id: { $in: toDeleteIngredientIds } });

  const ingredients = [];
  for (const ing of updatedIngredients) {
    if (ing._id) {
      const ingredient = await Ingredient.findOneAndUpdate(
        { _id: ing._id },
        { ...ing },
        { new: true },
      );
      ingredients.push(ingredient);
      const cropVariety = await CropVariety.findById(ing.cropVariety);
      if (!cropVariety) {
        throw new Error(`Crop variety ${ing.cropVariety} not found.`);
      }

      cropVariety.ingredients.push(ingredient._id);
      await cropVariety.save();
    } else {
      //create new ingredient
      const cropVariety = await CropVariety.findById(ing.cropVariety);
      if (!cropVariety) {
        throw new Error(`Crop variety ${ing.cropVariety} not found.`);
      }
      const ingredient = new Ingredient({
        product: productId,
        cropVariety: cropVariety._id,
        quantity: ing.quantity,
      });

      cropVariety.ingredients.push(ingredient._id);
      await cropVariety.save();
      ingredients.push(ingredient);
    }
  }

  for (const ing of ingredients) {
    await ing.save();
  }

  return ingredients.map((ing) => ing._id);
};

export const populateProductIngredients = async ({ products }) => {
  await Promise.all(
    products.map((product) =>
      product.populate({
        path: "ingredients",
        populate: {
          path: "cropVariety",
          populate: {
            path: "cropType",
          },
        },
      }),
    ),
  );
};

export const populateIngredientsConfig = {
  path: "ingredients",
  select: "cropVariety quantity quality",
  populate: {
    path: "cropVariety",
    select: "name cropType",
    populate: {
      path: "cropType",
      select: "name generalType",
      populate: { path: "generalType", select: "name" },
    },
  },
};
