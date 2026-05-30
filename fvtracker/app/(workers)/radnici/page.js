import { WorkersPageComponent } from "@/components/workers";
import { fetchSessionManagerModelName } from "@/lib/auth/fetchSessionData";
import React from "react";

async function WorkersPage() {
  const { managerModelName } = await fetchSessionManagerModelName();

  return (
    <div>
      <WorkersPageComponent managerModelName={managerModelName} />
    </div>
  );
}

export default WorkersPage;
