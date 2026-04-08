"use client";

import { LoadingFullScreen } from "@/components/layout/loading";
import { List, ListItem } from "@/components/layout/preview/list";
import { materialsList } from "@/lib/utils/production/materials";
import { refreshMaterials } from "@/store/production";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

export const MaterialsList = ({}) => {
  const materials = useSelector(
    (state) => state.production.materials.filteredItems,
  );
  const harvestingBatchItems = materials ? materialsList({ materials }) : [];
  console.log({ materials });
  const dispatch = useDispatch();
  useEffect(() => {
    if (!materials) {
      dispatch(refreshMaterials());
    }
  }, [materials, dispatch]);
  if (!materials) return <LoadingFullScreen />;
  return (
    <div>
      <List title="Materijali">
        {materials.map((material) => (
          <MaterialsListItem key={material._id} material={material} />
        ))}
      </List>
    </div>
  );
};

const MaterialsListItem = ({ material }) => {
  return <ListItem title={material.name} />;
};
