import {
  CULTIVATION_MANAGER,
  FINANCIAL_MANAGER,
  PRODUCTION_MANAGER,
  WAREHOUSE_MANAGER,
} from "@/lib/constants/users/managerTypes";

export const sortManagers = (managers) => {
  const compare = (a, b) => {
    const rolePriority = {
      [CULTIVATION_MANAGER]: 1,
      [PRODUCTION_MANAGER]: 2,
      [WAREHOUSE_MANAGER]: 3,
      [FINANCIAL_MANAGER]: 4,
    };
    return (
      (rolePriority[a.managerModelName] || 999) -
      (rolePriority[b.managerModelName] || 999)
    );
  };
  return managers.sort(compare);
};
