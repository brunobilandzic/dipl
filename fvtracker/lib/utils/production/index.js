import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import { setLoading } from "@/store/loading";

export default async function fillProductionRedux({ dispatch, router }) {
  try {
    dispatch(setLoading(true));
    const res = await api.get("/productionManager");
    const productionManager = res.data;
    console.log("Fetched production manager data:", productionManager);
    dispatch(setLoading(false));
    return productionManager;
  } catch (error) {
    handleError({
      ...error,
      generalMessage: "Greška pri dohvaćanju podataka o proizvodnji",
    });
  }
}
