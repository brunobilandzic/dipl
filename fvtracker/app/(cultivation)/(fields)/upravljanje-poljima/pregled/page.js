import { FieldsList } from "@/components/cultivation/fields/preview/list";
import clean from "@/lib/db/clean";
import React from "react";
import { getCultivationManager } from "@/lib/cultivation/cultivationManager";

export default async function PregledPoljaPage() {
  const cultivationManager = await getCultivationManager();

  return (
    <>
      {/*  {JSON.stringify(cultivationManager)} */}
      {<FieldsList fields={clean(cultivationManager.fields)} />}
    </>
  );
}
