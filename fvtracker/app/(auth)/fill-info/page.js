import { getServerSession } from "next-auth";
import React from "react";

async function FillInfoPage() {
  const session = await getServerSession();
  return (
    <>
      <div>FillInfoPage</div>
      <div>{JSON.stringify(session, null, 2)}</div>
    </>
  );
}

export default FillInfoPage;
