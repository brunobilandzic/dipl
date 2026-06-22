"use client";
import { useSelector } from "react-redux";
import { ReportItem, ReportSection, ReportSector } from "../dashboard";
import { getshipmentSourcesCountProducts } from "@/lib/utils/webstore/shipments";
import {
  getProductionStockQuantity,
  getUniqueIngredients,
} from "@/lib/utils/production/products";
import { getWarehouseStockQuantity } from "@/lib/utils/storage/warehouse";
import { LoadingFullScreen } from "@/components/layout/loading";

export const ProductionReport = ({}) => {
  const products = useSelector((state) => state.production?.products.items);

  if (!products) return <LoadingFullScreen />;

  const productionStockQuantity = getProductionStockQuantity(products);
  const warehouseStockQuantity = getWarehouseStockQuantity(products);
  const uniqueIngredients = getUniqueIngredients(products);
  const shipmentSourcesCount = getshipmentSourcesCountProducts(products);

  const facilities = useSelector((state) => state.production?.facilities.items);
  if (!products) return null;

  if (products.length === 0)
    return (
      <ReportSector title="Proizvodnja">
        <p className="text-center text-gray-500">
          Nema podataka o proizvodnji.
        </p>
      </ReportSector>
    );
  return (
    <ReportSector title="Proizvodnja">
      <ReportSection title="Proizvodi">
        <ReportItem count={products?.length || 0} description="Proizvoda" />
        <ReportItem
          count={uniqueIngredients.size}
          description="Korištenih sorti"
        />
        <ReportItem count={shipmentSourcesCount} description="Isporučeno" />
      </ReportSection>
      <ReportSection title="Zalihe">
        <ReportItem
          count={productionStockQuantity + warehouseStockQuantity}
          description="Proizvedeno"
        />
        <ReportItem
          count={facilities?.length || 0}
          description={`Postrojenj${facilities?.length > 1 ? "a" : "e"}`}
        />
        <ReportItem
          count={productionStockQuantity}
          description="U postrojenjima"
        />
        <ReportItem
          count={warehouseStockQuantity}
          description="U skladištima"
        />
      </ReportSection>
    </ReportSector>
  );
};
