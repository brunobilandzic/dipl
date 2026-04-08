"use client";

import { LoadingFullScreen } from "@/components/layout/loading";
import { List, ListItem } from "@/components/layout/preview/list";
import { cropVarietyBatchResources } from "@/lib/utils/production/resources";
import { refreshMaterials } from "@/store/production";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

export const ProductionResources = ({}) => {
  const materials = useSelector(
    (state) => state.production.materials.filteredItems,
  );
  const resources = cropVarietyBatchResources({ materials });
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
          <ProductionResource key={material._id} material={material} />
        ))}
      </List>
    </div>
  );
};

const ProductionResource = ({ material }) => {
  return <ListItem title={material.name} />;
};
