import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import { WAREHOUSE_STOCK } from "@/lib/constants/warehouse";
import { fetchWarehouses } from "@/store/warehouse";
import { fillWarehouseRedux } from ".";
import { setLoading } from "@/store/loading";
import { warehousePayWorker } from "@/store/workers";

export const totalWarehouseStockQuantity = ({ warehouseStocks }) => {
  return warehouseStocks.reduce((acc, stock) => {
    acc += stock.quantity;
    return acc;
  }, 0);
};

export const submitWarehouseStock = async ({
  warehouseStockData,
  facility,
}) => {
  const res = await api.post(
    "/stocks",
    {
      warehouseStockData,
      facility,
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
  const neededQuantities = shipmentItems.map((shi) => {
    const existingQuantity =
      newShipmentData.sources.reduce((acc, source) => {
        if (source.productName === shi.product) {
          acc += Number(source.quantity);
        }
        return acc;
      }, 0) || 0;

    const shippedQuantity = order.items.reduce((acc, oi) => {
      acc += oi.shipmentSources.reduce((sAcc, ss) => {
        if (ss.product.name === shi.product) {
          sAcc += Number(ss.quantity);
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

  return neededQuantities;
};

export const isRequestFulfilled = ({ neededQuantities }) => {
  return neededQuantities.every((nq) => nq.neededQuantity <= 0);
};

export const submitShipment = async ({ newShipmentData, dispatch, router }) => {
  try {
    dispatch(setLoading(true));
    const res = await api.post("/warehouse-requests/fill", {
      shipmentSources: newShipmentData.sources,
      warehouseRequestId: newShipmentData.warehouseRequestId,
      workerId: newShipmentData.workerId,
    });
    console.log({ res });
    const { shipmentItem } = res.data;
    alert("Otpremnica uspješno kreirana!");
    fillWarehouseRedux({ dispatch, router });
    dispatch(
      warehousePayWorker({
        shipmentItem,
      }),
    );
  } catch (error) {
    console.error("Error submitting shipment:", error);
    handleError({
      ...error,
      generalMessage: "Došlo je do greške prilikom kreiranja otpremnice.",
    });
  } finally {
    dispatch(setLoading(false));
  }
};

// function exists...

export const buildRequired = ({ orderItems }) => {
  return orderItems.map((oi) => ({
    productName: oi.product.name,
    quantity: oi.quantity,
  }));
};

export const calculateIsShipmentShipped = ({ shipmentItems, orderItems }) => {
  const required = buildRequired({ orderItems });

  const shipmentSources = shipmentItems.reduce((acc, si) => {
    if (!si.sources) return acc;
    return [...acc, ...si.sources];
  }, []);
  if (shipmentSources.length === 0) return false;
  const totals = shipmentSourcesTotals({ shipmentSources });
  let shipmentShipped = true;
  for (const req of required) {
    if (!totals[req.productName] || totals[req.productName] < req.quantity) {
      shipmentShipped = false;
    }
  }

  return shipmentShipped;
};

export const shipmentSourcesTotals = ({ shipmentSources }) => {
  return shipmentSources.reduce((acc, source) => {
    if (!acc[source.product.name]) {
      acc[source.product.name] = 0;
    }
    acc[source.product.name] += Number(source.quantity);
    return acc;
  }, {});
};

export const getWarehouseStockQuantity = (products) =>
  products?.reduce(
    (total, product) =>
      total +
      product.warehouseStocks.reduce(
        (stockTotal, stock) => stockTotal + stock.quantity,
        0,
      ),
    0,
  );

export const getWarehouseOccupiedVolume = (warehouse) =>
  warehouse.stocks.reduce((volume, stock) => volume + stock.quantity, 0);

export const getWarehousesOccupiedVolume = (warehouses) =>
  warehouses.reduce((volume, wh) => volume + getWarehouseOccupiedVolume(wh), 0);

export const warehouseRequestPopulateShipmentItems = [
  {
    path: "order",
    populate: {
      path: "items",
      populate: {
        path: "product",
      },
    },
  },
  {
    path: "shipment",
    populate: {
      path: "shipmentItems",
      populate: {
        path: "sources",
        populate: {
          path: "product",
          select: "name",
        },
      },
    },
  },
];
