"use client";

import { LoadingFullScreen } from "@/components/layout/loading";
import { List, ListItem } from "@/components/layout/preview/list";
import { AppTable } from "@/components/layout/preview/table";
import { cropVarietyBatchResources } from "@/lib/utils/production/resources";
import { refreshHarvestingBatches } from "@/store/production";
import { useEffect } from "react";
import { useSelector, useDispatch, batch } from "react-redux";
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
      <List title="Sirovine">
        {batchesResources.map((batchResources) => (
          <ProductionResource key={uuid()} batchResources={batchResources} />
        ))}
      </List>
    </div>
  );
};

const ProductionResource = ({ batchResources }) => {
  const { batchName, resources } = batchResources;
  if (!resources || resources.length === 0) return null;
  return (
    <ListItem title={batchName}>
      <AppTable
        headerLabels={Object.keys(resources[0] || {}).map(
          (key) => batchResourceHeaderItems[key],
        )}
        rows={resources}
      />
    </ListItem>
  );
};

const batchResourceHeaderItems = {
  cropVariety: "Sorta",
  batchQuantity: "Količina",
  quality: "Kvaliteta",
};
