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

  const generalManagerRequest = await GeneralManagerRequest.findOne(
    {},
  ).populate([
    {
      path: "generalManager",
      populate: {
        path: "rootManager",
        populate: {
          path: "appUser",
          select: "email name surname",
        },
      },
    },
  ]);

  const approveRequest = async () => {
    if (!generalManagerRequest) {
      console.error("No General Manager Request found");
      return;
    }
    generalManagerRequest.status = ROLE_STATUSES.APPROVED;
    await generalManagerRequest.save();
  };

  const appUser = generalManagerRequest?.generalManager?.rootManager?.appUser;
  const approved = generalManagerRequest?.status === ROLE_STATUSES.APPROVED;
  return (
    <div>
      <GeneralManagerRequestComponent
        request={sanitize(generalManagerRequest)}
      />
    </div>
  );
}

export default GeneralManagerRequestsPage;
