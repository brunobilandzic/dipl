import { productsAllProductionStocksSum } from "@/lib/utils/production/stocks";

export const ProductItemStocksInfo = ({ productionStocks }) => {
  const totalProductionQuantity = productsAllProductionStocksSum({
    productionStocks,
  });
  console.log({ totalProductionQuantity });
  return (
    <>
      {" "}
      <div className="stockquantity flex items-center gap-4">
        <StockQuantity label="Pogoni" quantity={totalProductionQuantity} />
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
