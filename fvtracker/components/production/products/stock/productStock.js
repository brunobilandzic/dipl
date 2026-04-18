"use client";

import { useSelector, useDispatch } from "react-redux";
import { refreshProductsStocks } from "@/store/production";
import Modal from "@/components/layout/modals/modal";
import { useEffect, useState } from "react";
import { AppInput, AppSelect } from "@/components/form/inputs";

export const AddProductStock = ({
  product,
  isOpen,
  onCancel,
  minPossibleBatchMap,
}) => {
  const [productStock, setProductStock] = useState({
    quantity: 1,
    batchName: null,
  });
  useEffect(() => {}, [productStock]);
  const onChange = (e) => {
    setProductStock((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <Modal
      title={`Dodaj zalihe za ${product.name}`}
      isOpen={isOpen}
      onCancel={onCancel}
    >
      <div>
        <AppInput
          name="quantity"
          label="Količina"
          type="number"
          onChange={onChange}
        />
        <CreateStockChooseBatch
          onChange={onChange}
          minPossibleBatchMap={minPossibleBatchMap}
          quantity={productStock.quantity}
        />
      </div>
    </Modal>
  );
};

const CreateStockChooseBatch = ({
  minPossibleBatchMap,
  onChange,
  quantity,
}) => {
  const [choosenBatchName, setChoosenBatchName] = useState(null);
  const batchOptions = Object.entries(minPossibleBatchMap)
    .filter(([_, possibleStock]) => possibleStock >= quantity)
    .map(([batchName, possibleStock]) => {
      console.log({ batchName, possibleStock });
      return {
        value: batchName,
        label: `${batchName} - moguća izrada ${possibleStock} proizvoda`,
      };
    });
  return (
    <>
      <div>{choosenBatchName}</div>
      <div className="select-batch">
        <div>Odaberi žetvu:</div>
        <AppSelect
          name="batchName"
          onChange={onChange}
          options={batchOptions}
        />
      </div>
    </>
  );
};
