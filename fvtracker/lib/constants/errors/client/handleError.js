import { handleApiError } from "./api";

export default function handleError(error) {
  if (error.name === "AxiosError") {
    handleApiError({
      ...error, 
    });
  } else {
    console.error("Unexpected error:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      error.name ||
      "Nepoznata greška";

    alert(`${error.generalMessage}: ${errorMessage}`);
  }
}
