import { CropVariety } from "@/models/sectors/cultivation/Crops";
import { Ingredient, Product } from "@/models/sectors/production/Product";

export const getProducts = async () => {
  const products = await Product.find().populate([
    {
      path: "ingredients",
      select: "cropVariety quantity",
      populate: {
        path: "cropVariety",
        select: "name",
      },
    },
  ]);
  return products;
};

export const getProductBySlug = async (slug) => {
  const product = await Product.findOne({ slug }).populate([
    {
      path: "ingredients",
      select: "cropVariety quantity",
      populate: {
        path: "cropVariety",
        select: "name",
      },
    },
  ]);
  return product;
};

export const updateProduct = async ({ _updatedProduct, productId }) => {
  const { ingredients: updatedIngredients, ...updatedProduct } =
    _updatedProduct;
  const product = await Product.findByIdAndUpdate(
    productId,
    { $set: updatedProduct },
    { new: true },
  ).populate({
    path: "ingredients",
    populate: { path: "cropVariety", select: "name" },
  });

  console.log("Updated product:", product);
  return product;
};
