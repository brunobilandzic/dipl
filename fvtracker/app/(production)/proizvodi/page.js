import { UnathorizedPage } from "@/components/auth/unAuthorized";
import ProductList from "@/components/production/products/list";
import { PRODUCTION_MANAGER } from "@/lib/constants/users/managerTypes";
import React from "react";
import { fetchManagerWorker } from "@/lib/auth/fetchSessionData";
import { managerMorkerMap } from "@/lib/constants/users/managerWorker";
import { sanitize } from "@/lib/utils/objects";

const ProductsPage = async () => {
  let {
    specificManager: productionManager,
    worker: productionWorker,
    unauthorized,
  } = await fetchManagerWorker({
    managerNames: [PRODUCTION_MANAGER],
    workerType: managerMorkerMap[PRODUCTION_MANAGER],
  });

  if (unauthorized) {
    return <UnathorizedPage />;
  }
  return (
    <div>
      <ProductList
        worker={productionWorker ? sanitize(productionWorker) : null}
      />
    </div>
  );
};

export default ProductsPage;
