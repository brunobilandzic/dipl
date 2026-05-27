"use client";

import { LoadingFullScreen } from "@/components/layout/loading";
import { useSelector } from "react-redux";

export const WorkersList = ({ workers }) => {
  const workersState = useSelector((state) => state.workers);
  console.log("Workers state in component:", workersState);
  const { items: workers, isLoading } = workersState;
  if (!workers) return <LoadingFullScreen />;

  return <div>csacas {workers.length}</div>;
};
