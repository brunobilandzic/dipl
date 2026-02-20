import { handleApiError } from "./api";

export default function handleError(error) {
  if (error.name === "AxiosError") {
    handleApiError({
      ...error,
      generalMessage:
        "An error occurred while communicating with the server. Please try again.",
    });
  } else {
    console.error("Unexpected error:", error);
    alert("An unexpected error occurred. Please try again.");
  }
}
