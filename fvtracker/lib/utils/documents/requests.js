import api from "@/lib/api";
import { fetchWarehouseRequests } from "@/store/warehouse";

export const fillWarehouseRequestsRedux = ({ dispatch }) => {
  dispatch(fetchWarehouseRequests());
};

export const sendWarehouseRequest = async ({
  requestData,
  dispatch,
  router,
}) => {
  try {
    const res = await api.post("/warehouse-requests", requestData);
    return res.data;
  } catch (error) {
    console.error("Error sending warehouse request:", error);
    handleError(
      { ...error, customMessage: "Greška prilikom slanja zahtjeva skladištu." },
      router,
    );
  }
};

export const warehouseRequestItems = (request) => {
  return request.order.items.map((item) => ({
    product: item.product._id,
    quantity: item.quantity,
  }));
};
