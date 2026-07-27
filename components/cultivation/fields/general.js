import { fieldPlantedStatistics } from "@/lib/utils/cultivation/plant/plant";
import React from "react";

export const Feed = () => {
  return <div>Feed</div>;
};

export const FieldStatistics = ({ field }) => {
  const stats = fieldPlantedStatistics(field);
  return (
    <div>
      <p>{stats.totalCACells} polja u područjma za sadnju</p>
      <p>
        {stats.plantedPlCvs.length + stats.emptyPlCvs.length} ukupno ćelija u
        gredicama
      </p>
      <p>Posađeno: {stats.plantedPlCvs.length}</p>
      <p>Prazne ćelije: {stats.emptyPlCvs.length}</p>
      <p>
        {Number(
          (stats.plantedPlCvs.length /
            (stats.plantedPlCvs.length + stats.emptyPlCvs.length)) *
            100 || 0,
        ).toFixed(2)}
        % ćelija zasađeno od ćelija u gredicama.
      </p>
    </div>
  );
};
