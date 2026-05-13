const initialState = {
  warehouseRequests: null,
  isLoading: false,
};

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWarehouseRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWarehouseRequests.fulfilled, (state, action) => {
        state.warehouseRequests = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchWarehouseRequests.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const fetchWarehouseRequests = createAsyncThunk(
  "sales/fetchWarehouseRequests",
  async ({ dispatch, router }) => {
    console.log("Fetching warehouse requests...");
    const res = await api.get("/warehouse-requests");
    return res.data;
  },
);

export const {} = salesSlice.actions;
export default salesSlice.reducer;
