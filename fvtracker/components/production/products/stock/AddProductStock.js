"use client";

import Modal from "@/components/layout/modals/modal";
import { useEffect, useState } from "react";
import { AppInput, AppSelect } from "@/components/form/inputs";
import { useSelector } from "react-redux";
import { FormModal } from "@/components/layout/modals/form";

export const AddProductStock = ({
  product,
  isOpen,
  onCancel,
  minPossibleBatchMap,
}) => {
  const [productStock, setProductStock] = useState({
    quantity: 1,
    comment: "",
    productionFacilityId: null,
    batchName: null,
  });
  const facilities = useSelector((state) => state.production.facilities.items);
  useEffect(() => {}, [productStock]);
  const onChange = (e) => {
    setProductStock((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <FormModal
      title={`Dodaj zalihe za ${product.name}`}
      isOpen={isOpen}
      onCancel={onCancel}
    >
      <div>
        <AppInput
          name="comment"
          label="Komentar"
          type="text"
          onChange={onChange}
        />
        <StockQuantityInput
          name="quantity"
          label="Količina"
          type="number"
          onChange={onChange}
        />
        {productStock.batchName && (
          <div>
            <strong>Odabrana žetva:</strong> {productStock.batchName}
          </div>
        )}
        <CreateStockChooseBatch
          onChange={onChange}
          minPossibleBatchMap={minPossibleBatchMap}
          quantity={productStock.quantity}
        />
        <AppSelect
          name="productionFacilityId"
          label="Proizvodni pogon"
          onChange={onChange}
          options={facilities.map((f) => ({
            value: f._id,
            label: f.name,
          }))}
        />
      </div>
    </FormModal>
  );
};

const StockQuantityInput = ({ name, label, quantity, onChange }) => {
  return (
    <AppInput
      name="quantity"
      label="Količina"
      type="number"
      onChange={onChange}
    />
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
