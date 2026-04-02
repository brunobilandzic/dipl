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
