import managerSectors from "@/lib/constants/users/managerSectors";
import { useSelector } from "react-redux";

export const WorkersReport = ({ managerModelName }) => {
  const workers = useSelector((state) => state.workers.items);
  if (!workers || workers.length === 0) return null;
  const sectorName = managerSectors[managerModelName] || "Sektor";
};
