"use client";
import { List, ListItem } from "@/components/layout/preview/list";
import { orderSortOptions } from "@/components/layout/preview/sort";
import { SORT_INIT_VALUE } from "@/lib/constants/others";
import {
  DELIVERED,
  WAREHOUSE_REQUESTED,
} from "@/lib/constants/webstore/orders";
import { getName, showDateTime } from "@/lib/utils/display";
import { initFilters } from "@/lib/utils/list";
import { deleteOrderUtil } from "@/lib/utils/webstore/orders";

import { filterOrders, sortOrders } from "@/store/webstore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { WarehouseRequestModal } from "./WarehouseRequestComponents";

export const OrdersList = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const orders = useSelector((state) => state.webstore.orders.filteredItems);
  const [sortBy, setSortBy] = useState(SORT_INIT_VALUE);
  const [filters, setFilters] = useState(initFilters("orders"));
  useEffect(() => {
    if (!orders) return;
    dispatch(sortOrders(sortBy));
  }, [sortBy]);
  useEffect(() => {
    if (!orders) return;
    dispatch(filterOrders({ filters, sortBy }));
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
        <OrderListItem
          key={order._id}
          order={order}
          dispatch={dispatch}
          router={router}
        />
      ))}
    </List>
  );
};

const OrderListItem = ({ order, dispatch, router }) => {
  const [warehouseRequestOpen, setWarehouseRequestOpen] = useState(false);
  const orderActions = [
    ...(!(order.state === DELIVERED)
      ? [
          {
            label: "Izbriši",
            className: "cancelButton",
            onClick: () => {
              deleteOrderUtil({ orderId: order._id, dispatch, router });
            },
          },
        ]
      : []),
    ...(!(order.state === WAREHOUSE_REQUESTED)
      ? [
          {
            label: "Zahtjev skladištu",
            className: "submitButton",
            onClick: () => {
              setWarehouseRequestOpen(true);
            },
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
  return (
    <>
      <ListItem actionOptions={orderActions}>
        <OrderItem order={order} />
      </ListItem>
      {warehouseRequestOpen && (
        <WarehouseRequestModal
          isOpen={warehouseRequestOpen}
          onCancel={() => setWarehouseRequestOpen(false)}
          order={order}
        />
      )}
    </>
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
