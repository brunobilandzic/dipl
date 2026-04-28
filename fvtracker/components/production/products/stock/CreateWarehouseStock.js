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
}) => {
  const dispatch = useDispatch();
  const warehouses = useSelector((state) => state.warehouses.warehouses.items);

  useEffect(() => {
    console.log("PARENT MOUNTED");
    return () => console.log("PARENT UNMOUNTED");
  }, []);

  useEffect(() => {
    if (!warehouses) dispatch(fetchWarehouses());
    console.log({ warehouses });
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
        value={warehouseStock.productionStock}
        onChange={onChange}
        options={availableProductionStocks.map((ps) => ({
          value: ps._id,
          label: `${ps.facility.name} (${ps.quantity})`,
        }))}
        defaultValue={productionStocks[0]._id}
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
