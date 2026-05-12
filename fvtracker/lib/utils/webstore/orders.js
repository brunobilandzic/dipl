import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";

export const sendOrder = async ({ customerData, cartItems }) => {
  try {
    console.log("Podaci narudžbe:", { customerData, cartItems });
    const response = await api.post("/orders", { customerData, cartItems });
    return response.data;
  } catch (error) {
    console.error("Greška pri slanju narudžbe:", error);
    handleError(
      { ...error, customMessage: "Greška pri slanju narudžbe" },
      router,
    );
  }
};
