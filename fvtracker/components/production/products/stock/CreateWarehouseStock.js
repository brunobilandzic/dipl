import { AppInput, AppSelect } from "@/components/form/inputs";
import { FormModal } from "@/components/layout/modals/form";
import handleError from "@/lib/constants/errors/client/handleError";
import { showDateTime } from "@/lib/utils/display";
import { checkEmpty } from "@/lib/utils/objects";
import fillProductionRedux from "@/lib/utils/production";
import { submitWarehouseStock } from "@/lib/utils/storage/warehouse";
import { setLoading } from "@/store/loading";
import { fetchWarehouses } from "@/store/warehouse";
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
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("PARENT MOUNTED");
    return () => console.log("PARENT UNMOUNTED");
  }, []);

  console.log({ warehouses });
  const [warehouseStock, setWarehouseStock] = useState({
    productId: product._id,
    quantity: 1,
    comment: `test dodavanja na skladište ${showDateTime(new Date())}`,
    productionStock: productionStocks[0]._id,
  });
  const [availableProductionStocks, setAvailableProductionStocks] =
    useState(productionStocks);
  const onChange = (e) => {
    const { name, value } = e.target;
    if (name == "quantity") {
      if (clickedStock?.quantity < value) {
        alert(
          `Unesena količina je veća od dostupne količine na proizvodnoj zalihi (${clickedStock.quantity}). Molimo unesite manju količinu.`,
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
      const newWareHouseStock = await submitWarehouseStock({
        warehouseStockData: warehouseStock,
      });
      fillProductionRedux({ dispatch });
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

  return (
    <FormModal
      title="Pošalji u skladište"
      isOpen={isOpen}
      onCancel={onCancel}
      submitDisabled={checkEmpty(warehouseStock, true)}
      onSubmit={onSubmit}
    >
      <AppSelect
        label="Izaberite skladište"
        name="warehouse"
        value={warehouseStock.warehouse}
        onChange={onChange}
        options={warehouses.map((w) => ({
          value: w._id,
          label: w.name,
        }))}
        defaultValue={warehouses[0]._id}
      />
      {!clickedStock && (
        <AppSelect
          label="Izaberite proizvodnu zalihu"
          name="productionStock"
          value={warehouseStock.productionStock}
          onChange={onChange}
          options={availableProductionStocks.map((ps) => ({
            value: ps._id,
            label: `${ps.facility.name} (${ps.quantity})`,
          }))}
          defaultValue={productionStocks[0]._id}
        />
      )}
      <AppInput
        placeholder="Količina"
        label="Količina"
        name="quantity"
        value={warehouseStock.quantity}
        onChange={onChange}
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
