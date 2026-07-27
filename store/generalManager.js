import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  manager: null,
  specificManagers: null,
};

export const generalManagerSlice = createSlice({
  name: "generalManager",
  initialState: initialState,
  reducers: {
    setGeneralManager: (state, action) => {
      state.manager = action.payload;
    },
    requestResponseUpdate: (state, action) => {
      const { roleRequestId, newStatus } = action.payload;
      if (state.manager) {
        const request = state.manager.roleRequests.find(
          (req) => req._id === roleRequestId,
        );

        if (request) {
          request.status = newStatus;
        }
      }
      if (state.manager.managers) {
        state.manager.managers.forEach((manager) => {
          if (
            manager.roleRequest &&
            manager.roleRequest._id === roleRequestId
          ) {
            manager.roleRequest.status = newStatus;
          }
        });
      }
    },
    setSpecificManagers: (state, action) => {
      state.specificManagers = action.payload;
    },
  },
});

export const { setGeneralManager, setSpecificManagers, requestResponseUpdate } =
  generalManagerSlice.actions;
export default generalManagerSlice.reducer;
