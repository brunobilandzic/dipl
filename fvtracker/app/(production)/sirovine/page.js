import { ProductionResources } from "@/components/production/resources/list";
import { fetchManager } from "@/lib/auth/fetchSessionData";
import { PRODUCTION_MANAGER } from "@/lib/constants/users/managerTypes";
import React from "react";

const ProductionResourcesPage = async () => {
  const {} = await fetchManager({ managerNames: [PRODUCTION_MANAGER] });

  return (
    <div>
      <ProductionResources />
    </div>
  );
};

export default ProductionResourcesPage;
