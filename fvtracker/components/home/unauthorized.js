import { useSelector } from "react-redux";

export const UnauthorizedHomePage = () => {
  const managerModelName = useSelector((state) => state.auth.managerModelName);
  return <div>Homepage</div>;
};
