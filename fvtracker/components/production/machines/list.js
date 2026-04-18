"use client";

import { List, ListItem } from "@/components/layout/preview/list";
import { showDate } from "@/lib/utils/display";
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
  console.log("Rendering machine item:", machine);
  return (
    <div className="flex justify-between">
      <div>
        <div>{machine.name}</div>
        <div className="text-sm text-gray-500">{machine.description}</div>
        <div>Izređen: {showDate(machine.createdAt)}</div>
      </div>
      <div></div>
    </div>
  );
};

export default MachinesList;
