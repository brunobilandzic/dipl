"use client";

import { LoadingFullScreen } from "@/components/layout/loading";
import api from "@/lib/api";
import { fetchWorkers } from "@/lib/utils/workers/api";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const WorkersPageComponent = ({ managerModelName }) => {
  const workers = useSelector((state) => state.workers.workers);

  useEffect(() => {
    if (workers) return;

    fetchWorkers(managerModelName);
  }, [managerModelName, workers]);

  if (!workers) return <LoadingFullScreen />;

  return <div>{workers.length}</div>;
};
