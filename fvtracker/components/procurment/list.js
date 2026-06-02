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

  if (allView) {
    approveProcurmentAction = {
      label: "Odobri",
      className: "btn btnSm buttonSubmit",
      onClick: () => {
        // Implement approval logic here
        console.log("Odobri nabavku:", procurment._id);
      },
    };
    rejectProcurmentAction = {
      label: "Odbij",
      className: "btn btnSm buttonCancel",
      onClick: () => {
        // Implement rejection logic here
        console.log("Odbij nabavku:", procurment._id);
      },
    };
  }

  return (
    <>
      <ListItem>
        <div>{procurment.name}</div>
        <div>{procurment.description}</div>
        <div>{showDateTime(procurment.createdAt)}</div>
        {procurment.items.map((item) => (
          <ProcurmentItem key={item._id} procurementItem={item} />
        ))}
        <ProcurmentStatus status={procurment.status} />
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
      <p>Status: {status}</p>
    </>
  );
};
