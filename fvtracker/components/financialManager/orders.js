"use client";
import { List, ListItem } from "@/components/layout/preview/list";
import { orderSortOptions } from "@/components/layout/preview/sort";
import { SORT_INIT_VALUE } from "@/lib/constants/others";
import { getName, showDateTime } from "@/lib/utils/display";
import { initFilters } from "@/lib/utils/list";
import { deleteOrderUtil } from "@/lib/utils/webstore/orders";

import { filterOrders, sortOrders } from "@/store/webstore";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { WarehouseRequestModal } from "@/components/warehouse/warehouseRequest/create";
import { orderAmount } from "@/lib/utils/sales";
import { priceEuroString } from "@/lib/utils/strings";
import { PENDING } from "@/lib/constants/documents/requests";
import { fetchWarehouses } from "@/store/warehouse";

export const OrdersList = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const orders = useSelector((state) => state.webstore.orders.filteredItems);
  const warehouses = useSelector((state) => state.warehouse.warehouses?.items);
  const managerModelName = useSelector(
    (state) => state.user.session?.managerModelName,
  );
  const [sortBy, setSortBy] = useState(SORT_INIT_VALUE);
  const initialFilters = useMemo(() => initFilters("orders"), []);
  const [filters, setFilters] = useState(initialFilters);
  useEffect(() => {
    if (!orders) return;
    dispatch(sortOrders(sortBy));
  }, [sortBy]);
  useEffect(() => {
    if (!orders) return;
    dispatch(filterOrders({ filters, sortBy }));
  }, [filters]);
  useEffect(() => {
    if (!managerModelName && (!warehouses || warehouses.length === 0)) {
      dispatch(fetchWarehouses());
    }
  }, [managerModelName, warehouses, dispatch]);

  return (
    <List
      title="Narudžbe"
      sortBy={sortBy}
      setSortBy={setSortBy}
      sortOptions={orderSortOptions}
      filters={filters}
      setFilters={setFilters}
      initialFilters={initialFilters}
    >
      {orders?.map((order) => (
        <OrderListItem
          key={order._id}
          order={order}
          dispatch={dispatch}
          router={router}
          warehouses={warehouses}
        />
      ))}
    </List>
  );
};

const OrderListItem = ({ order, dispatch, router, warehouses }) => {
  const [warehouseRequestOpen, setWarehouseRequestOpen] = useState(false);
  const orderActions = [
    ...(order.state == PENDING
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
    ...(!order.warehouseRequest
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
          warehouses={warehouses}
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
      <div>
        <div className="font-bold italic text-right">
          {priceEuroString(orderAmount(order).toFixed(2))}
        </div>
        <div className="listitemDescription">
          {showDateTime(order.createdAt)}
        </div>
      </div>
    </div>
  );
};

const OrderItems = ({ items }) => {
  return (
    <div className="mt-2">
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            {item.product.name} Poslano:{" "}
            {item.shipmentSources.reduce(
              (total, source) => total + source.quantity,
              0,
            )}{" "}
            / {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};
