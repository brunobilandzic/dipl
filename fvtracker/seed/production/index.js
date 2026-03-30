const { createProducts } = require("./createProducts");

export default {
  seedProduction: async () => {
    await createProducts();
  },
};
