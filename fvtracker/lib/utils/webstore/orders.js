import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";

export const submitOrder = async ({ customerData, orderData }) => {
  try {
    console.log("Podaci narudžbe:", orderData);
    const response = await api.post("/orders", { customerData, orderData });
    return response.data;
  } catch (error) {
    console.error("Greška pri slanju narudžbe:", error);
    handleError(
      { ...error, customMessage: "Greška pri slanju narudžbe" },
      router,
    );
  }
};
