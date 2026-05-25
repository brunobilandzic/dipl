import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  filteredItems: [],
  isLoading: false,
};

const workersSlice = createSlice({
  name: "workers",
  initialState,
  reducers: {
    setWorkers: (state, action) => {
      state.items = action.payload;
    },
    setFilteredWorkers: (state, action) => {
      state.filteredItems = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWorkers.fulfilled, (state, action) => {
        state.items = action.payload;
        state.filteredItems = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchWorkers.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

// thunks

export const fetchWorkers = createAsyncThunk(
  "workers/fetchWorkers",
  async (managerModelName, { dispatch }) => {
    // Simulate an API call
    console.log("Fetching workers for managerModelName:", managerModelName);
    const response = await api.get(`/workers`, {
      params: {
        managerModelName,
      },
    });
    console.log("Workers fetched:", response.data);
    return response.data;
  },
);

export const { setWorkers, setFilteredWorkers, setLoading, setError } =
  workersSlice.actions;

export default workersSlice.reducer;
