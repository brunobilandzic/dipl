import { WorkersPageComponent } from "@/components/workers";
import {
  fetchAdmin,
  fetchSessionManagerModelName,
} from "@/lib/auth/fetchSessionData";
import React from "react";

async function WorkersPage() {
  const { managerModelName } = await fetchSessionManagerModelName();
  const { admin } = await fetchAdmin();

  return (
    <div>
      <WorkersPageComponent
        isAdmin={!!admin}
        managerModelName={managerModelName}
      />
    </div>
  );
}

export default WorkersPage;
