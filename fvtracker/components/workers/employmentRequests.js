import handleError from "@/lib/constants/errors/client/handleError";
import { updateEmploymentRequest } from "@/store/workers";
import { setLoading } from "@/store/loading";
import { useDispatch, useSelector } from "react-redux";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { List } from "../layout/preview/list";

export const EmploymentRequestsPageComponent = () => {
  const employmentRequests = useSelector(
    (state) => state.workers.employmentRequests.filteredItems,
  );
  const isLoading = useSelector((state) => state.workers.isLoading);
  const dispatch = useDispatch();

  const handleStatusChange = async (requestId, status) => {
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

  return (
    <List>
      {employmentRequests.map((request) => (
        <EmploymentRequestsItem key={request._id} request={request} />
      ))}
    </List>
  );
};

const EmploymentRequestsItem = ({ request }) => {
  const { worker, status } = request;

  return (
    <>
      <div>
        <div>
          {worker.appUser.username} {status}
        </div>
      </div>
    </>
  );
};
