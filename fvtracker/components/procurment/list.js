"use client";

import { List, ListItem } from "@/components/layout/preview/list";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export const ProcurmentList = () => {
  const procurments = useSelector((state) => state.procurments.filteredItems);
  console.log({ procurments });
  const router = useRouter();

  return (
    <>
      <List title="Nabavke" onCreateItem={() => router.push("/nabava/izradi")}>
        {procurments.map((procurment) => (
          <ProcurmentListItem key={procurment._id} procurment={procurment} />
        ))}
      </List>
    </>
  );
};

const ProcurmentListItem = ({ procurment }) => {
  return (
    <>
      <ListItem>
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
