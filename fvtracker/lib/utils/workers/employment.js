export const handleStatusChange = async ({ requestId, status }) => {
  try {
    dispatch(setLoading(true));
    await api.put(`/employment-requests`, {
      requestId,
      status,
    });
    dispatch(updateEmploymentRequest({ requestId, status }));
  } catch (error) {
    console.error("Error updating employment request:", error);
    handleError({
      ...error,
      generalMessage: "Greška prilikom ažuriranja zahtjeva za zaposlenje",
    });
  } finally {
    dispatch(setLoading(false));
  }
};
