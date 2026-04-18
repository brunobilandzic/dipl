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
  const [productStock, setProductStock] = {
    quantity: 1,
    batchName: null,
  };
  useEffect(() => {
    console.log({ productStock });
  }, [productStock]);
  return (
    <Modal
      title={`Dodaj zalihe za ${product.name}`}
      isOpen={isOpen}
      onCancel={onCancel}
    >
      <div>
        <AppInput name="quantity" label="Količina" type="number"></AppInput>
        <CreateStockChooseBatch minPossibleBatchMap={minPossibleBatchMap} />
      </div>
    </Modal>
  );
};

const CreateStockChooseBatch = ({ minPossibleBatchMap }) => {
  const [choosenBatchName, setChoosenBatchName] = useState(null);
  const batchOptions = Object.entries(minPossibleBatchMap).map(
    ([batchName, possibleStock]) => {
      console.log({ batchName, possibleStock });
      return {
        value: batchName,
        label: `${batchName}`,
      };
    },
  );
  return (
    <>
      <div>{choosenBatchName}</div>
      <div className="select-batch">
        <div>Odaberi žetvu:</div>
        <AppSelect />
      </div>
    </>
  );
};
