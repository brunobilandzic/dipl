import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import { setFields } from "@/store/cultivation";
import { setLoading } from "@/store/loading";

export const extractCoords = (cell) => {
  const [width, length] = cell.split(",").map(Number);
  return { width, length };
};

export const refreshFields = async ({ dispatch, router }) => {
  try {
    dispatch(setLoading(true));
    const res = await api.get("/cultivation/fields");
    if (res.data && res.data.fields && Array.isArray(res.data.fields)) {
      dispatch(setFields(res.data.fields));
    }
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setLoading(false));
    handleError(
      {
        ...error,
        generalMessage: "Došlo je do greške prilikom učitavanja polja.",
      },
      router,
    );
  }
};
