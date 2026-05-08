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
import fillProductionRedux from "@/lib/utils/production";
import { getAvailableFacilities } from "@/lib/utils/production/facilities";

export const CreateProductionStock = ({
  product,
  isOpen,
  onCancel,
  minPossibleBatchMap,
}) => {
  const blankFormData = {
    productId: product._id,
    quantity: 1,
    comment: "",
    productionFacilityId: null,
    batchName: null,
  };
  const dispatch = useDispatch();

  const facilities = useSelector((state) => state.production.facilities.items);
  const [availableFacilities, setAvailableFacilities] = useState([]);
  const testFormData = () => ({
    productId: product._id,
    quantity: 1,
    comment: "Testna zaliha",
    productionFacilityId: facilities.length > 0 ? facilities[0]._id : null,
    batchName: Object.keys(minPossibleBatchMap).length
      ? Object.keys(minPossibleBatchMap)[0]
      : null,
  });
  const [productionStock, setProductionStock] = useState(testFormData());
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
      alert(
        `${newProductionStock.quantity} zaliha proizvoda ${product.name} uspješno dodana na zalihe.`,
      );
      fillProductionRedux({ dispatch });
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      handleError({
        ...error,
        generalMessage: "Greška prilikom izrade zaliha proizvoda.",
      });
    }
  };

  useEffect(() => {
    setAvailableFacilities(
      getAvailableFacilities({
        facilities,
        requiredVolume: productionStock.quantity,
      }),
    );
  }, [productionStock.quantity]);

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
        {productionStock.quantity}
        <StockQuantityInput
          name="quantity"
          label="Količina"
          type="number"
          value={productionStock.quantity}
          onChange={onChange}
        />
        {productionStock.batchName && (
          <div>
            <strong>Odabrana žetva:</strong> {productionStock.batchName}
          </div>
        )}
        <CreateStockChooseBatch
          onChange={onChange}
          minPossibleBatchMap={minPossibleBatchMap}
          quantity={productionStock.quantity}
          defaultValue={productionStock.batchName}
        />
        <AppSelect
          name="productionFacilityId"
          label="Proizvodni pogon"
          onChange={onChange}
          options={availableFacilities.map((f) => ({
            value: f._id,
            label: f.name,
          }))}
          defaultValue={productionStock.productionFacilityId}
        />
      </div>
    </FormModal>
  );
};

const StockQuantityInput = ({ name, label, test, value, onChange }) => {
  return (
    <AppInput
      name="quantity"
      label="Količina"
      type="number"
      value={value}
      onChange={onChange}
    />
  );
};

const CreateStockChooseBatch = ({
  minPossibleBatchMap,
  onChange,
  quantity,
  defaultValue,
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
          name="batchName"
          onChange={onChange}
          options={batchOptions}
          defaultValue={defaultValue}
        />
      </div>
    </>
  );
};
