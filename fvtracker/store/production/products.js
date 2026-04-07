import { filterItems } from "@/lib/utils/list";
import { productsWithCropVarieties } from "@/lib/utils/production/products";
import { stringContains } from "@/lib/utils/strings";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: null,
  filteredItems: null,
  managers: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
      state.filteredItems = action.payload;
    },
    /*  addProduct: (state, action) => {
      state.items.push(action.payload);
    },
    removeProduct: (state, action) => {
      state.items = state.items.filter(
        (product) => product.id !== action.payload,
      );
    },
    updateProduct: (state, action) => {
      state.items = state.items.map((product) =>
        product.id === action.payload.id ? action.payload : product,
      );
    }, */
    setManagers: (state, action) => {
      state.managers = action.payload;
    },
    sortProducts: (state, action) => {
      state.filteredItems = sortItems({
        _items: state.items,
        sortBy: action.payload,
      });
    },
    filterProducts: (state, action) => {
      state.filteredItems = filterItems({
        _items: state.items,
        itemModelName: "Product",
        filters: action.payload,
      });
    },
  },
});

export const {
  setProducts /* 
  addProduct,
  removeProduct,
  updateProduct, */,
  setManagers,
  sortProducts,
  filterProducts,
} = productsSlice.actions;
export default productsSlice.reducer;

const cropVarietySearch = { _items };
