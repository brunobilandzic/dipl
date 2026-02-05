import { FieldsList } from "@/components/cultivation/fields/preview/list";
import { fetchSessionAppUser } from "@/lib/auth/fetchSessionData";
import clean from "@/lib/db/clean";
import React from "react";

export default async function PregledPoljaPage() {
  const appUser = await fetchSessionAppUser();
  if (!appUser) {
    throw new Error("No app user found for the session.");
  }

  const cultivationManager =
    await appUser.getSpecificManager("CultivationManager");
  if (!cultivationManager) {
    return <div>No cultivation manager found for this user.</div>;
  }
  await cultivationManager.populate("fields");

  return (
    <>
      {/*  {JSON.stringify(cultivationManager)} */}
      {<FieldsList fields={clean(cultivationManager.fields)} />}
    </>
  );
}
