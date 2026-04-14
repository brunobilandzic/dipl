"use client";

import { useSelector, useDispatch } from "react-redux";
import { refreshProductsStocks } from "@/store/production";
import Modal from "@/components/layout/modals/modal";

export const ProductStock = ({ slug }) => {
  const dispatch = useDispatch();
  const stocks = useSelector((state) => state.production.productStocks.items);
  if (!stocks) {
    dispatch(refreshProductsStocks());
  }
  const stock = stocks?.find((s) => s.product.slug === slug);

  return <div>ProductStock: {}</div>;
};

export const addProductStock = ({ product }) => {
  return (
    <Modal title={`Dodaj zalihe za ${product.name}`}>
      <div>
        <div>Trenutno na zalihi: {product?.stock.quantity || 0}</div>
      </div>
    </Modal>
  );
};
