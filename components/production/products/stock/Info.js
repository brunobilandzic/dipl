import { productsAllProductionStocksSum } from "@/lib/utils/production/stocks";
import { totalWarehouseStockQuantity } from "@/lib/utils/storage/warehouse";
import { FaCubes } from "@react-icons/all-files/fa/FaCubes";
import { FaToolbox, FaWarehouse } from "react-icons/fa6";

export const ProductItemStocksInfo = ({
  productionStocks,
  warehouseStocks,
}) => {
  const totalProductionQuantity = productsAllProductionStocksSum({
    productionStocks,
  });
  const totalWarehouseQuantity = totalWarehouseStockQuantity({
    warehouseStocks,
  });
  const totalProcesses = (productionStocks || []).reduce(
    (acc, stock) => acc + (stock.productionProcesses?.length || 0),
    0,
  );

  return (
    <>
      {" "}
      <div className="stockquantity flex items-center gap-4">
        <StockQuantity
          label="Pogoni"
          quantity={totalProductionQuantity}
          Icon={FaCubes}
        />
        <StockQuantity
          label="Skladišta"
          quantity={totalWarehouseQuantity}
          Icon={FaWarehouse}
        />
        <StockQuantity
          label="Procesi"
          quantity={totalProcesses}
          Icon={FaToolbox}
        />
      </div>
    </>
  );
};

const StockQuantity = ({ label, quantity, Icon }) => {
  return (
    <div className="flex flex-col gap-2 items-center" title={label}>
      <div>{quantity || 0}</div> <Icon />
    </div>
  );
};
