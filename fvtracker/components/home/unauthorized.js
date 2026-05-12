"use client";

import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { ProductList } from "../webstore/products";

export const UnathorizedHomepage = () => {
  const { data: session, status } = useSession();
  return (
    <div>
      <ProductList />
    </div>
  );
};
