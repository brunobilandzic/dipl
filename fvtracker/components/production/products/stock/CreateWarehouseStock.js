import { AppInput, AppSelect } from "@/components/form/inputs";
import { FormModal } from "@/components/layout/modals/form";
import { useEffect, useState } from "react";

import React from "react";

const CreateWarehouseStock = ({
  product,
  isOpen,
  onCancel,
  productionStocks,
}) => {
  const [warehouseStock, setWarehouseStock] = useState({
    productId: product._id,
    quantity: 1,
    comment: "",
    productionStock: null,
  });
  const [availableProductionStocks, setAvailableProductionStocks] =
    useState(productionStocks);
  const onChange = (e) => {
    if (e.target.name == "quantity") {
      adjustStockOptions(e.target.value);
    }
    setWarehouseStock((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const adjustStockOptions = (quantity) => {
    setAvailableProductionStocks(
      productionStocks.filter((ps) => ps.quantity >= quantity),
    );
  };

  return (
    <FormModal title="Pošalji u skladište" isOpen={isOpen} onCancel={onCancel}>
      <AppInput
        placeholder="Količina"
        label="Količina"
        name="quantity"
        value={warehouseStock.quantity}
        onChange={onChange}
      />
      <AppSelect
        label="Izaberite proizvodnu zalihu"
        name="productionStock"
        value={warehouseStock.productionStockId}
        onChange={onChange}
        options={availableProductionStocks.map((ps) => ({
          value: ps._id,
          label: `${ps.facility.name} (${ps.quantity})`,
        }))}
      />

      <AppInput
        placeholder="Komentar"
        label="Komentar"
        name="comment"
        value={warehouseStock.comment}
        onChange={onChange}
      />
    </FormModal>
  );
};

export default CreateWarehouseStock;
