"use client";

import Modal from "@/components/layout/modals/modal";
import { useEffect, useState } from "react";
import { AppInput, AppSelect } from "@/components/form/inputs";
import { useDispatch, useSelector } from "react-redux";
import { FormModal } from "@/components/layout/modals/form";
import { checkEmpty } from "@/lib/utils/objects";
import { submitProductionStock } from "@/lib/utils/production/stocks";
import { setLoading } from "@/store/loading";
import handleError from "@/lib/constants/errors/client/handleError";

const emptyProductionStock = ({ productId }) => ({
  productId,
  quantity: 1,
  comment: "",
  productionFacilityId: null,
  harvestingBatchId: null,
});

export const CreateProductionStock = ({
  product,
  isOpen,
  onCancel,
  minPossibleBatchMap,
}) => {
  const dispatch = useDispatch();
  const [productionStock, setProductionStock] = useState({
    productId: product._id,
    quantity: 1,
    comment: "",
    productionFacilityId: null,
    harvestingBatchId: null,
  });
  const facilities = useSelector((state) => state.production.facilities.items);

  const onChange = (e) => {
    setProductionStock((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const onSubmit = async () => {
    try {
      dispatch(setLoading(true));
      const newProductionStock = await submitProductionStock({
        productionStock,
      });
      dispatch(setLoading(false));
      alert(`Zalihe proizvoda uspješno izrađene.`);
    } catch (error) {
      dispatch(setLoading(false));
      handleError({
        ...error,
        generalMessage: "Greška prilikom izrade zaliha proizvoda.",
      });
    }
  };

  useEffect(() => {
    console.log({ productionStock });
  }, [productionStock]);

  return (
    <FormModal
      title={`Dodaj zalihe za ${product.name}`}
      isOpen={isOpen}
      onCancel={onCancel}
      submitDisabled={
        checkEmpty(productionStock, true) ||
        Object.keys(minPossibleBatchMap).length === 0
      }
      onSubmit={onSubmit}
    >
      <div>
        <AppInput
          name="comment"
          label="Komentar"
          type="text"
          value={productionStock.comment}
          onChange={onChange}
        />
        <StockQuantityInput
          name="quantity"
          label="Količina"
          type="number"
          value={productionStock.quantity}
          onChange={onChange}
        />
        {productionStock.harvestingBatchId && (
          <div>
            <strong>Odabrana žetva:</strong> {productionStock.harvestingBatchId}
          </div>
        )}
        <CreateStockChooseBatch
          onChange={onChange}
          minPossibleBatchMap={minPossibleBatchMap}
          quantity={productionStock.quantity}
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
          name="harvestingBatchId"
          onChange={onChange}
          options={batchOptions}
        />
      </div>
    </>
  );
};
