"use client";

import { LoadingFullScreen } from "@/components/layout/loading";
import { List, ListItem } from "@/components/layout/preview/list";
import { cropVarietyBatchResources } from "@/lib/utils/production/resources";
import { refreshHarvestingBatches } from "@/store/production";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";

export const ProductionResources = ({}) => {
  const harvestingBatches = useSelector(
    (state) => state.production.harvestingBatches.items,
  );
  const { resources } = cropVarietyBatchResources({ harvestingBatches });
  const dispatch = useDispatch();
  useEffect(() => {
    if (!harvestingBatches) {
      dispatch(refreshHarvestingBatches());
    }
  }, [harvestingBatches, dispatch]);
  if (!harvestingBatches) return <LoadingFullScreen />;
  return (
    <div>
      <List title="Materijali">
        {resources.map((resource) => (
          <ProductionResource key={uuid()} resource={resource} />
        ))}
      </List>
    </div>
  );
};

const ProductionResource = ({ resource }) => {
  console.log({ resource });
  return <ListItem title={resource.name} />;
};
