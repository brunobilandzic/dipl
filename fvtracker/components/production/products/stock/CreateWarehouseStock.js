import { AppInput, AppSelect } from "@/components/form/inputs";
import { FormModal } from "@/components/layout/modals/form";

import React from "react";

const CreateWarehouseStock = ({
  product,
  isOpen,
  onCancel,
  productionStocks,
}) => {
  console.log({ productionStocks });
  const [warehouseStock, setWarehouseStock] = React.useState({
    productId: product._id,
    quantity: 1,
    comment: "",
  });

  const onChange = (e) => {
    setWarehouseStock((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <FormModal title="Pošalji u skladište" isOpen={isOpen} onCancel={onCancel}>
      <AppSelect
        label="Izaberite proizvodnu zalihu"
        name="productionStockId"
        value={warehouseStock.productionStockId}
        onChange={onChange}
        options={
          productionStocks.map((ps) => ({
            value: ps._id,
            label: `${ps.name} (${ps.quantity})`
          }))
        }
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
