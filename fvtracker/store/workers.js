import api from "@/lib/api";
import { filterItems, sortItems } from "@/lib/utils/list";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  filteredItems: [],
  isLoading: false,
  employmentRequests: {
    items: [],
    filteredItems: [],
  },
};

const workersSlice = createSlice({
  name: "workers",
  initialState,
  reducers: {
    addWorker: (state, action) => {
      state.items.push(action.payload);
      state.filteredItems.push(action.payload);
    },
    updateWorker: (state, action) => {
      const index = state.items.findIndex((w) => w._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      const filteredIndex = state.filteredItems.findIndex(
        (w) => w._id === action.payload._id,
      );
      if (filteredIndex !== -1) {
        state.filteredItems[filteredIndex] = action.payload;
      }
    },
    setWorkers: (state, action) => {
      state.items = action.payload;
    },
    sortWorkers: (state, action) => {
      state.filteredItems = sortItems({
        items: state.filteredItems,
        sortBy: action.payload,
      });
    },
    filterWorkers: (state, action) => {
      const { sortBy, filters } = action.payload;
      state.filteredItems = filterItems({
        _items: state.items,
        filters: filters,
      });
      state.filteredItems = sortItems({
        items: state.filteredItems,
        sortBy,
      });
    },
    filterEmploymentRequests: (state, action) => {
      const { sortBy, filters } = action.payload;
      state.employmentRequests.filteredItems = filterItems({
        _items: state.employmentRequests.items,
        filters: filters,
      });
      state.employmentRequests.filteredItems = sortItems({
        items: state.employmentRequests.filteredItems,
        sortBy,
      });
    },
    updateEmploymentRequest: (state, action) => {
      const { requestId, status } = action.payload;
      const index = state.employmentRequests.items.findIndex(
        (r) => r._id === requestId,
      );
      if (index !== -1) {
        state.employmentRequests.items[index].status = status;
      }
      const filteredIndex = state.employmentRequests.filteredItems.findIndex(
        (r) => r._id === requestId,
      );
      if (filteredIndex !== -1) {
        state.employmentRequests.filteredItems[filteredIndex].status = status;
      }
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
      })
      .addCase(fetchEmploymentRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchEmploymentRequests.fulfilled, (state, action) => {
        state.employmentRequests.items = action.payload;
        state.employmentRequests.filteredItems = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchEmploymentRequests.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

// thunks

export const fetchWorkers = createAsyncThunk(
  "workers/fetchWorkers",
  async (managerModelName, { dispatch }) => {
    const response = await api.get(`/workers`, {
      params: {
        managerModelName,
      },
    });
    return response.data.workers;
  },
);

export const fetchEmploymentRequests = createAsyncThunk(
  "workers/fetchEmploymentRequests",
  async (_, { dispatch }) => {
    const response = await api.get(`/employment-requests`);
    return response.data.requests;
  },
);

export const {
  addWorker,
  setWorkers,
  sortWorkers,
  filterWorkers,
  setLoading,
  setError,
  updateWorker,
  filterEmploymentRequests,
  updateEmploymentRequest,
} = workersSlice.actions;

export default workersSlice.reducer;
