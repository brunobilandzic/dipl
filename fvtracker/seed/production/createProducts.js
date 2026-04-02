import { CropVariety } from "@/models/sectors/cultivation/Crops";
import { products } from "../data/production";
import { Ingredient, Product } from "@/models/sectors/production/Product";
import { makeUrlFriendly } from "@/lib/utils/strings";

export const createProducts = async () => {
  await Product.deleteMany({}); // Clear existing products
  await Ingredient.deleteMany({}); // Clear existing ingredients
  console.log("Creating products...");
  for (const productData of products) {
    const cropVarieties = await CropVariety.find({
      name: { $in: productData.cropVarieties },
    });

    const product = new Product({
      name: productData.name,
      slug: makeUrlFriendly(productData.name),
      description: productData.description,
      price: productData.price,
    });

    await product.save();
    await product.createIngredients({
      ingredientsData: productData.ingredients,
    });
  }
};
