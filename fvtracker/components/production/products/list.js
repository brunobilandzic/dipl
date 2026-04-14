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
import { List, ListItem } from "@/components/layout/preview/list";
import { filterProducts, sortProducts } from "@/store/production";
import { initFilters } from "@/lib/utils/list";
import { productSortOptions } from "@/components/layout/preview/sort";

const ProductList = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const products = useSelector(
    (state) => state.production.products.filteredItems,
  );
  const [sortBy, setSortBy] = useState("newest");
  const [filters, setFilters] = useState(initFilters("products"));

  useEffect(() => {
    if (!products) return;
    dispatch(filterProducts(filters));
  }, [filters]);

  useEffect(() => {
    if (!products) return;
    dispatch(sortProducts(sortBy));
  }, [sortBy]);

/*   useEffect(() => {
    if (products === null) {
      refreshProducts({ dispatch, router });
    }
  }, [products]); */

  console.log({ products });

  if (!products) return <LoadingFullScreen />;

  return (
    <div>
      <List
        title="Proizvodi"
        onDeleteList={() => {}}
        onCreateItem={() => {
          router.push("/proizvodi/izradi");
        }}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filters={filters}
        setFilters={setFilters}
        initialFilters={initFilters("products")}
        sortOptions={productSortOptions}
      >
        {products?.map((product) => (
          <div key={product._id}>
            <ProductItem router={router} product={product} />
          </div>
        ))}
      </List>
    </div>
  );
};

export default ProductList;

const ProductItem = ({ product, router }) => {
  const actionOptions = [
    {
      label: "Uredi",
      className: "",
      onClick: () => {
        router.push(`/proizvodi/uredi/${product.slug}`);
      },
    },
    {
      label: "Stanje",
      className: "submitButton",
      onClick: () => {
        router.push(`/proizvodi/zalihe/${product.slug}`);
      },
    },
    {
      label: "Obriši",
      className: "cancelButton",
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteProducts({ productIds: [product._id], dispatch, router });
      },
    },
  ];

  return (
    <ListItem actionOptions={actionOptions}>
      <h2 className="text-xl font-bold">{product.name}</h2>
      <p>{product.description}</p>
      <ProductInfo
        createdAt={product.createdAt}
        updatedAt={product.updatedAt}
        price={product.price}
      />
      <div></div>
      <div className="mt-4">
        <IngredientsList ingredients={product.ingredients} />
      </div>
    </ListItem>
  );
};

const ProductInfo = ({ createdAt, updatedAt, price }) => {
  return (
    <div className="text-sm text-gray-500">
      <p>Datum kreiranja: {new Date(createdAt).toLocaleDateString()}</p>
      <p>Datum zadnje izmjene: {new Date(updatedAt).toLocaleDateString()}</p>
      <p>Cijena: {priceEuroString(price)}</p>
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
