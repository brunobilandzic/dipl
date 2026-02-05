import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  appUser: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    logIn: (state, action) => {
      state.appUser = action.payload.appUser;
    },
    setManager: (state, action) => {
      console.log(
        "Setting manager in user slice with payload:",
        action.payload,
      );
      const { rootManager, specificManager } = action.payload;
      state.specificManager = specificManager;
      state.rootManager = rootManager;
      state.managerModelName = rootManager.managerModelName;
    },
    logOut: (state) => {
      state = initialState;
    },
  },
});

export const { logIn, setManager, logOut } = userSlice.actions;
export default userSlice.reducer;
