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
        alert(`Polje ${key} je prazno: ${obj[key]}`);
      }

      return true;
    }
    if (obj[key] instanceof Array) {
      if (obj[key].length === 0) {
        if (!dontAlert) {
          alert(`Polje ${key} je prazno: ${obj[key]}`);
        }
        return true;
      }
      for (const item of obj[key]) {
        if (checkEmpty(item, dontAlert)) {
          if (!dontAlert) {
            alert(
              `Polje ${key} sadrži prazan element: ${JSON.stringify(item)}`,
            );
          }
          return true;
        }
      }
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

export const randomElementArray = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const arrayRandomSlice = (arr, sliceLength) => {
  if (sliceLength > arr.length) {
    throw new Error("Slice length cannot be greater than array length");
  }
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, sliceLength);
};
