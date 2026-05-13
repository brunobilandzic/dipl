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
    const res = await api.get("/warehouse-requests");
    return res.data;
  },
);
