"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { refreshProductsStocks } from "@/store/production";

const StockList = () => {
  const dispatch = useDispatch();
  const stocks = useSelector((state) => state.production.productStocks.items);
  console.log({ stocks });
  useEffect(() => {
    if (!stocks) {
      dispatch(refreshProductsStocks());
    }
  }, [stocks]);
  return <div>StockList</div>;
};

export default StockList;
