import { useSelector } from "react-redux";

const WorkersReport = ({ managerModelName }) => {
  const workers = useSelector((state) => state.workers.items);
  if (!workers || workers.length === 0) return null;
};
