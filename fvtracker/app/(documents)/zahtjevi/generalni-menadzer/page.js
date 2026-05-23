import React from "react";
import dbConnect from "@/lib/db/mongooseConnect";
import { fetchAdmin } from "@/lib/auth/fetchSessionData";
import { GeneralManagerRequest } from "@/models/documents/requests/RoleRequest";
import { RoleRequestItem } from "@/components/generalManager/requests";

async function GeneralManagerRequestsPage() {
  await dbConnect();
  const { unauthorized, admin } = await fetchAdmin();

  if (unauthorized) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const generalManagerRequest = await GeneralManagerRequest.findOne({
    admin: admin._id,
  }).populate("appUser", "name surname email");

  return (
    <div>
      <div>
        <div>{JSON.stringify(generalManagerRequest)}</div>
      </div>
    </div>
  );
}

export default GeneralManagerRequestsPage;
