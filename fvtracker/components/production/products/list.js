"use client";

import { deleteProducts } from "@/lib/utils/production/products";
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
import { CreateProductionStock } from "./stock/CreateProductionStock";
import {
  getBatchesCVS,
  findMinPossibleBatchMap,
} from "@/lib/utils/production/resources";
import { ProductItemStocksInfo } from "./stock/Info";
import CreateWarehouseStock from "./stock/CreateWarehouseStock";
import { fetchWarehouses } from "@/store/warehouse";
import { useMemo } from "react";

const ProductList = ({ worker }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const products = useSelector(
    (state) => state.production.products.filteredItems,
  );
  const harvestingBatches = useSelector(
    (state) => state.production.harvestingBatches.items,
  );
  const [sortBy, setSortBy] = useState("newest");
  const initialFilters = useMemo(() => initFilters("products"), []);
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    if (!products) return;
    dispatch(filterProducts({ filters, sortBy }));
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
        initialFilters={initialFilters}
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
              dispatch={dispatch}
              isWorker={!!worker}
            />
          </div>
        ))}
      </List>
    </div>
  );
};

export default ProductList;

const ProductItem = ({
  product,
  harvestingBatches,
  router,
  dispatch,
  isWorker,
}) => {
  const [addProductionStockModalOpen, setAddProductionStockModalOpen] =
    useState(false);
  const [addWarehouseStockModalOpen, setAddWarehouseStockModalOpen] =
    useState(false);
  const warehouses = useSelector((state) => state.warehouse.warehouses.items);
  useEffect(() => {
    if (!warehouses) dispatch(fetchWarehouses());
  }, [warehouses]);

  const actionOptions = [
    ...(!isWorker
      ? [
          {
            label: "Uredi",
            className: "",
            onClick: () => {
              router.push(`/proizvodi/uredi/${product.slug}`);
            },
          },
        ]
      : []),
    {
      label: "Izradi zalihe",
      className: "submitButton",
      onClick: () => {
        setAddProductionStockModalOpen(true);
      },
    },
    {
      label: "Pošalji u skladište",
      className: "secondaryButton",
      onClick: () => {
        setAddWarehouseStockModalOpen(true);
      },
    },
    ...(!isWorker
      ? [
          {
            label: "Obriši",
            className: "cancelButton",
            onClick: async (e) => {
              e.preventDefault();
              e.stopPropagation();
              await deleteProducts({
                productIds: [product._id],
                dispatch,
                router,
              });
            },
          },
        ]
      : []),
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
            <h2 className="listitemheader">{product.name}</h2>
            <p>{product.description}</p>
          </div>
          <ProductItemStocksInfo
            productionStocks={product.productionStocks}
            warehouseStocks={product.warehouseStocks}
            productName={product.name}
          />
        </div>
        <div className="flex justify-between mt-4">
          <div>
            <ProductInfo
              createdAt={product.createdAt}
              updatedAt={product.updatedAt}
              price={product.price}
              stockVolume={product.stockVolume}
            />

            <div className="mt-4">
              <IngredientsList ingredients={product.ingredients} />
            </div>
          </div>
        </div>
      </ListItem>
      {addProductionStockModalOpen && (
        <CreateProductionStock
          isOpen={addProductionStockModalOpen}
          onCancel={() => setAddProductionStockModalOpen(false)}
          product={product}
          minPossibleBatchMap={minPossibleBatchMap}
        />
      )}
      {addWarehouseStockModalOpen && (
        <CreateWarehouseStock
          isOpen={addWarehouseStockModalOpen}
          onCancel={() => {
            setAddWarehouseStockModalOpen(false);
          }}
          product={product}
          productionStocks={product.productionStocks}
          warehouses={warehouses}
        />
      )}
    </>
  );
};

const ProductInfo = ({ createdAt, updatedAt, price, stockVolume }) => {
  return (
    <div className="text-sm text-gray-500">
      <p>Datum kreiranja: {new Date(createdAt).toLocaleDateString()}</p>
      <p>Datum zadnje izmjene: {new Date(updatedAt).toLocaleDateString()}</p>
      <p>Cijena: {priceEuroString(price)}</p>
      <p>Potrebni volumen: {stockVolume} </p>
    </div>
  );
};

export const IngredientsList = ({ ingredients }) => {
  return (
    <>
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
      <h3 className="text-lg font-semibold">
        {ingredient.cropVariety.cropType.name} {ingredient.cropVariety.name}
      </h3>
      <p>Količina: {ingredient.quantity}</p>
      <p>Kvaliteta: {ingredient.quality}</p>
    </div>
  );
};
