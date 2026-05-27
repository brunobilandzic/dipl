"use client";

import { LoadingFullScreen } from "@/components/layout/loading";
import { fetchWorkers } from "@/lib/utils/workers/api";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { List, ListItem } from "../layout/preview/list";

export const WorkersPageComponent = ({ managerModelName }) => {
  const workersState = useSelector((state) => state.workers);
  const { items: workers, isLoading } = workersState;

  useEffect(() => {
    if (workers) return;

    fetchWorkers(managerModelName);
  }, [managerModelName, workers]);

  if (!workers) return <LoadingFullScreen />;

  return (
    <div>
      <div>Vaš sektor ima zaposlena {workers.length} radnika.</div>
      <div>
        <List title="Radnici">
          {workers.map((worker) => (
            <WorkerItem key={worker._id} worker={worker} />
          ))}
        </List>
      </div>
    </div>
  );
};

const WorkerItem = ({ worker }) => {
  return <ListItem title={``}></ListItem>;
};
