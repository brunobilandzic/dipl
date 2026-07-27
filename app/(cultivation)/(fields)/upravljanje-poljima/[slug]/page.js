import FieldPageComponent from "@/components/cultivation/fields/field";
import React from "react";

export default async function FieldPage({ params }) {
  const { slug } = await params;

  return (
    <>
      <FieldPageComponent slug={slug} />
    </>
  );
}
