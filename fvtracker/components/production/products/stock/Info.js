export const ProductItemStocksInfo = ({ productionStocks }) => {
  return (
    <>
      {" "}
      <div className="stockquantity flex items-center gap-4">
        <h3 className="font-semibold">Na zalihi:</h3>
        <span className="text-5xl font-bold">
          {productionStocks?.quantity || 0}
        </span>
      </div>
    </>
  );
};
