import { MaterialsList } from "@/components/production/materials/list";
import { fetchManager } from "@/lib/auth/fetchSessionData";
import { PRODUCTION_MANAGER } from "@/lib/constants/users/managerTypes";
import React from "react";

const ProductionMaterialsPage = async () => {
  const {} = await fetchManager({ managerNames: [PRODUCTION_MANAGER] });
  return (
    <div>
      <MaterialsList />
    </div>
  );
};

export default ProductionMaterialsPage;
