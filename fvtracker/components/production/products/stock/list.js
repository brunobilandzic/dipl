"use client";

import React, { use, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { refreshProductsStocks } from "@/store/production";
import { List, ListItem } from "@/components/layout/preview/list";
import { v4 as uuid } from "uuid";
import { CreateProductionStock } from "./CreateProductionStock";
import {
  findMinPossibleBatchMap,
  getBatchesCVS,
} from "@/lib/utils/production/resources";
import { LoadingFullScreen } from "@/components/layout/loading";
import { IngredientsList } from "../list";

const StockList = () => {
  const dispatch = useDispatch();
  const stocks = useSelector((state) => state.production.productStocks.items);
  useEffect(() => {
    if (!stocks) {
      dispatch(refreshProductsStocks());
    }
  }, [stocks]);
  return (
    <div>
      <List title="Zalihe proizvoda">
        {stocks?.map((stock) => (
          <StockItem key={uuid()} stock={stock} />
        ))}
      </List>
    </div>
  );
};

export default StockList;

const StockItem = ({ stock }) => {
  const [addProductStockModalOpen, setAddProductStockModalOpen] =
    useState(false);
  const harvestingBatches = useSelector(
    (state) => state.production.harvestingBatches.items,
  );
  const product = stock.product;
  const actionOptions = [
    {
      label: "Dodaj zalihe",
      className: "submitButton",
      onClick: () => {
        setAddProductStockModalOpen(true);
      },
    },
  ];

  if (!product || !harvestingBatches) return <LoadingFullScreen />;

  const minPossibleBatchMap = findMinPossibleBatchMap({
    batchesCVS: getBatchesCVS({
      harvestingBatches,
      product,
    }),
  });

  return (
    <>
      <ListItem key={uuid()} actionOptions={actionOptions}>
        <div className="relative">
          <h3 className="text-2xl">{stock.product.name}</h3>
          <p>{stock.product.description}</p>
          <IngredientsList ingredients={stock.product.ingredients} />
          <p className="stockQuantity">{stock.quantity}</p>
        </div>
      </ListItem>
      {addProductStockModalOpen && (
        <CreateProductionStock
          isOpen={addProductStockModalOpen}
          product={stock.product}
          onClose={() => setAddProductStockModalOpen(false)}
          minPossibleBatchMap={minPossibleBatchMap}
          onCancel={() => setAddProductStockModalOpen(false)}
        />
      )}
    </>
  );
};
