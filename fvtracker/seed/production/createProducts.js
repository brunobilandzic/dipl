import { CropVariety } from "@/models/sectors/cultivation/Crops";
import { products } from "../data/production";
import { Product } from "@/models/sectors/production/Products";

export const createProducts = async () => {
  for (const productData of products) {
    const cropVarieties = await CropVariety.find({
      name: { $in: productData.cropVarieties },
    });
    const cropVarietyIds = cropVarieties.map((cv) => cv._id);
    const product = new Product({
      name: productData.name,
      cropVarieties: cropVarietyIds,
    });
    await product.save();
  }
};
