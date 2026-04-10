"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { refreshProducts } from "@/lib/utils/production/products";

const StockList = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const products = useSelector((state) => state.production.products.items);
  useEffect(() => {
    if (!products) {
      refreshProducts({ dispatch, router });
    }
  }, [products]);
  return <div>StockList</div>;
};

export default StockList;
