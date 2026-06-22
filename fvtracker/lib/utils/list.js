import { FINANCIAL_MANAGER } from "../constants/users/managerTypes";
import { getName } from "./display";
import { procurmentValue } from "./documents/procurments";
import { productsWithCropVarieties } from "./production/products";
import { orderAmount } from "./sales";
import { stringContains } from "./strings";

export const initFilters = (listType, allWorkers = false) => {
  switch (listType) {
    case "fields":
      return [
        {
          type: "nameSearch",
          placeholder: "Pretraži polja...",
          value: "",
        },
      ];
    case "products":
      return [
        {
          type: "nameSearch",
          placeholder: "Pretraži proizvode...",
          value: "",
        },
      ];
    case "facilities":
      return [
        {
          type: "nameSearch",
          placeholder: "Pretraži postrojenja...",
          value: "",
        },
      ];
    case "warehouses":
      return [
        {
          type: "nameSearch",
          placeholder: "Pretraži skladišta...",
          value: "",
        },
      ];
    case "warehouseRequests":
      return [
        {
          type: "nameSearch",
          placeholder: "Pretraži zahtjeve...",
          value: "",
        },
      ];
    case "orders":
      return [
        {
          type: "customerSearch",
          placeholder: "Ime kupca...",
          value: "",
        },
      ];
    case "workers":
      return [
        {
          type: "employmentStatus",
          placeholder: "Status zaposlenja",
          value: "all",
        },
        {
          type: "workerNameSearch",
          placeholder: "Pretraži radnike...",
          value: "",
        },
        ...(allWorkers
          ? [
              {
                type: "workerType",
                placeholder: "Sektor radnika",
                value: FINANCIAL_MANAGER,
              },
            ]
          : []),
      ];
    case "employmentRequests":
      return [
        {
          type: "employmentStatus",
          placeholder: "Status zaposlenja",
          value: "all",
        },
        {
          type: "emplReqWorkerNameSearch",
          placeholder: "Pretraži radnike...",
          value: "",
        },
      ];
    case "procurments":
      return [
        {
          type: "procurmentStatus",
          placeholder: "Status nabave",
          value: "all",
        },
      ];
    case "roleRequest":
      return [
        {
          type: "roleRequest",
          placeholder: "Status zahtjeva",
          value: "all",
        },
      ];
    case "cropTypes":
      return [
        {
          type: "nameSearch",
          placeholder: "Pretraži kulture...",
          value: "",
        },
        {
          type: "mainType",
          placeholder: "Glavna vrsta",
          value: "all",
        },
        {
          type: "generalType",
          placeholder: "Opća vrsta",
          value: "all",
        },
        {
          type: "cropType",
          placeholder: "Vrsta kulture",
          value: "all",
        },
      ];
  }
};

export const sortItems = ({ items, sortBy }) => {
  switch (sortBy) {
    case "newest":
      return [...items].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    case "oldest":
      return [...items].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );
    case "priceAsc":
      return [...items].sort((a, b) => a.price - b.price);
    case "priceDesc":
      return [...items].sort((a, b) => b.price - a.price);
    case "fieldNameAsc":
      return [...items].sort((a, b) => a.name.localeCompare(b.name));
    case "fieldNameDesc":
      return [...items].sort((a, b) => b.name.localeCompare(a.name));
    case "hourlyRateAsc":
      return [...items].sort((a, b) => a.hourlyRate - b.hourlyRate);
    case "hourlyRateDesc":
      return [...items].sort((a, b) => b.hourlyRate - a.hourlyRate);
    case "payedAsc":
      return [...items].sort((a, b) => a.payedAmount - b.payedAmount);
    case "payedDesc":
      return [...items].sort((a, b) => b.payedAmount - a.payedAmount);
    case "orderPriceAsc":
      return [...items].sort((a, b) => orderAmount(a) - orderAmount(b));
    case "orderPriceDesc":
      return [...items].sort((a, b) => orderAmount(b) - orderAmount(a));
    case "procValAsc":
      return [...items].sort((a, b) => procurmentValue(a) - procurmentValue(b));
    case "procValDesc":
      return [...items].sort((a, b) => procurmentValue(b) - procurmentValue(a));
    default:
      return items;
  }
};

export const filterItems = ({ _items, filters }) => {
  let items = [..._items];
  for (const filter of filters) {
    switch (filter.type) {
      case "nameSearch":
        items = nameSearch({ items, value: filter.value });
        break;
      case "workerNameSearch":
        items = appUserNameSearch({ items, value: filter.value });
        break;
      case "emplReqWorkerNameSearch":
        items = emplReqWorkerNameSearch({
          items,
          value: filter.value,
        });
        break;
      case "customerSearch":
        items = customerSearch({ items, value: filter.value });
        break;
      case "procurmentStatus":
        if (filter.value === "all") break;
        items = items.filter((item) => item.status == filter.value);
        break;
      case "workerType":
        if (filter.value === "all") break;
        items = items.filter(
          (item) => item.manager.managerModelName === filter.value,
        );
        break;
      case "employmentStatus":
        if (filter.value === "all") break;
        items = items.filter(
          (item) => item.employmentRequest.status === filter.value,
        );
        break;
      case "roleRequest":
        if (filter.value === "all") break;
        if (items.some((item) => item.roleRequest))
          return items.filter(
            (item) => item.roleRequest.status === filter.value,
          );
        items = items.filter((item) => {
          return item.status === filter.value;
        });
        break;
      case "mainType":
        if (filter.value === "all") break;
        items = items.filter((item) => item.mainTypeName === filter.value);
        break;
      case "generalType":
        if (filter.value === "all") break;
        items = items.filter((item) => item.generalTypeName === filter.value);
        break;
      case "cropType":
        if (filter.value === "all") break;
        items = items.filter((item) => item.cropTypeName === filter.value);
        break;
      default:
        break;
    }
  }

  return items;
};

const cropVarietySearch = ({ itemModelName, items, value }) => {
  switch (itemModelName) {
    case "Field":
      return null;
    case "Product":
      return productsWithCropVarieties(items, value);
    default:
      return () => true;
  }
};

const nameSearch = ({ items, value }) => {
  return items.filter((item) => stringContains(item.name, value));
};

const customerSearch = ({ items, value }) => {
  return items.filter((item) =>
    stringContains(
      getName({ name: item.customer.name, surname: item.customer.surname }),
      value,
    ),
  );
};

const appUserNameSearch = ({ items, value }) => {
  return items.filter((item) =>
    stringContains(`${item.appUser.name} ${item.appUser.surname}`, value),
  );
};

const emplReqWorkerNameSearch = ({ items, value }) => {
  return items.filter((item) =>
    stringContains(
      `${item.worker.appUser.name} ${item.worker.appUser.surname}`,
      value,
    ),
  );
};
