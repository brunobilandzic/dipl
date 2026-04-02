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
  console.log("Updating product with ID:", productId);
  console.log("Updated product data:", updatedProduct);
  console.log("Updated ingredients data:", updatedIngredients);
  const product = await Product.findByIdAndUpdate(
    productId,
    { $set: updatedProduct },
    { new: true },
  ).populate({
    path: "ingredients",
    populate: { path: "cropVariety", select: "name" },
  });
  const existingIngredientIds = product.ingredients.map((ing) =>
    ing._id.toString(),
  );
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
      await ingredient.save();
      ingredients.push(ingredient);
    }
  }
  console.log("Created/updated ingredients:", ingredients);
  console.log("Associating ingredients with product:", product);
  return product;
};
