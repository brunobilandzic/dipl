"use client";

import { List, ListItem } from "@/components/layout/preview/list";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { showDateTime } from "@/lib/utils/display";
import { useState } from "react";
import {
  FINANCIAL_MANAGER,
  GENERAL_MANAGER,
} from "@/lib/constants/users/managerTypes";
import {
  PROCURMENT_APPROVED,
  PROCURMENT_PENDING,
  PROCURMENT_REJECTED,
} from "@/lib/constants/documents/procurments";

export const ProcurmentList = () => {
  const procurments = useSelector((state) => state.procurments.filteredItems);
  const managerModelName = useSelector(
    (state) => state.user?.session?.managerModelName,
  );
  const [showAll, setShowAll] = useState(false);
  const allView = [FINANCIAL_MANAGER, GENERAL_MANAGER].includes(
    managerModelName,
  );
  console.log({ procurments });
  const router = useRouter();

  const showAllButton = () => {
    if (![FINANCIAL_MANAGER, GENERAL_MANAGER].includes(managerModelName)) {
      return null;
    }
    return (
      <div className="btn btnSm" onClick={() => setShowAll((prev) => !prev)}>
        {showAll ? "Prikaži moje" : "Prikaži sve"}
      </div>
    );
  };

  return (
    <>
      <List
        title="Nabavke"
        onCreateItem={() => router.push("/nabava/izradi")}
        customButtons={showAllButton()}
      >
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
            />
          ))}
      </List>
    </>
  );
};

const ProcurmentListItem = ({ procurment, managerModelName, allView }) => {
  let approveProcurmentAction, rejectProcurmentAction;

  let deleteProcurmentAction =
    managerModelName == procurment.manager.managerModelName &&
    procurment.status == PROCURMENT_PENDING
      ? {
          label: "Obriši",
          className: "cancelButton",
          onClick: () => {
            // Implement deletion logic here
            console.log("Obriši nabavku:", procurment._id);
          },
        }
      : null;

  if (allView) {
    approveProcurmentAction = {
      label: "Odobri",
      className: "submitButton",
      onClick: () => {
        // Implement approval logic here
        console.log("Odobri nabavku:", procurment._id);
      },
    };
    rejectProcurmentAction = {
      label: "Odbij",
      className: "cancelButton",
      onClick: () => {
        // Implement rejection logic here
        console.log("Odbij nabavku:", procurment._id);
      },
    };
  }

  const procurmentActions = [
    ...(allView
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


const changeStatus = ({procurmentId, newStatus}) => {
  // Implement status change logic here, e.g., make an API call to update the procurment status
  console.log(`Changing status of procurment ${procurmentId} to ${newStatus}`);
}