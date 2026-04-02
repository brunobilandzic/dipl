import { CropVariety } from "@/models/sectors/cultivation/Crops";
import { products } from "../data/production";
import { Ingredient, Product } from "@/models/sectors/production/Products";

export const createProducts = async () => {
  await Product.deleteMany({}); // Clear existing products
  await Ingredient.deleteMany({}); // Clear existing ingredients
  console.log("Creating products...");
  for (const productData of products) {
    const cropVarieties = await CropVariety.find({
      name: { $in: productData.cropVarieties },
    });
    const cropVarietyIds = cropVarieties.map((cv) => cv._id);
    const product = new Product({
      name: productData.name,
    });

    await product.createIngredients({
      ingredientsData: productData.ingredients,
    });
    await product.save();
  }
};
