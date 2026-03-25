import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import { setFields } from "@/store/cultivation";

export const extractCoords = (cell) => {
  const [width, length] = cell.split(",").map(Number);
  return { width, length };
};

export const refreshFields = async ({ dispatch }) => {
  try {
    const res = await api.get("/cultivation/fields");
    if (
      res.data &&
      res.data.fields &&
      Array.isArray(res.data.fields) &&
      res.data.fields.length > 0
    ) {
      dispatch(setFields(res.data.fields));
    }
  } catch (error) {
    console.log("Error fetching fields:", error);
    const errorMessage =
      error.response?.data?.message || error.message || "Nepoznata greška";
    alert(`Greška pri dohvaćanju polja: ${errorMessage}`);
  }
};
