import React from "react";
import dbConnect from "@/lib/db/mongooseConnect";
import { fetchAdmin } from "@/lib/auth/fetchSessionData";
import { GeneralManagerRequest } from "@/models/documents/requests/RoleRequest";
import { RoleRequestItem } from "@/components/generalManager/requests";
import { ROLE_STATUSES } from "@/lib/constants/users";
import { GeneralManagerRequestComponent } from "@/components/auth/genmanreq";
import { sanitize } from "@/lib/utils/objects";

async function GeneralManagerRequestsPage() {
  await dbConnect();
  const { unauthorized, admin } = await fetchAdmin();

  if (unauthorized) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  return (
    <div>
      <GeneralManagerRequestComponent />
    </div>
  );
}

export default GeneralManagerRequestsPage;
