import { fieldPlantedStatistics } from "@/lib/utils/plant";
import React from "react";

export const Feed = () => {
  return <div>Feed</div>;
};

export const FieldStatistics = ({ field }) => {
  const stats = fieldPlantedStatistics(field);
  return (
    <div>
      <p>Total CA Cells: {stats.totalCACells}</p>
      <p>Planted PlCvs: {stats.plantedPlCvs.length}</p>
      <p>Empty PlCvs: {stats.emptyPlCvs.length}</p>
    </div>
  );
};
