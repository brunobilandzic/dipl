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
