"use client";

import React, { useState } from "react";
import { FaCubes } from "@react-icons/all-files/fa/FaCubes";
import { useSelector } from "react-redux";
import { List, ListItem } from "../layout/preview/list";
import { OptionButtons } from "../layout/buttons/options";
import { ReturnButton } from "../layout/buttons/buttons";
import WarehouseAcceptances from "./acceptences";
import { IoEnterOutline } from "@react-icons/all-files/io5/IoEnterOutline";
import { buildAcceptances } from "@/lib/utils/storage/acceptances";

function WarehousePageComponent({ slug }) {
  const warehouses = useSelector((state) => state.warehouse.warehouses.items);
  const warehouse = warehouses?.find((w) => w.slug === slug);

  const [stocksView, setStocksView] = useState(false);
  const [acceptancesView, setAcceptancesView] = useState(false);

  const options = [
    {
      label: "Proizvodi",
      icon: <FaCubes />,
      onClick: () => {
        setStocksView(true);
      },
    },
    {
      label: "Prijemi",
      icon: <IoEnterOutline />,
      onClick: () => {
        setAcceptancesView(true);
      },
    },
  ];

  if (!warehouse) return <div>Warehouse not found</div>;
  if (stocksView) {
    return (
      <div>
        <WarehouseStocks
          stocks={warehouse.stocks}
          onCancel={() => setStocksView(false)}
          warehouseName={warehouse.name}
        />
      </div>
    );
  }
  if (acceptancesView) {
    return (
      <WarehouseAcceptances
        acceptances={buildAcceptances({ stocks: warehouse.stocks })}
        warehouseName={warehouse.name}
        onCancel={() => setAcceptancesView(false)}
      />
    );
  }
  return (
    <div>
      <WarehouseOptions options={options} />
    </div>
  );
}

const WarehouseOptions = ({ options }) => {
  return <OptionButtons options={options} />;
};

const WarehouseStocks = ({ stocks, onCancel, warehouseName }) => {
  return (
    <div>
      <List
        title={`Zalihe na skladištu ${warehouseName}`}
        customButtons={
          <ReturnButton
            onClick={onCancel}
            returnLabel="Povratak na skladiste"
          />
        }
      >
        {stocks.map((stock) => (
          <WarehouseStockItem key={stock._id} stock={stock} />
        ))}
      </List>
    </div>
  );
};

const WarehouseStockItem = ({ stock }) => {
  return (
    <div>
      <ListItem>
        <div className="flex justify-between">
          <div>{stock.product.name}</div>
          <div>{stock.quantity} kom</div>
        </div>
      </ListItem>
    </div>
  );
};

export default WarehousePageComponent;
