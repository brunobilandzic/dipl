import { productsAllProductionStocksSum } from "@/lib/utils/production/stocks";
import { totalWarehouseStockQuantity } from "@/lib/utils/storage/warehouse";

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
  
  return (
    <>
      {" "}
      <div className="stockquantity flex items-center gap-4">
        <StockQuantity label="Pogoni" quantity={totalProductionQuantity} />
        <StockQuantity label="Skladišta" quantity={totalWarehouseQuantity} />
      </div>
    </>
  );
};

const StockQuantity = ({ label, quantity }) => {
  return (
    <div>
      <span>{label}:</span> {quantity || 0}
    </div>
  );
};
