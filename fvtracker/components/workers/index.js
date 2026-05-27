"use client";

import { LoadingFullScreen } from "@/components/layout/loading";
import { useSelector } from "react-redux";
import { List, ListItem } from "../layout/preview/list";
import { useRouter } from "next/navigation";

export const WorkersPageComponent = ({ managerModelName }) => {
  const workersState = useSelector((state) => state.workers);
  const { items: workers, isLoading } = workersState;
  const router = useRouter();

  if (!workers) return <LoadingFullScreen />;

  console.log("showing workers", { workers });

  return (
    <div>
      <div>
        <List
          title="Radnici"
          addLabel="Dodaj radnika"
          onCreateItem={() => router.push("/radnici/izradi")}
        >
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
