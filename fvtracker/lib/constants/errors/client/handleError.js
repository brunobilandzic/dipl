import { handleApiError } from "./api";

export default function handleError(error, router) {
  if (error.name === "AxiosError") {
    return handleApiError({
      ...error,
    });
  }
  if (error.response?.status === 403) {
    router?.push("/uloga-nije-odobrena");
    return;
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
