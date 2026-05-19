import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import { WAREHOUSE_STOCK } from "@/lib/constants/warehouse";
import { fetchWarehouses } from "@/store/warehouse";
import { fillWarehouseRedux } from ".";

export const totalWarehouseStockQuantity = ({ warehouseStocks }) => {
  return warehouseStocks.reduce((acc, stock) => {
    acc += stock.quantity;
    return acc;
  }, 0);
};

export const submitWarehouseStock = async ({ warehouseStockData }) => {
  console.log({ warehouseStockData });
  const res = await api.post(
    "/stocks",
    {
      warehouseStockData,
    },
    {
      params: {
        stockType: WAREHOUSE_STOCK,
      },
    },
  );
  return res.data.newWarehouseStock;
};

export const submitWarehouseForm = async ({
  isEdit = false,
  form,
  warehouseId,
  dispatch,
  router,
}) => {
  try {
    if (isEdit) {
      await api.put(`/warehouses`, form, {
        params: { id: warehouseId },
      });
    } else {
      await api.post("/warehouses", form);
    }
    dispatch(fetchWarehouses());
    router.push("/skladisne-jedinice");
  } catch (error) {
    console.error("Error submitting warehouse form:", error);
    handleError(
      {
        ...error,
        generalMessage: isEdit
          ? "Došlo je do greške prilikom ažuriranja skladišta."
          : "Došlo je do greške prilikom kreiranja skladišta.",
      },
      router,
    );
  }
};

export const deleteWarehouse = async ({ warehouseId, dispatch, router }) => {
  if (!confirm("Jeste li sigurni da želite obrisati ovo skladište?")) return;
  try {
    await api.delete(`/warehouses`, {
      params: { id: warehouseId },
    });
    dispatch(fetchWarehouses());
    router.push("/skladisne-jedinice");
  } catch (error) {
    console.error("Error deleting warehouse:", error);
    handleError(
      {
        ...error,
        generalMessage: "Došlo je do greške prilikom brisanja skladišta.",
      },
      router,
    );
  }
};

export const deleteWarehouses = async ({ dispatch, router }) => {
  if (!confirm("Jeste li sigurni da želite obrisati sva skladišta?")) return;
  try {
    await api.delete(`/warehouses`);
    dispatch(fetchWarehouses());
    router.push("/skladisne-jedinice");
  } catch (error) {
    console.error("Error deleting warehouses:", error);
    handleError(
      {
        ...error,
        generalMessage: "Došlo je do greške prilikom brisanja skladišta.",
      },
      router,
    );
  }
};

export const calculateWarehouseStock = ({ productName, stocks }) => {
  const stock = stocks.find((stock) => stock.product.name === productName);
  return stock ? stock.quantity : 0;
};

export const calculateNeededQuantities = ({
  shipmentItems,
  newShipmentData,
  order,
}) => {
  console.log({ shipmentItems, newShipmentData, order });
  const neededQuantities = shipmentItems.map((shi) => {
    const existingQuantity = newShipmentData.sources.reduce((acc, source) => {
      if (source.productName === shi.product) {
        acc += Number(source.quantity);
      }
      return acc;
    }, 0);
    console.log({ existingQuantity });
    const shippedQuantity = order.items.reduce((acc, oi) => {
      console.log({ oi });
      acc += oi.shipmentItems.reduce((sAcc, si) => {
        if (si.product.name === shi.product) {
          sAcc += Number(si.quantity);
        }
        return sAcc;
      }, 0);
      return acc;
    }, 0);
    return {
      productName: shi.product,
      neededQuantity: shi.quantity - shippedQuantity - existingQuantity,
    };
  });
  console.log({ neededQuantities });
  return neededQuantities;
};

export const isRequestFulfilled = ({ neededQuantities }) => {
  return neededQuantities.every((nq) => nq.neededQuantity <= 0);
};

export const submitShipment = async ({ shipment, dispatch }) => {
  console.log({ shipment });
  try {
    await api.post("/warehouse-requests/fill", {
      shipmentSources: shipment.sources,
      warehouseRequestId: shipment.warehouseRequestId,
    });
    alert("Otpremnica uspješno kreirana!");
    fillWarehouseRedux({ dispatch });
  } catch (error) {
    console.error("Error submitting shipment:", error);
    handleError({
      ...error,
      generalMessage: "Došlo je do greške prilikom kreiranja otpremnice.",
    });
  }
};

// function exists...
