import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import { deleteField, setFields } from "@/store/cultivation";
import { setLoading } from "@/store/loading";

export const extractCoords = (cell) => {
  const [width, length] = cell.split(",").map(Number);
  return { width, length };
};

export const refreshFields = async ({ dispatch, router, generalManager, fieldsRedux = false }) => {
  try {
    if(fieldsRedux) return
    dispatch(setLoading(true));
    const res = await api.get(
      generalManager
        ? "/cultivation/fields/general-manager"
        : "/cultivation/fields",
    );
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

export const handleDeleteField = async ({ slug, dispatch, router }) => {
  if (!confirm("Jeste li sigurni da želite obrisati ovo polje?")) {
    return;
  }
  try {
    dispatch(setLoading(true));
    await api.delete(`/cultivation/fields/`, {
      params: { slug },
    });
    dispatch(deleteField(slug));
    refreshFields({ dispatch });
  } catch (error) {
    handleError(
      {
        ...error,
        generalMessage: "Došlo je do greške prilikom brisanja polja.",
      },
      router,
    );
    return;
  } finally {
    dispatch(setLoading(false));
  }
};
