"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { LoadingFullScreen } from "../layout/loading";
import { fetchWorkerById } from "@/store/workers";
import { useSession } from "next-auth/react";

export const WorkerProfile = () => {
  const { data: session } = useSession();
  const workerId = session?.user?.workerId;
  console.log("WorkerProfile session:", session);
  const worker = useSelector((state) => state.workers.worker);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    if (worker || !workerId) return;
    dispatch(fetchWorkerById(workerId));
  }, [worker, workerId]);
  if (!worker) return <LoadingFullScreen />;
  return <>{JSON.stringify(worker)}</>;
};
