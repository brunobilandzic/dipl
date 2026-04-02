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

export function checkEmpty(obj, dontAlert = false) {
  for (const key in obj) {
    if (obj[key] === "" || obj[key] === null || obj[key] === undefined) {
      if (!dontAlert) {
        alert(`Field ${key} is empty, value: ${obj[key]}`);
      }

      return true;
    }
  }
  return false;
}

export const idToNames = ({ parentId, parentName, list }) => {
  const item = list.find((item) => item[parentName] === parentId);
  return item ? item.name : null;
};

export const stringifyObjectValues = (obj) => {
  return Object.entries(obj).map(([key, value]) => (
    <div key={key}>
      {key}: {JSON.stringify(value, null, 2)}
    </div>
  ));
};

export const sanitize = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};
