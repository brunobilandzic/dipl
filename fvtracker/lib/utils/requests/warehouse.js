import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";

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
