"use client";

import { LoadingFullScreen } from "@/components/layout/loading";
import { fetchWorkers } from "@/lib/utils/workers/api";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export const WorkersPageComponent = ({ managerModelName }) => {
  const workersState = useSelector((state) => state.workers);
  const { items: workers, isLoading } = workersState;

  useEffect(() => {
    if (workers) return;

    fetchWorkers(managerModelName);
  }, [managerModelName, workers]);

  if (!workers) return <LoadingFullScreen />;

  return <div>{workers.length}</div>;
};
