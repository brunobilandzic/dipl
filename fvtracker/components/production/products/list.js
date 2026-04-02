"use client";

import { refreshProducts } from "@/lib/utils/production/products";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { LoadingFullScreen } from "@/components/layout/loading";

const ProductList = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const products = useSelector((state) => state.products.items);

  useEffect(() => {
    if (products === null) {
      refreshProducts({ dispatch, router });
    }
  }, [products]);

  console.log({ products });

  return (
    <div>
      <div className="font-bold text-3xl border-b-2">Lista proizvoda</div>
      <ul>
        {products?.map((product) => (
          <li key={product._id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;

const ProductItem = ({ product }) => {
  return (
    <div className="border p-4 rounded">
      <h2 className="text-xl font-bold">{product.name}</h2>
      <p>{product.description}</p>
      <p className="text-sm text-gray-500">Price: ${product.price}</p>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Ingredients:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {product.ingredients.map((ingredient) => (
            <IngredientItem key={ingredient._id} ingredient={ingredient} />
          ))}
        </div>
      </div>
    </div>
  );
};

const IngredientItem = ({ ingredient }) => {
  return (
    <div className="border p-2 rounded">
      <h3 className="text-lg font-semibold">{ingredient.cropVariety.name}</h3>
      <p>Quantity: {ingredient.quantity}</p>
    </div>
  );
};
