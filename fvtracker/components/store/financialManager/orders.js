"use client";
import { List, ListItem } from "@/components/layout/preview/list";
import { getName, showDate } from "@/lib/utils/display";
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
  console.log({ order });
  return (
    <ListItem>
      <OrderItem order={order} />
    </ListItem>
  );
};

const OrderItem = ({ order }) => {
  return (
    <div>
      <div className="listitemheader">Narudžba #{order.number} </div>
      <div>
        Kupac:{" "}
        {getName({
          name: order.customer.name,
          surname: order.customer.surname,
        })}
      </div>
      <div>{showDate(order.createdAt)}</div>
    </div>
  );
};
