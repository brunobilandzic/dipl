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
      <div className="my-4 flex flex-col gap-4">
        {products?.map((product) => (
          <div key={product._id}>
            <ProductItem product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;

const ProductItem = ({ product }) => {
  return (
    <div className="border p-4 rounded">
      <h2 className="text-xl font-bold">{product.name}</h2>
      <p>{product.description}</p>
      <p className="text-sm text-gray-500">
        Cijena: {priceEuroString(product.price)}
      </p>
      <div className="mt-4">
        <IngredientsList ingredients={product.ingredients} />
      </div>
      <ActionBar productId={product._id} />
    </div>
  );
};

const IngredientsList = ({ ingredients }) => {
  return (
    <>
      <h3 className="text-lg font-semibold">Sastojci:</h3>
      <div className="flex gap-2 mt-2">
        {ingredients.map((ingredient) => (
          <IngredientItem key={ingredient._id} ingredient={ingredient} />
        ))}
      </div>
    </>
  );
};

const IngredientItem = ({ ingredient }) => {
  return (
    <div className="border p-2 rounded">
      <h3 className="text-lg font-semibold">{ingredient.cropVariety.name}</h3>
      <p>Količina: {ingredient.quantity}</p>
    </div>
  );
};

const ActionBar = ({ productId }) => {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <div className="btn">Edit</div>
      <div className="btn">Create Stock</div>
      <div className="btn cancelButton">Delete</div>
    </div>
  );
};
