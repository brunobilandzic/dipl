import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  filteredItems: [],
};

const procurmentsSlice = createSlice({
  name: "procurments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export const fetchProcurments = createAsyncThunk(
  "procurments/fetchProcurments",
  async (_, { dispatch }) => {
    const res = await api.get("/procurments");
    return res.data;
  },
);

export const {} = procurmentsSlice.actions;
