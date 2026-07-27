import React from "react";
import dbConnect from "@/lib/db/mongooseConnect";
import { fetchAdmin } from "@/lib/auth/fetchSessionData";
import { GeneralManagerRequest } from "@/models/documents/requests/RoleRequest";
import { GeneralManagerRequestsComponent } from "@/components/auth/genmanreq";

async function GeneralManagerRequestsPage() {
  await dbConnect();
  const { unauthorized, admin } = await fetchAdmin();

  if (unauthorized) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

/*   const count = await GeneralManagerRequest.countDocuments();
  if (count === 0) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">
          Zahtevi za generalnog menadžera
        </h1>
        <p className="">Trenutno nema zahteva za generalnog menadžera.</p>
      </div>
    );
  } */

  return (
    <div>
      <GeneralManagerRequestsComponent />
    </div>
  );
}

export default GeneralManagerRequestsPage;
