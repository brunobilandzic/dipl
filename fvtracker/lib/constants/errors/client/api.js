export const handleApiError = (error) => {
  const errorMessage =
    error.response?.data?.message ||
    error.message ||
    error.generalMessage ||
    "Nepoznata greška";
  alert(errorMessage);
};
