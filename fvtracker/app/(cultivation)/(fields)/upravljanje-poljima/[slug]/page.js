
import React from "react";

export default async function FieldPage({params}) {
  const { slug } = await params; return <div>Field page {slug}</div>;
};


