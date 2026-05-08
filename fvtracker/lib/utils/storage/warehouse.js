import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import { WAREHOUSE_STOCK } from "@/lib/constants/warehouse";

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
  isEdit,
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
    await api.delete(`/warehouses/${warehouseId}`);
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
