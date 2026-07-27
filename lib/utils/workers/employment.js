import handleError from "@/lib/constants/errors/client/handleError";
import { updateEmploymentRequest } from "@/store/workers";
import { setLoading } from "@/store/loading";
import api from "@/lib/api";

export const handleStatusChange = async ({
  requestId,
  status,
  dispatch,
  router,
}) => {
  try {
    dispatch(setLoading(true));
    await api.put(`/employment-requests`, {
      requestId,
      status,
    });
    dispatch(updateEmploymentRequest({ requestId, status }));
  } catch (error) {
    console.error("Error updating employment request:", error);
    handleError(
      {
        ...error,
        generalMessage: "Greška prilikom ažuriranja zahtjeva za zaposlenje",
      },
      router,
    );
  } finally {
    dispatch(setLoading(false));
  }
};
