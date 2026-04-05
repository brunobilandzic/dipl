import {  Product } from "@/models/sectors/production/Product";
import { updateIngredients } from "./ingredients";

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
        select: "name cropType",
        populate: {
          path: "cropType",
          select: "name generalType",
        },
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

  await updateIngredients({
    ingredientsDb: product.ingredients,
    updatedIngredients,
    productId: product._id,
  });

  console.log("Updated product:", product);
  return product;
};
