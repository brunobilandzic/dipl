import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import { refreshOrdersThunk } from "@/store/webstore";

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

export const fillOrdersRedux = async ({ dispatch }) => {
  try {
    dispatch(refreshOrdersThunk());
  } catch (error) {
    console.error("Greška pri dohvatanju narudžbi:", error);
    handleError(
      { ...error, customMessage: "Greška pri dohvatanju narudžbi" },
      router,
    );
  }
};
