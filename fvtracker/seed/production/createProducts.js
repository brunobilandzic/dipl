import { CropVariety } from "@/models/sectors/cultivation/Crops";
import { products } from "../data/production";
import { Ingredient, Product } from "@/models/sectors/production/Products";

export const createProducts = async () => {
  await Product.deleteMany({}); // Clear existing products
  await Ingredient.deleteMany({}); // Clear existing ingredients
  console.log("Creating products...");
  for (const productData of products) {
    console.log({
      productData,
    });
    const cropVarieties = await CropVariety.find({
      name: { $in: productData.cropVarieties },
    });
    const cropVarietyIds = cropVarieties.map((cv) => cv._id);
    const product = new Product({
      name: productData.name,
    });
    for (const ingredientData of productData.ingredients) {
      const cropVariety = await CropVariety.findOne({
        name: ingredientData.cropVarietyName,
      });
      if (!cropVariety) {
        throw new Error(
          `Crop variety ${ingredientData.cropVarietyName} not found.`,
        );
      }
      const newIngredient = new Ingredient({
        product: product._id,
        cropVariety: cropVariety._id,
        quantity: ingredientData.quantity,
      });
      await newIngredient.save();
      product.ingredients.push(newIngredient._id);
    }

    console.log({ product });
    await product.createIngredients(productData.ingredients);
    await product.save();
  }
};
