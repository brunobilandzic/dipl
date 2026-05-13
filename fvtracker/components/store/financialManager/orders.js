"use client"
import { List, ListItem } from "@/components/layout/preview/list";

export const OrdersList = () => {
  const orders = useSelector((state) => state.webstore.orders.filteredItems);
  return (
    <List title="Narudžbe">
      {orders?.map((order) => (
        <OrderItem key={order._id} order={order} />
      ))}
    </List>
  );
};

const OrderItem = ({ order }) => {
  console.log({ order });
  return <ListItem>{order.number}</ListItem>;
};
