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
        <p>Nabavka: {procurment._id}</p>
      </ListItem>
    </>
  );
};
