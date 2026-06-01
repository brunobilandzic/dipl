"use client";

import { List, ListItem } from "@/components/layout/preview/list";
import { useSelector } from "react-redux";

export const ProcurmentList = () => {
  const procurments = useSelector((state) => state.procurments.filteredItems);
  console.log({ procurments });

  return (
    <>
      <List title="Nabavke">
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
