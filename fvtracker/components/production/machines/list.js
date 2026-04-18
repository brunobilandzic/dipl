"use client";

import { List, ListItem } from "@/components/layout/preview/list";
import React from "react";
import { useSelector } from "react-redux";

const MachinesList = () => {
  const machines = useSelector(
    (state) => state.production.machines.filteredItems,
  );

  return (
    <div>
      <List title="Strojevi">
        {machines?.map((machine) => (
          <ListItem key={machine.id}>
            <MachineItem machine={machine} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

const MachineItem = ({ machine }) => {
  return <div>{machine.name}</div>;
};

export default MachinesList;
