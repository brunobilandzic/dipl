import { Product } from "@/models/sectors/production/Products";

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