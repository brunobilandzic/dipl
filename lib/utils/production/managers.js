import api from "@/lib/api";
import { setManagers } from "@/store/production";

export const refreshManagers = async ({ dispatch, router }) => {
  try {
    const res = await api.get("/production-manager", { params: { all: true } });
    dispatch(setManagers(res.data.productionManagers));
  } catch (error) {
    console.error("Error fetching production managers:", error);
    handleError(
      {
        ...error,
        generalMessage:
          "Failed to fetch production managers. Please try again later.",
      },
      router,
    );
  }
};
