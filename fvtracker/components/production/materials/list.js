"use client";

import { List, ListItem } from "@/components/layout/preview/list";
import { refreshMaterials } from "@/store/production";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

export const MaterialsList = ({}) => {
  const materials = useSelector(
    (state) => state.production.materials.filteredItems,
  );
  console.log({ materials });
  const dispatch = useDispatch();
  useEffect(() => {
    if (!materials) {
      dispatch(refreshMaterials());
    }
  }, [materials, dispatch]);
  if (!materials) return dispatch(refreshMaterials());
  return (
    <div>
      <List title="Materijali">
        {materials.map((material) => (
          <MaterialsListItem key={material.id} material={material} />
        ))}
      </List>
    </div>
  );
};

const MaterialsListItem = ({ material }) => {
  return <ListItem title={material.name} />;
};
