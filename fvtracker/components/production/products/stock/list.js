"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { refreshProductsStocks } from "@/store/production";
import { List, ListItem } from "@/components/layout/preview/list";
import { v4 as uuid } from "uuid";

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
          <StockItem stock={stock} />
        ))}
      </List>
    </div>
  );
};

export default StockList;

const StockItem = ({ stock }) => {
  const actionOptions = [
    {
      label: "Dodaj zalihe",
      className: "submitButton",
      onClick: () => {
        console.log("Dodaj zalihe za", stock.product.name);
      },
    },
  ];

  console.log({ stock });
  return (
    <ListItem key={uuid()} actionOptions={actionOptions}>
      <div>
        <h3>{stock.product.name}</h3>
        <p>{stock.product.description}</p>
        <p>Quantity: {stock.quantity}</p>
      </div>
    </ListItem>
  );
};
