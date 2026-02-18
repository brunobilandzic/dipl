export function extractDBObject(objToExtract) {
  const dbObject = {};

  for (const key in objToExtract) {
    if (Array.isArray(objToExtract[key])) continue;
    if (typeof objToExtract[key] === "object" && objToExtract[key] !== null)
      continue;
    dbObject[key] = objToExtract[key];
  }
  return dbObject;
}

export function checkEmpty(obj) {
  for (const key in obj) {
    if (obj[key] === "" || obj[key] === null || obj[key] === undefined) {
      return true;
    }
  }
  return false;
}
