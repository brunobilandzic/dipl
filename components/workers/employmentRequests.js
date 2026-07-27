"use client";
import { useDispatch, useSelector } from "react-redux";
import { List, ListItem } from "../layout/preview/list";
import { getName, showDate } from "@/lib/utils/display";
import {
  EMPLOYMENT_STATUS_EMPLOYED,
  EMPLOYMENT_STATUS_PENDING,
  EMPLOYMENT_STATUS_UNEMPLOYED,
} from "@/lib/constants/users/workers";
import { handleStatusChange } from "@/lib/utils/workers/employment";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { filterItems, initFilters } from "@/lib/utils/list";

export const EmploymentRequestsPageComponent = () => {
  const employmentRequests = useSelector(
    (state) => state.workers.employmentRequests.filteredItems,
  );
  const dispatch = useDispatch();
  const router = useRouter();

  const EMPTY_ARRAY = [];
  const initialFilters = useMemo(
    () => initFilters("employmentRequests"),
    [employmentRequests],
  );
  const [filters, setFilters] = useState(initialFilters);
  const allEmploymentRequests = useMemo(
    () => employmentRequests ?? EMPTY_ARRAY,
    [employmentRequests],
  );
  const filteredEmploymentRequests = useMemo(
    () =>
      filterItems({
        _items: allEmploymentRequests,
        filters,
      }),
    [allEmploymentRequests, filters],
  );

  console.log({ employmentRequests, filteredEmploymentRequests });

  return (
    <List
      title="Zahtjevi za zaposlenje"
      filters={filters}
      setFilters={setFilters}
    >
      {filteredEmploymentRequests.map((request) => {
        return (
          <EmploymentRequestsItem
            key={request._id}
            request={request}
            dispatch={dispatch}
            router={router}
          />
        );
      })}
    </List>
  );
};

const EmploymentRequestsItem = ({ request, dispatch, router }) => {
  const { worker, status, _id } = request;
  if (!worker) return null;

  const actionOptions = [
    ...(status === EMPLOYMENT_STATUS_PENDING ||
    status === EMPLOYMENT_STATUS_UNEMPLOYED
      ? [
          {
            label: "Odobri",
            onClick: () => {
              handleStatusChange({
                requestId: _id,
                status: EMPLOYMENT_STATUS_EMPLOYED,
                dispatch,
                router,
              });
            },
            className: "submitButton",
          },
          {
            label: "Odbij",
            onClick: () => {
              handleStatusChange({
                requestId: _id,
                status: EMPLOYMENT_STATUS_UNEMPLOYED,
                dispatch,
                router,
              });
            },
            className: "cancelButton",
          },
        ]
      : [
          {
            label: "Otkaz",
            onClick: () => {
              handleStatusChange({
                requestId: _id,
                status: EMPLOYMENT_STATUS_UNEMPLOYED,
                dispatch,
                router,
              });
            },
            className: "cancelButton",
          },
        ]),
  ];

  const getClassName = () => {
    switch (status) {
      case EMPLOYMENT_STATUS_EMPLOYED:
        return "ring-2 ring-green-300";
      case EMPLOYMENT_STATUS_UNEMPLOYED:
        return "ring-2 ring-red-300";
      default:
        return "";
    }
  };

  return (
    <>
      <ListItem actionOptions={actionOptions} _className={getClassName()}>
        <div>
          <div className="text-sm text-gray-500">
            {showDate(request.createdAt)}
          </div>
          <div>
            <span className="font-semibold">{getName(worker.appUser)}</span> -{" "}
            {worker.appUser.username}
          </div>
          <div className="text-sm text-gray-500 flex flex-col mt-2">
            {" "}
            <div>{worker.hourlyRate} €/h</div>
            <div>{status}</div>
          </div>
        </div>
      </ListItem>
    </>
  );
};
