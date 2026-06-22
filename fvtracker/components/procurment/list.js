"use client";

import { List, ListItem } from "@/components/layout/preview/list";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { showDateTime } from "@/lib/utils/display";
import { useEffect, useState } from "react";
import {
  FINANCIAL_MANAGER,
  GENERAL_MANAGER,
} from "@/lib/constants/users/managerTypes";
import {
  PROCURMENT_APPROVED,
  PROCURMENT_PENDING,
  PROCURMENT_REJECTED,
} from "@/lib/constants/documents/procurments";
import api from "@/lib/api";
import {
  deleteProcurment,
  filterProcurments,
  updateProcurmentStatus,
} from "@/store/procurments";
import handleError from "@/lib/constants/errors/client/handleError";
import { LoadingFullScreen } from "../layout/loading";
import { initFilters } from "@/lib/utils/list";
import { SORT_INIT_VALUE } from "@/lib/constants/others";
import { procurmentSortOptions } from "../layout/preview/sort";
import { procurmentValue } from "@/lib/utils/documents/procurments";
import { useMemo } from "react";

export const ProcurmentList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const procurments = useSelector((state) => state.procurments.filteredItems);
  const managerModelName = useSelector(
    (state) => state.user?.session?.managerModelName,
  );
  const [showAll, setShowAll] = useState(false);
  const allView = [FINANCIAL_MANAGER].includes(managerModelName);
  const initialFilters = useMemo(() => initFilters("procurments"), []);
  const [filters, setFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState(SORT_INIT_VALUE);

  useEffect(() => {
    if (!procurments) return;
    dispatch(filterProcurments({ filters, sortBy }));
  }, [filters, sortBy]);

  const router = useRouter();

  const showAllButton = () => {
    if (![FINANCIAL_MANAGER].includes(managerModelName)) {
      return null;
    }
    return (
      <div className="btn btnSm" onClick={() => setShowAll((prev) => !prev)}>
        {showAll ? "Prikaži moje" : "Prikaži sve"}
      </div>
    );
  };

  if (isLoading) return <LoadingFullScreen />;

  if (!procurments) return <LoadingFullScreen />;

  return (
    <>
      <List
        title="Nabavke"
        onCreateItem={() => router.push("/nabava/izradi")}
        customButtons={showAllButton()}
        filters={filters}
        setFilters={setFilters}
        sortBy={sortBy}
        setSortBy={setSortBy}
        initialFilters={initialFilters}
        sortOptions={procurmentSortOptions}
      >
        {" "}
        {procurments.length === 0 && (
          <p className="text-center text-gray-500 p-4">
            Nema podataka o nabavkama.
          </p>
        )}
        {procurments
          .filter((proc) => {
            if (showAll || !allView) return true;
            if (
              [FINANCIAL_MANAGER, GENERAL_MANAGER].includes(
                proc.manager.managerModelName,
              )
            )
              return true;
          })
          .map((procurment) => (
            <ProcurmentListItem
              key={procurment._id}
              procurment={procurment}
              managerModelName={managerModelName}
              allView={allView}
              dispatch={dispatch}
              setIsLoading={setIsLoading}
            />
          ))}
      </List>
    </>
  );
};

const ProcurmentListItem = ({
  procurment,
  managerModelName,
  allView,
  dispatch,
  setIsLoading,
}) => {
  let approveProcurmentAction, rejectProcurmentAction;

  let deleteProcurmentAction =
    (managerModelName == procurment.manager.managerModelName || allView) &&
    procurment.status == PROCURMENT_PENDING
      ? {
          label: "Obriši",
          className: "cancelButton",
          onClick: async () => {
            setIsLoading(true);
            await deleteProcurmentApi({
              procurmentId: procurment._id,
              dispatch,
            });
            setIsLoading(false);
          },
        }
      : null;
  if ([FINANCIAL_MANAGER, GENERAL_MANAGER].includes(managerModelName)) {
    approveProcurmentAction = {
      label: "Odobri",
      className: "submitButton",
      onClick: async () => {
        setIsLoading(true);
        await changeStatus({
          procurmentId: procurment._id,
          newStatus: PROCURMENT_APPROVED,
          dispatch,
        });
        setIsLoading(false);
      },
    };
    rejectProcurmentAction = {
      label: "Odbij",
      className: "cancelButton",
      onClick: async () => {
        setIsLoading(true);
        await changeStatus({
          procurmentId: procurment._id,
          newStatus: PROCURMENT_REJECTED,
          dispatch,
        });
        setIsLoading(false);
      },
    };
  }

  const procurmentActions = [
    ...([FINANCIAL_MANAGER, GENERAL_MANAGER].includes(managerModelName)
      ? procurment.status == PROCURMENT_PENDING
        ? [approveProcurmentAction, rejectProcurmentAction]
        : []
      : []),
    ...(deleteProcurmentAction ? [deleteProcurmentAction] : []),
  ];

  return (
    <>
      <ListItem
        _className={`${procurment.status == PROCURMENT_APPROVED ? "border-green-500" : ""}`}
        actionOptions={procurmentActions}
      >
        <div className="flex flex-col gap-2">
          <div className="text-sm text-gray-500">
            {showDateTime(procurment.createdAt)}
          </div>
          <div className="font-semibold">{procurment.name}</div>
          <div>{procurment.description}</div>

          {procurment.items.map((item) => (
            <ProcurmentItem key={item._id} procurementItem={item} />
          ))}
          <hr />
          <div>Ukupno: {procurmentValue(procurment).toFixed(2)} €</div>
          <ProcurmentStatus status={procurment.status} />
        </div>
      </ListItem>
    </>
  );
};

const ProcurmentItem = ({ procurementItem }) => {
  const { name, quantity, price } = procurementItem;

  return (
    <>
      <div className="flex flex-row justify-between">
        <p>{name}</p>
        <p>
          {quantity}kom x {price}€
        </p>
      </div>
    </>
  );
};

const ProcurmentStatus = ({ status }) => {
  return (
    <>
      <p
        className={`${status == PROCURMENT_APPROVED ? "text-green-700" : ""} ${status == PROCURMENT_REJECTED ? "text-red-700" : ""} font-semibold ${status == PROCURMENT_PENDING ? "text-yellow-700" : ""}`}
      >
        Status: {status}
      </p>
    </>
  );
};

const changeStatus = async ({ procurmentId, newStatus, dispatch }) => {
  try {
    const res = await api.put(`/procurments`, { procurmentId, newStatus });
    dispatch(updateProcurmentStatus({ procurmentId, newStatus }));
  } catch (error) {
    console.error("Greška pri promjeni statusa nabavke:", error);
    handleError({
      ...error,
      generalMessage: "Došlo je do greške pri promjeni statusa nabavke.",
    });
  } finally {
  }
};

const deleteProcurmentApi = async ({ procurmentId, dispatch }) => {
  try {
    const res = await api.delete(`/procurments`, { data: { procurmentId } });
    dispatch(deleteProcurment(procurmentId));
  } catch (error) {
    console.error("Greška pri brisanju nabavke:", error);
    handleError({
      ...error,
      generalMessage: "Došlo je do greške pri brisanju nabavke.",
    });
  } finally {
  }
};
