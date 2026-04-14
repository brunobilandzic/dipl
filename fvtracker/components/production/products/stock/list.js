"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { refreshProductsStocks } from "@/store/production";
import { List } from "@/components/layout/preview/list";

const StockList = () => {
  const dispatch = useDispatch();
  const stocks = useSelector((state) => state.production.productStocks.items);
  console.log({ stocks });
  useEffect(() => {
    if (!stocks) {
      dispatch(refreshProductsStocks());
    }
  }, [stocks]);
  return (
    <div>
      <List title="Zalihe proizvoda">
        {stocks?.map((stock) => (
          <StockItem key={stock._id} stock={stock} />
        ))}
      </List>
    </div>
  );
};

export default StockList;

const StockItem = ({ stock }) => {
  console.log({ stock });
  return (
    <div>
      <h3>{stock.product.name}</h3>
      <p>{stock.product.description}</p>
      <p>Quantity: {stock.quantity}</p>
    </div>
  );
};
