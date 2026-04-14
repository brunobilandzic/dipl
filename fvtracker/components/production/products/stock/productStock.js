"use client";

import { useSelector } from "react-redux";

export const ProductStock = ({ slug }) => {
  const stocks = useSelector((state) => state.production.productStocks.items);
  const stock = stocks?.find((s) => s.product.slug === slug);
  return <div>ProductStock: {JSON.stringify(stock)}</div>;
};
