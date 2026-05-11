import WarehousePageComponent from "@/components/warehouse";
import React from "react";

async function WarehousePage({ params }) {
  const { slug } = await params;
  return (
    <div>
      <WarehousePageComponent slug={slug} />
    </div>
  );
}

export default WarehousePage;
