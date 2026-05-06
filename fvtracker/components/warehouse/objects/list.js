import { useDispatch } from "react-redux";

export const WarehouseList = () => {
  const warehouses = useSelector((state) => state.warehouses.list);
  const dispatch = useDispatch();

  return (
    <>
      <div>skladista</div>
    </>
  );
};
