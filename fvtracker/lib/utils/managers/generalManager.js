import { setGeneralManager } from "@/store/generalManager";
import handleError from "../../constants/errors/client/handleError";
import api from "../../api";

export const refreshGeneralManager = async ({ dispatch }) => {
  try {
    let res = await api.get("/general-manager");
    if (res.data && res.data.generalManager) {
      dispatch(setGeneralManager(res.data.generalManager));
    }
  } catch (error) {
    handleError({
      ...error,
      generalMessage: "Greška pri dohvaćanju Generalnog Managera",
    });
  }
};
