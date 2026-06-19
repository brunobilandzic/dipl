import {
  processesQuantitySum,
  processProductsMap,
} from "@/lib/utils/workers/production";
import { WorkerSectorInfoTitle } from ".";

export const ProductionWorkerInfo = ({
  productionProcesses,
  warehouseAcceptanceProcesses,
}) => {
  const producedProducts = processProductsMap({
    processes: productionProcesses,
  });
  const warehouseAcceptedProducts = processProductsMap({
    processes: warehouseAcceptanceProcesses,
    production: false,
  });

  return (
    <div>
      <div className="info-group">
        <div>Obavljeno proizvodnji: {productionProcesses.length}</div>
        <div>
          Ukupno proizvedeno proizvoda:{" "}
          {processesQuantitySum({ processes: productionProcesses })}
        </div>
      </div>
      <div className="info-group">
        <div>
          Obavljeno slanja u skladište: {warehouseAcceptanceProcesses.length}
        </div>
        <div>
          Ukupno poslano proizvoda:{" "}
          {processesQuantitySum({ processes: warehouseAcceptanceProcesses })}
        </div>
      </div>
      <div className="list-wrap">
        <WorkerSectorInfoTitle title="Proizvedeni" />
        <ul className="list-wrap-lis     list-disc list-inside">
          {producedProducts.map((product) => (
            <li key={`${product.name}-${product.quantity}`}>
              {product.name}: {product.quantity}
            </li>
          ))}
        </ul>
      </div>
      <div className="list-wrap">
        <WorkerSectorInfoTitle title="Poslani u skladište" />
        <ul className="list-wrap-list list-disc list-inside">
          {warehouseAcceptedProducts.map((product) => (
            <li key={`${product.name}-${product.quantity}`}>
              {product.name}: {product.quantity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
