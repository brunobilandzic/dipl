"use client";

import React from "react";
import { useSelector } from "react-redux";

const ProductList = () => {
  const products = useSelector((state) => state.products.items);
  return (
    <div>
      <div className="font-bold text-3xl border-b-2">Lista proizvoda</div>
      <ul>
        {products?.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
