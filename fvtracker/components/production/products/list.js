"use client";

import {
  refreshProducts,
  deleteProducts,
} from "@/lib/utils/production/products";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { LoadingFullScreen } from "@/components/layout/loading";
import Link from "next/link";
import { priceEuroString } from "@/lib/utils/strings";
import { List } from "@/components/layout/preview/list";
import { SortList } from "@/components/layout/preview/sort";
import { filterProducts, sortProducts } from "@/store/production/products";
import { Filter } from "@/components/layout/preview/filter";

const initFilters = [
  {
    type: "search",
    placeholder: "Pretraži proizvode...",
    value: "",
  },
];

const ProductList = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const products = useSelector((state) => state.products.items);
  const [sortBy, setSortBy] = useState("newest");
  const [filters, setFilters] = useState(initFilters);

  useEffect(() => {
    if (!products) return;
    dispatch(filterProducts(filters));
  }, [filters]);

  useEffect(() => {
    if (!products) return;
    dispatch(sortProducts(sortBy));
  }, [sortBy]);

  useEffect(() => {
    if (products === null) {
      refreshProducts({ dispatch, router });
    }
  }, [products]);

  console.log({ products });

  return (
    <div>
      <List
        title="Proizvodi"
        onDeleteList={() => {}}
        onCreateItem={() => {
          router.push("/proizvodi/izradi");
        }}
      >
        <SortList sortBy={sortBy} setSortBy={setSortBy} />
        <Filter filters={filters} setFilters={setFilters} />
        {products?.map((product) => (
          <div key={product._id}>
            <ProductItem product={product} />
          </div>
        ))}
      </List>
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
      <ActionBar productId={product._id} slug={product.slug} />
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

const ActionBar = ({ productId, slug }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  return (
    <div className="flex justify-end gap-2 mt-4">
      <Link href={`/proizvodi/uredi/${slug}`}>
        <div className="btn btnSm">Uredi</div>
      </Link>
      <Link href={`/production/products/${slug}/stock`}>
        <div className="btn submitButton btnSm">Stanje</div>
      </Link>
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          deleteProducts({ productIds: [productId], dispatch, router });
        }}
        className="btn cancelButton btnSm"
      >
        Obriši
      </div>
    </div>
  );
};
