"use client";

import { LoadingFullScreen } from "@/components/layout/loading";
import api from "@/lib/api";
import { useEffect } from "react";

export const WorkersPageComponent = ({ managerModelName }) => {
  const [workers, setWorkers] = useState(null);
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await api.get("/workers", {
          params: {
            managerModelName,
          },
        });
        setWorkers(res.data.workers);
      } catch (error) {}
    };
  });

  if (!workers) return <LoadingFullScreen />;

  return <div>{workers.length}</div>;
};
