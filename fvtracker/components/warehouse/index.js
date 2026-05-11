"use client";

import React, { useState } from "react";
import { FaCubesStacked } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { List } from "../layout/preview/list";
import { OptionButtons } from "../layout/buttons/options";
import { ReturnButton } from "../layout/buttons/buttons";

function WarehousePageComponent({ slug }) {
  const warehouses = useSelector((state) => state.warehouse.warehouses.items);
  const warehouse = warehouses?.find((w) => w.slug === slug);

  const [stocksView, setStocksView] = useState(false);

  const options = [
    {
      label: "Proizvodi",
      icon: <FaCubesStacked />,
      onClick: () => {
        setStocksView(true);
      },
    },
  ];

  console.log({ stocksView });

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
          <ReturnButton onClick={onCancel} returnLabel="Povratak na zalihe" />
        }
      >
        {stocks.map((stock) => (
          <div key={stock._id}>{stock?.product?.name}</div>
        ))}
      </List>
    </div>
  );
};

export default WarehousePageComponent;
