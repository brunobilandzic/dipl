"use client";

import { useSelector, useDispatch } from "react-redux";
import { refreshProductsStocks } from "@/store/production";

export const ProductStock = ({ slug }) => {
  const dispatch = useDispatch();
  const stocks = useSelector((state) => state.production.productStocks.items);
  if (!stocks) {
    dispatch(refreshProductsStocks());
  }
  const stock = stocks?.find((s) => s.product.slug === slug);

  return <div>ProductStock: {JSON.stringify(stock)}</div>;
};
