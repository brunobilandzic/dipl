import { Product } from "@/models/sectors/production/Product";
import { updateIngredients } from "./ingredients";
import { makeUrlFriendly } from "@/lib/utils/strings";

export const getProducts = async () => {
  const products = await Product.find()
    .sort({ name: 1 })
    .collation({ locale: "hr", strength: 2 })
    .populate([
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

export const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error(`Product with id ${id} not found.`);
  }
  return product;
};

export const updateProduct = async ({ _updatedProduct, productId }) => {
  const { ingredients: updatedIngredients, ...updatedProduct } =
    _updatedProduct;
  const product = await Product.findByIdAndUpdate(
    productId,
    { $set: updatedProduct },
    { new: true },
  );

  await product.populate({
    path: "ingredients",
    populate: { path: "cropVariety", select: "name cropType" },
  });

  const ingredientIds = await updateIngredients({
    ingredientsDb: product.ingredients,
    updatedIngredients,
    productId: product._id,
  });
  product.ingredients = ingredientIds;
  const newSlug = makeUrlFriendly(updatedProduct.name);
  product.slug = newSlug;

  await product.save();
  return product;
};

export const createProduct = async ({ _newProductData }) => {
  const { ingredients: newIngredients, ...newProductData } = _newProductData;
  const product = await Product.create({
    ...newProductData,
    slug: makeUrlFriendly(newProductData.name),
  });

  await product.createIngredients({ ingredientsData: newIngredients });

  return product;
};

export const deleteProducts = async ({ productIds }) => {
  const product = await Product.deleteMany({ _id: { $in: productIds } });
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};
