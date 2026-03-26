import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  manager: null,
  managers: null,
};

export const generalManagerSlice = createSlice({
  name: "generalManager",
  initialState: initialState,
  reducers: {
    setGeneralManager: (state, action) => {
      state.manager = action.payload;
    },
    requestResponseUpdate: (state, action) => {
      const { requestId, newStatus } = action.payload;
      if (state.manager) {
        const request = state.manager.roleRequests.find(
          (req) => req._id === requestId,
        );
        if (request) {
          request.status = newStatus;
        }
      }
    },
    setManagers: (state, action) => {
      state.managers = action.payload;
    },
  },
});

export const { setGeneralManager, setManagers } = generalManagerSlice.actions;
export default generalManagerSlice.reducer;
