import {
  SHIPMENT_PENDING,
  SHIPMENT_SHIPPED_FULLY,
  SHIPMENT_SHIPPED_PARTLY,
} from "../constants/warehouse/shipment";

export function makeUrlFriendly(str) {
  str = str
    .replace(/č/g, "c")
    .replace(/ć/g, "c")
    .replace(/đ/g, "d")
    .replace(/š/g, "s")
    .replace(/ž/g, "z");

  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const alphanumericOnly = (str) => str.replace(/[^a-zA-Z0-9]/g, "");

export const sanitize = (str) => {
  return alphanumericOnly(str.toLowerCase());
};

export const dimensionsString = ({ width, length }) => `${width}x${length}`;

export const testCoordinates = (coordinates) =>
  /^[\d]+,[\d]+$/.test(coordinates);

export const priceEuroString = (price) => `${price}€`;

export const titleCaseLetter = (str) =>
  String(str).charAt(0).toUpperCase() + String(str).slice(1);

export const titleCaseString = (str) =>
  String(str)
    .split(" ")
    .map((word) => titleCaseLetter(word))
    .join(" ");

export const stringContains = (str, search) =>
  String(str).toLowerCase().includes(String(search).toLowerCase());

export const getRandomString = ({ beginning = "", length = 12 } = {}) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = beginning + " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result + " " + new Date().toLocaleString();
};

export const onlyLetters = (str) => {
  return String(str).replace(/[^a-zA-Z]/g, "");
};

export const cropVarietyFullName = (cropVariety) => {
  if (!cropVariety) return "";
  const varietyName = cropVariety.name || "";
  const cropTypeName = cropVariety.cropType?.name || "";
  const generalTypeName = cropVariety.cropType?.generalType?.name || "";
  return `${generalTypeName}: ${cropTypeName} - ${varietyName}`;
};

export const stringQuant = ({ string, quantity, pluralLetter }) => {
  return `${string}${quantity > 1 ? pluralLetter : ""}`;
};

export const translateShipmentStatus = (status) => {
  switch (status) {
    case SHIPMENT_PENDING:
      return "Na čekanju";
    case SHIPMENT_SHIPPED_PARTLY:
      return "Djelomično isporučeno";
    case SHIPMENT_SHIPPED_FULLY:
      return "Isporučeno";
    default:
      return status;
  }
};
