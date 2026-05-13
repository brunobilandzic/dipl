"use client";
import { List, ListItem } from "@/components/layout/preview/list";
import {
  DELIVERED,
  WAREHOUSE_REQUESTED,
} from "@/lib/constants/webstore/orders";
import { getName, showDate } from "@/lib/utils/display";
import classNames from "classnames";
import { useSelector } from "react-redux";

export const OrdersList = () => {
  const orders = useSelector((state) => state.webstore.orders.filteredItems);
  return (
    <List title="Narudžbe">
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
          Kupac:{" "}
          {getName({
            name: order.customer.name,
            surname: order.customer.surname,
          })}
        </div>
        <div>
          <OrderItems items={order.items} />
        </div>
      </div>
      <div className="listitemDescription">{showDate(order.createdAt)}</div>
    </div>
  );
};

const OrderItems = ({ items }) => {
  return (
    <div>
      <div>Stavke:</div>
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
