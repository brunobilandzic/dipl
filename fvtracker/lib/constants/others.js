export const initFilters = (listType) => {
  switch (listType) {
    case "fields":
      return [
        {
          type: "nameSearch",
          placeholder: "Pretraži proizvode...",
          value: "",
        },
        {
          type: "cropVarietySearch",
          placeholder: "Filtriraj po sorti...",
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
        {
          type: "cropVarietySearch",
          placeholder: "Filtriraj po sorti...",
          value: "",
        },
      ];
  }
};
