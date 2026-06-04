import { handleApiError } from "./api";

export default function handleError(error, router) {
  console.error("Handling error:", error);
  if (error.response?.status === 403 || error.response?.status === 401) {
    router?.push("/uloga-nije-odobrena");
    return;
  }
  if (error.name === "AxiosError") {
    return handleApiError({
      ...error,
    });
  }
  console.error("Unexpected error:", error);
  const errorMessage =
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    error.name ||
    "Nepoznata greška";

  alert(`${error.generalMessage}: ${errorMessage}`);
}
