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
      <MachineDetails
        name={machine.name}
        description={machine.description}
        createdAt={machine.createdAt}
        facility={machine.facility}
      />
      <MachineStatistics productionProcesses={machine.productionProcesses} />
    </div>
  );
};

const MachineDetails = ({ name, description, createdAt, facility }) => {
  return (
    <div>
      <div>{name}</div>
      <div className="text-sm text-gray-500">
        <div className="">{description}</div>
        {facility?.name && (
          <div className="">Postrojenje: {facility?.name}</div>
        )}
        <div>Izređen: {showDate(createdAt)}</div>
      </div>
    </div>
  );
};

const MachineStatistics = ({ productionProcesses }) => {
  const totalProcesses = productionProcesses.length;
  const totalQuantityProduced = productionProcesses.reduce(
    (total, process) => total + process.quantity,
    0,
  );
  return (
    <div className="text-sm text-gray-500">
      <div>Ukupno procesa: {totalProcesses}</div>
      <div>Ukupno proizvedeno: {totalQuantityProduced}</div>
    </div>
  );
};

export default MachinesList;
