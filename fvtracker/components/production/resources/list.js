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
  const { batchesResources } = cropVarietyBatchResources({ harvestingBatches });
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
        {batchesResources.map((resource) => (
          <ProductionResource key={uuid()} resource={resource} />
        ))}
      </List>
    </div>
  );
};

const ProductionResource = ({ resource }) => {
  console.log({ resource });
  return (
    <ListItem title={resource.batchName}>
      <div className="flex ">
        <div className="mr-4">
          <p className="font-bold">{resource.cropVarietyName}</p>
          <p>{resource.cropTypeName}</p>
        </div>
        <div className="ml-auto">
          <p className="font-bold">{resource.batchQuantity}</p>
        </div>
      </div>
    </ListItem>
  );
};
