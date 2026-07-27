import React from "react";
import { List, ListItem } from "../layout/preview/list";
import { showDateTime } from "@/lib/utils/display";
import { ReturnButton } from "../layout/buttons/buttons";
import { AppTable } from "../layout/preview/table";

function WarehouseAcceptances({ acceptances, warehouseName, onCancel }) {
  return (
    <div>
      <List
        title={`Skladište ${warehouseName} - Prijemi`}
        customButtons={
          <ReturnButton
            onClick={onCancel}
            returnLabel="Povratak na skladiste"
          />
        }
      >
        {acceptances.map((productAcceptances) => (
          <ProductAcceptances
            key={productAcceptances.product._id}
            product={productAcceptances.product}
            warehouseAcceptanceProcesses={
              productAcceptances.warehouseAcceptanceProcesses
            }
          />
        ))}
      </List>
    </div>
  );
}

const ProductAcceptances = ({ product, warehouseAcceptanceProcesses }) => {
  return (
    <ListItem>
      <div>
        <h3>{product.name}</h3>
        <List>
          {warehouseAcceptanceProcesses.map((acceptance) => (
            <WarehouseAcceptProcess
              key={acceptance._id}
              acceptance={acceptance}
            />
          ))}
        </List>
      </div>
    </ListItem>
  );
};

const WarehouseAcceptProcess = ({ acceptance }) => {
  return (
    <ListItem>
      <div className="listitemDescription">
        <div> {showDateTime(acceptance.acceptedAt)}</div>
      </div>
      <AppTable
        headerLabels={["Proizvodni pogon", "Komenatar", "Količina", "Radnik"]}
        rows={[
          [
            acceptance.productionStock?.facility?.name || "N/A",
            acceptance.comment,
            acceptance.quantity,
            `${acceptance.worker?.appUser?.name || ""} ${acceptance.worker?.appUser?.surname || ""}`,
          ]
        ]}
      />
    </ListItem>
  );
};

export default WarehouseAcceptances;
