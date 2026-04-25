import { AppInput } from "@/components/form/inputs";
import { FormModal } from "@/components/layout/modals/form";

import React from "react";

const CreateWarehouseStock = ({ product, isOpen, onCancel }) => {
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
    <FormModal isOpen={isOpen} onCancel={onCancel}>
      <AppInput
        placeholder="Komentar"
        name="comment"
        value={warehouseStock.comment}
        onChange={onChange}
      />
    </FormModal>
  );
};

export default CreateWarehouseStock;
