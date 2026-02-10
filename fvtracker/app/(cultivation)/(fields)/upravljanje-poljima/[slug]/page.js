import React from "react";

export default async function FieldPage({ params }) {
  const { slug } = await params;
  const field = await fetchFieldBySlug(slug);

  return (
    <>
      <div>Field page {slug}</div>
    </>
  );
}
