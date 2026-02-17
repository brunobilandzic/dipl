export const handleApiError = (error) => {
  const errorMessage =
    error.response?.data?.message || error.message || "Nepoznata greška";
  alert(errorMessage);
};
