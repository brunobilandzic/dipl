"use client";

import { refreshMaterials } from "@/store/production";
import { useSelector, useDispatch } from "react-redux";

export const MaterialsList = ({}) => {
  const materials = useSelector(
    (state) => state.production.materials.filteredItems,
  );
  console.log({ materials });
  const dispatch = useDispatch();
  if (!materials) return dispatch(refreshMaterials());
  return (
    <div>
      <h2>Materials</h2>
      <ul>
        {materials.map((material) => (
          <li key={material.id}>{material.name}</li>
        ))}
      </ul>
    </div>
  );
};
