import {
  CULTIVATION_MANAGER,
  FINANCIAL_MANAGER,
  PRODUCTION_MANAGER,
  WAREHOUSE_MANAGER,
} from "@/lib/constants/users/managerTypes";

export async function GET(request) {
  const { searchParams } = new URL(request.url).searchParams;

  const specificManagers = {
    [CULTIVATION_MANAGER]: null,
    [PRODUCTION_MANAGER]: null,
    [FINANCIAL_MANAGER]: null,
    [WAREHOUSE_MANAGER]: null,
  };
}
