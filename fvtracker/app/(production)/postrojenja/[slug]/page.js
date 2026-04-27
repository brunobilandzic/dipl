import React from "react";
import Facility from "@/components/production/facilities";

async function ProductionFacilityPage({ params }) {
  const { slug } = await params;
  return (
    <div>
      <Facility slug={slug} />
    </div>
  );
}

export default ProductionFacilityPage;
