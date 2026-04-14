import { ProductStock } from "@/components/production/products/stock/productStock";
import React from "react";

const ProductStockPage = async ({ params }) => {
  const { productSlug } = await params;
  return (
    <div>
      {" "}
      <ProductStock slug={productSlug} />
    </div>
  );
};

export default ProductStockPage;
