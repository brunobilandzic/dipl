import FieldPageComponent from "@/components/cultivation/fields/field";
import { fetchFieldBySlug } from "@/lib/cultivation/fields";
import clean from "@/lib/db/clean";
import React from "react";

export default async function FieldPage({ params }) {
  const { slug } = await params;
  const field = await fetchFieldBySlug(slug);
  await field.populate({
    path: "cultivationAreas",
    populate: { path: "cultivations" },
  });

  return (
    <>
      <FieldPageComponent field={clean(field)} />
    </>
  );
}
