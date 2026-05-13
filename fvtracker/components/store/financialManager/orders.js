"use client";
import { List, ListItem } from "@/components/layout/preview/list";
import { orderSortOptions } from "@/components/layout/preview/sort";
import { SORT_INIT_VALUE } from "@/lib/constants/others";
import {
  DELIVERED,
  WAREHOUSE_REQUESTED,
} from "@/lib/constants/webstore/orders";
import { getName, showDate, showDateTime } from "@/lib/utils/display";
import { initFilters } from "@/lib/utils/list";
import { filterOrders, sortOrders } from "@/store/webstore";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

export const OrdersList = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.webstore.orders.filteredItems);
  const [sortBy, setSortBy] = useState(SORT_INIT_VALUE);
  const [filters, setFilters] = useState(initFilters("orders"));
  useEffect(() => {
    if (!orders) return;
    dispatch(sortOrders(sortBy));
  }, [sortBy]);
  useEffect(() => {
    if (!orders) return;
    dispatch(filterOrders(filters));
  }, [filters]);

  return (
    <List
      title="Narudžbe"
      sortBy={sortBy}
      setSortBy={setSortBy}
      sortOptions={orderSortOptions}
      filters={filters}
      setFilters={setFilters}
      initialFilters={initFilters("orders")}
    >
      {orders?.map((order) => (
        <OrderListItem key={order._id} order={order} />
      ))}
    </List>
  );
};

const OrderListItem = ({ order }) => {
  const orderActions = [
    ...(!(order.state === DELIVERED)
      ? [
          {
            label: "Izbriši",
            className: "cancelButton",
          },
        ]
      : []),
    ...(!(order.state === WAREHOUSE_REQUESTED)
      ? [
          {
            label: "Zatraži skladište",
            className: "submitButton",
          },
        ]
      : []),
    ...(!order.receipt &&
    ![WAREHOUSE_REQUESTED, DELIVERED].includes(order.state)
      ? [
          {
            label: "Izradi račun",
            onClick: () => {
              console.log("izrada računa za", order.number);
            },
            className: "submitButton",
          },
        ]
      : !(order.state == DELIVERED) && [
          {
            label: "Pošalji",
            className: "submitButton",
          },
        ]),
  ];
  console.log({ order });
  return (
    <ListItem actionOptions={orderActions}>
      <OrderItem order={order} />
    </ListItem>
  );
};

const OrderItem = ({ order }) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <div className="listitemheader">Narudžba #{order.number} </div>
        <div>
          {getName({
            name: order.customer.name,
            surname: order.customer.surname,
          })}
        </div>
        <div>
          <OrderItems items={order.items} />
        </div>
      </div>
      <div className="listitemDescription">{showDateTime(order.createdAt)}</div>
    </div>
  );
};

const OrderItems = ({ items }) => {
  return (
    <div className="mt-2">
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            {item.product.name} x {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};
