import React from "react";

async function ProductionFacilityPage({ params }) {
  const { slug } = await params;
  return <div>ProductionFacilityPage {slug}</div>;
}

export default ProductionFacilityPage;
