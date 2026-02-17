export const handleApiError = (error) => {
  console.error("API Error:", error);
  const errorMessage =
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    error.name ||
    "Nepoznata greška";

  alert(`${error.generalMessage}: ${errorMessage}`);
};
