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

export const ProcurmentList = () => {
  const procurments = useSelector((state) => state.procurments.filteredItems);
  const managerModelName = useSelector(
    (state) => state.user?.session?.managerModelName,
  );
  const [showAll, setShowAll] = useState(false);

  console.log({ procurments });
  const router = useRouter();

  const showAllButton = () => {
    if (![FINANCIAL_MANAGER, GENERAL_MANAGER].includes(managerModelName)) {
      return null;
    }
    return (
      <div className="btn btnSm" onClick={() => setShowAll((prev) => !prev)}>
        {showAll ? "Prikaži samo aktivne" : "Prikaži sve"}
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
        {procurments.map((procurment) => (
          <ProcurmentListItem
            key={procurment._id}
            procurment={procurment}
            managerModelName={managerModelName}
          />
        ))}
      </List>
    </>
  );
};

const ProcurmentListItem = ({ procurment }) => {
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
