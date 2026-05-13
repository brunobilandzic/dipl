import { fetchWarehouseRequests } from "@/store/sales";

export const fillWarehouseRequestsRedux = ({ dispatch }) => {
  dispatch(fetchWarehouseRequests());
};
