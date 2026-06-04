import { useSelector } from "react-redux";
import { ReportItem, ReportSection, ReportSector } from "../dashboard";

export const ProductionManagerReports = ({}) => {
  const products = useSelector((state) => state.production?.products.items);
  const productionStockQuantity = products?.reduce(
    (total, product) =>
      total +
      product.productionStocks.reduce(
        (stockTotal, stock) => stockTotal + stock.quantity,
        0,
      ),
    0,
  );
  const warehouseStockQuantity = products?.reduce(
    (total, product) =>
      total +
      product.warehouseStocks.reduce(
        (stockTotal, stock) => stockTotal + stock.quantity,
        0,
      ),
    0,
  );
  const facilities = useSelector((state) => state.production?.facilities.items);
  console.log({ facilities });
  if (!products) return null;
  return (
    <ReportSector title="Proizvodnja">
      <ReportSection title="Proizvodi">
        <ReportItem count={products?.length || 0} description="Proizvoda" />
        <ReportItem
          count={productionStockQuantity + warehouseStockQuantity}
          description="Proizvedeno"
        />

        <ReportItem count={warehouseStockQuantity} description="Skladišta" />
      </ReportSection>
      <ReportSection title="Postrojenja">
        <ReportItem count={facilities?.length || 0} description="Postrojenja" />
        <ReportItem count={productionStockQuantity} description="Proizvoda" />
      </ReportSection>
    </ReportSector>
  );
};
