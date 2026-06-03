import {
  PROCURMENT_APPROVED,
  PROCURMENT_REJECTED,
} from "../constants/documents/procurments";
import { getName } from "./display";
import { productsWithCropVarieties } from "./production/products";
import { stringContains } from "./strings";

export const initFilters = (listType) => {
  switch (listType) {
    case "fields":
      return [
        {
          type: "nameSearch",
          placeholder: "Pretraži polja...",
          value: "",
        } /* 
        {
          type: "cropVarietySearch",
          placeholder: "Filtriraj po sorti...",
          value: "",
        }, 
        // careas, cultivations, sizes.....
        */,
      ];
    case "products":
      return [
        {
          type: "nameSearch",
          placeholder: "Pretraži proizvode...",
          value: "",
        },
        {
          type: "cropVarietySearch",
          placeholder: "Pretraži po sorti...",
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
          type: "workerNameSearch",
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
    default:
      return items;
  }
};

export const filterItems = ({ _items, itemModelName, filters }) => {
  let items = [..._items];

  for (const filter of filters) {
    switch (filter.type) {
      case "nameSearch":
        items = nameSearch({ items, value: filter.value });
        break;
      case "workerNameSearch":
        items = appUserNameSearch({ items, value: filter.value });
        break;
      case "cropVarietySearch":
        if (filter.value === "") break;
        items = cropVarietySearch({
          itemModelName,
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
