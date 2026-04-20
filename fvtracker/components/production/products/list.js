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
import { AddProductStock } from "./stock/productStock";
import {
  getBatchesCVS,
  findMinPossibleBatchMap,
} from "@/lib/utils/production/resources";

const ProductList = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const products = useSelector(
    (state) => state.production.products.filteredItems,
  );
  const harvestingBatches = useSelector(
    (state) => state.production.harvestingBatches.items,
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
        addLabel="Izradi proizvod"
        deleteLabel="Obriši proizvode"
      >
        {products?.map((product) => (
          <div key={product._id}>
            <ProductItem
              router={router}
              product={product}
              harvestingBatches={harvestingBatches}
            />
          </div>
        ))}
      </List>
    </div>
  );
};

export default ProductList;

const ProductItem = ({ product, harvestingBatches, router }) => {
  const [addStockModalOpen, setAddStockModalOpen] = useState(false);
  const dispatch = useDispatch();
  const actionOptions = [
    {
      label: "Uredi",
      className: "",
      onClick: () => {
        router.push(`/proizvodi/uredi/${product.slug}`);
      },
    },
    {
      label: "Dodaj zalihe",
      className: "submitButton",
      onClick: () => {
        setAddStockModalOpen(true);
      },
    },
    {
      label: "Obriši",
      className: "cancelButton",
      onClick: async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await deleteProducts({ productIds: [product._id] });
      },
    },
  ];
  const minPossibleBatchMap = findMinPossibleBatchMap({
    batchesCVS: getBatchesCVS({
      harvestingBatches,
      product,
    }),
  });

  return (
    <>
      <ListItem actionOptions={actionOptions}>
        <div className="flex justify-between mt-4">
          <div>
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p>{product.description}</p>
          </div>
          <div className="stockquantity flex items-center gap-4">
            {/* <h3 className="font-semibold">Na zalihi:</h3>
            <span className="text-5xl font-bold">
              {product.stock?.quantity || 0}
            </span> */}
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <div>
            <ProductInfo
              createdAt={product.createdAt}
              updatedAt={product.updatedAt}
              price={product.price}
            />

            <div className="mt-4">
              <IngredientsList ingredients={product.ingredients} />
            </div>
          </div>
        </div>
      </ListItem>
      {addStockModalOpen && (
        <AddProductStock
          isOpen={addStockModalOpen}
          onCancel={() => setAddStockModalOpen(false)}
          product={product}
          minPossibleBatchMap={minPossibleBatchMap}
        />
      )}
    </>
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
