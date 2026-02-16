export const handleApiError = (error) => {
  console.log("Error fetching fields:", error);
  const errorMessage =
    error.response?.data?.message || error.message || "Unknown error";
  alert(`Error fetching fields: ${errorMessage}`);
};
