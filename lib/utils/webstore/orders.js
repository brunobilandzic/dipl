import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import { refreshOrdersThunk } from "@/store/webstore";

export const sendOrder = async ({ customerData, cartItems }) => {
  try {
    const response = await api.post("/orders", { customerData, cartItems });
    return response.data;
  } catch (error) {
    console.error("Greška pri slanju narudžbe:", error);
    handleError({ ...error, customMessage: "Greška pri slanju narudžbe" });
  }
};

export const fillOrdersRedux = async ({ dispatch, router }) => {
  try {
    const ordersRes = await api.get("/orders");
    dispatch(refreshOrdersThunk.fulfilled(ordersRes.data.orders));
  } catch (error) {
    console.error("Greška pri dohvatanju narudžbi:", error);
    handleError(
      { ...error, customMessage: "Greška pri dohvatanju narudžbi" },
      router,
    );
  }
};

export const deleteOrderUtil = async ({ orderId, dispatch, router }) => {
  if (!confirm("Jeste li sigurni da želite obrisati ovu narudžbu?")) return;
  try {
    await api.delete(`/orders`, {
      params: { id: orderId },
    });
    dispatch(refreshOrdersThunk());
  } catch (error) {
    console.error("Greška pri brisanju narudžbe:", error);
    handleError(
      { ...error, customMessage: "Greška pri brisanju narudžbe" },
      router,
    );
  }
};

export const getUniqueCustomers = (orders) => {
  const customers = orders.flatMap((o) => o.customer.email);
  return Array.from(new Set(customers));
};

export const getUniqueProducts = (orders) => {
  const products = orders.flatMap((o) => o.items).map((i) => i.product.name);
  return Array.from(new Set(products));
};

export const getOrdersTotalItems = (orders) => {
  return orders.reduce((total, order) => {
    const orderItemsCount = order.items.reduce(
      (count, item) => count + item.quantity,
      0,
    );
    return total + orderItemsCount;
  }, 0);
};
