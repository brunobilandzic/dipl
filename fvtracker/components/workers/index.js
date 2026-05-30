"use client";

import { LoadingFullScreen } from "@/components/layout/loading";
import { useSelector } from "react-redux";
import { List, ListItem } from "../layout/preview/list";
import { useRouter } from "next/navigation";
import { showDate } from "@/lib/utils/display";
import { workPay } from "@/lib/utils/workers/pay";
import { worksCoordsSum } from "@/lib/utils/workers/cultivation";
import {
  CULTIVATION_MANAGER,
  PRODUCTION_MANAGER,
} from "@/lib/constants/users/managerTypes";

export const WorkersPageComponent = ({ managerModelName }) => {
  const workersState = useSelector((state) => state.workers);
  const { items: workers, isLoading } = workersState;
  const router = useRouter();

  if (!workers) return <LoadingFullScreen />;

  console.log("showing workers", { workers }, { managerModelName });

  return (
    <div>
      <div>
        <List
          title="Radnici"
          addLabel="Dodaj radnika"
          onCreateItem={() => router.push("/radnici/izradi")}
        >
          {workers.map((worker) => (
            <WorkerItem key={worker._id} worker={worker}>
              <WorkerContent
                worker={worker}
                managerModelName={managerModelName}
              />
            </WorkerItem>
          ))}
        </List>
      </div>
    </div>
  );
};

const WorkerItem = ({ worker, children }) => {
  return (
    <ListItem title={``}>
      <div>
        <div>
          <div>
            {worker.appUser.name} {worker.appUser.surname}
          </div>
          <div className="text-sm text-gray-500">
            {showDate(worker.createdAt)}
          </div>
          <div>{worker.hourlyRate} $/h</div>
        </div>

        {children}
      </div>
    </ListItem>
  );
};

function WorkerContent({ worker, managerModelName }) {
  console.log({ managerModelName });
  switch (managerModelName) {
    case CULTIVATION_MANAGER:
      return <CultivationWorker worker={worker} />;
    case PRODUCTION_MANAGER:
      return <ProductionWorker worker={worker} />;
    default:
      return null;
  }
}

const CultivationWorker = ({ worker }) => {
  return (
    <>
      <div>
        {workPay({
          hourlyRate: worker.hourlyRate,
          works: [...worker.plantageWorks, ...worker.harvestWorks],
        })}{" "}
        $ ukupno
      </div>
      <div>
        Zasađeno: {worksCoordsSum({ works: worker.plantageWorks, plant: true })}
      </div>
      <div>
        Ubrano: {worksCoordsSum({ works: worker.harvestWorks, plant: false })}
      </div>
      <div>{worker.plantageWorks.length} sadnji</div>
      <div>{worker.harvestWorks.length} berbi</div>
    </>
  );
};

const ProductionWorker = ({ worker }) => {
  return <>pw</>;
};
