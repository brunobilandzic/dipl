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
  worker: null,
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
    plantPayWorker: (state, action) => {
      const { workerId, plantageWork } = action.payload;
      if (state.worker && state.worker._id === workerId) {
        state.worker.plantageWorks.push(plantageWork);
      } else {
        state.items = state.items.map((worker) => {
          if (worker._id === workerId) {
            return {
              ...worker,
              plantageWorks: [...worker.plantageWorks, plantageWork],
            };
          }
          return worker;
        });
      }
    },
    harvestPayWorker: (state, action) => {
      const { workerId, harvestWork } = action.payload;
      if (state.worker && state.worker._id === workerId) {
        state.worker.harvestWorks.push(harvestWork);
      } else {
        state.items = state.items.map((worker) => {
          if (worker._id === workerId) {
            return {
              ...worker,
              harvestWorks: [...worker.harvestWorks, harvestWork],
            };
          }
          return worker;
        });
      }
    },
    productionPayWorker: (state, action) => {
      const { workerId, productionProcess, warehouseAcceptanceProcess } =
        action.payload;

      if (productionProcess) {
        if (state.worker && state.worker._id === workerId) {
          state.worker.productionProcesses.push(productionProcess);
        } else {
          state.items = state.items.map((worker) => {
            if (worker._id === workerId) {
              return {
                ...worker,
                productionProcesses: [
                  ...worker.productionProcesses,
                  productionProcess,
                ],
              };
            }
            return worker;
          });
        }
      } else if (warehouseAcceptanceProcess) {
        if (state.worker && state.worker._id === workerId) {
          state.worker.warehouseAcceptanceProcesses.push(
            warehouseAcceptanceProcess,
          );
        } else {
          state.items = state.items.map((worker) => {
            if (worker._id === workerId) {
              return {
                ...worker,
                warehouseAcceptanceProcesses: [
                  ...worker.warehouseAcceptanceProcesses,
                  warehouseAcceptanceProcess,
                ],
              };
            }
            return worker;
          });
        }
      }
    },
    warehousePayWorker: (state, action) => {
      const { workerId, shipmentItem } = action.payload;
      if (state.worker && state.worker._id === workerId) {
        console.log(
          "Adding shipmentItem to state.worker.shipmentItems:",
          shipmentItem,
        );
        state.worker.shipmentItems.push(shipmentItem);
      } else {
        state.items = state.items.map((worker) => {
          if (worker._id === workerId) {
            return {
              ...worker,
              shipmentItems: [...worker.shipmentItems, shipmentItem],
            };
          }
          return worker;
        });
      }
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
      })
      .addCase(fetchWorkerById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWorkerById.fulfilled, (state, action) => {
        state.worker = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchWorkerById.rejected, (state, action) => {
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

export const fetchWorkerById = createAsyncThunk(
  "workers/fetchWorkerById",
  async (workerId, { dispatch }) => {
    console.log("Fetching worker by ID:", workerId);
    const response = await api.get(`/worker`, {
      params: {
        workerId,
      },
    });
    console.log("fetchWorkerById response:", response.data.worker);
    return response.data.worker;
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
  plantPayWorker,
  productionPayWorker,
  harvestPayWorker,
  updateEmploymentRequest,
  warehousePayWorker,
} = workersSlice.actions;

export default workersSlice.reducer;
