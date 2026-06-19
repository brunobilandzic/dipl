import { AppInput, AppSelect } from "@/components/form/inputs";
import { FormModal } from "@/components/layout/modals/form";
import { ChooseWorker } from "@/components/workers/choose";
import handleError from "@/lib/constants/errors/client/handleError";
import { PRODUCTION_MANAGER } from "@/lib/constants/users/managerTypes";
import { EMPLOYMENT_STATUS_EMPLOYED } from "@/lib/constants/users/workers";
import { showDateTime } from "@/lib/utils/display";
import { checkValue } from "@/lib/utils/formValidation";
import { checkEmpty } from "@/lib/utils/objects";
import { getAvailableFacilities } from "@/lib/utils/production/facilities";
import { submitWarehouseStock } from "@/lib/utils/storage/warehouse";
import { setLoading } from "@/store/loading";
import {
  editFacilityProductionStock,
  editProductStocks,
} from "@/store/production";
import { useEffect, useState } from "react";

import React from "react";
import { useDispatch, useSelector } from "react-redux";

const CreateWarehouseStock = ({
  product,
  isOpen,
  onCancel,
  productionStocks,
  warehouses,
  clickedStock,
  facility = false,
}) => {
  const workersRedux = useSelector((state) => state.workers.items);
  const workers = workersRedux.filter(
    (worker) => worker.employmentRequest.status === EMPLOYMENT_STATUS_EMPLOYED,
  );
  const workerId = useSelector((state) => state.user.session.workerId);

  const createInitialFormData = () => ({
    productId: product._id,
    quantity: 1,
    comment: `test dodavanja na skladište ${showDateTime(new Date())}`,
    productionStockId:
      productionStocks?.length > 0
        ? productionStocks[0]._id
        : clickedStock?._id || null,
    warehouseId: warehouses?.length > 0 ? warehouses[0]._id : null,
    workerId,
  });
  const dispatch = useDispatch();
  const [availableWarehouses, setAvailableWarehouses] = useState(warehouses);
  const [warehouseStock, setWarehouseStock] = useState(createInitialFormData());
  const [availableProductionStocks, setAvailableProductionStocks] =
    useState(productionStocks);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name == "quantity") {
      const selectedProductionStock = productionStocks.find(
        (ps) => ps._id === warehouseStock.productionStockId,
      );
      if (selectedProductionStock?.quantity < value) {
        alert(
          `Unesena količina je veća od dostupne količine na proizvodnoj zalihi (${selectedProductionStock?.quantity}). Molimo unesite manju količinu ili odaberite drugu proizvodnu zalihu.`,
        );
        return;
      }
      adjustStockOptions(value);
    }
    setWarehouseStock((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const adjustStockOptions = (quantity) => {
    setAvailableProductionStocks(
      productionStocks.filter((ps) => ps.quantity >= quantity),
    );
  };

  const onSubmit = async () => {
    try {
      dispatch(setLoading(true));
      const { newWarehouseStock, warehouseAcceptanceProcess } =
        await submitWarehouseStock({
          warehouseStockData: warehouseStock,
          facility,
        });
      });
      if (facility) {
        dispatch(
          editFacilityProductionStock({
            stockId: warehouseStock.productionStockId,
            quantity: warehouseStock.quantity,
          }),
        );
      } else {
        dispatch(
          editProductStocks({
            productId: product._id,
            productionStocks: newWareHouseStock.product.productionStocks,
            warehouseStocks: newWareHouseStock.product.warehouseStocks,
          }),
        );
      }

      dispatch(setLoading(false));
      alert(`Zalihe proizvoda uspješno izrađene.`);
    } catch (error) {
      dispatch(setLoading(false));
      handleError({
        ...error,
        generalMessage: "Greška prilikom dodavanja zaliha u skladište.",
      });
    }
  };

  useEffect(() => {
    setAvailableWarehouses(
      getAvailableFacilities({
        facilities: warehouses,
        requiredVolume: warehouseStock.quantity,
      }),
    );
  }, [warehouseStock.quantity]);
  const chooseWorker = (e) => {
    const { name, value } = e.target;
    setWarehouseStock((prev) => ({
      ...prev,
      workerId: value,
    }));
  };
  return (
    <FormModal
      title="Pošalji u skladište"
      isOpen={isOpen}
      onCancel={onCancel}
      onSubmit={onSubmit}
      submitDisabled={checkEmpty(warehouseStock, true)}
    >
      {!workerId && (
        <ChooseWorker
          workers={workers}
          onChoose={chooseWorker}
          managerModelName={PRODUCTION_MANAGER}
        />
      )}
      <AppSelect
        label="Izaberite skladište"
        name="warehouseId"
        defaultValue={warehouseStock.warehouseId}
        onChange={onChange}
        options={availableWarehouses?.map((w) => ({
          value: w._id,
          label: w.name,
        }))}
      />
      {!clickedStock && (
        <AppSelect
          label="Izaberite proizvodnu zalihu"
          name="productionStockId"
          defaultValue={warehouseStock.productionStockId}
          onChange={onChange}
          options={availableProductionStocks.map((ps) => ({
            value: ps._id,
            label: `${ps.facility.name} (Na zalihi: ${ps.quantity})`,
          }))}
        />
      )}
      <AppInput
        type="number"
        placeholder="Količina"
        label="Količina"
        name="quantity"
        value={warehouseStock.quantity}
        onChange={(e) => {
          const { value, error } = checkValue(e.target.value);
          if (error) {
            alert(error);
            return;
          }
          onChange(e);
        }}
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
