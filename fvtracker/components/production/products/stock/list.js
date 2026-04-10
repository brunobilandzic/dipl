"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

const StockList = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.production.products.items);
  useEffect(() => {
    if (!products) {
      dispatch(refreshProductsStocks());
    }
  }, [products]);
  return <div>StockList</div>;
};

export default StockList;
