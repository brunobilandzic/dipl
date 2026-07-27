import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";

export const fetchWorkers = async () => {
  try {
    const res = await api.get("/workers", {
      params: {
        managerModelName,
      },
    });
    return res.data.workers;
  } catch (error) {
    console.error("Error fetching workers:", error);
    handleError({
      ...error,
      generalMessage: "Greška prilikom učitavanja radnika",
    });
    return [];
  }
};
