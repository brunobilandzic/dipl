import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  appUser: null,
  manager: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    logIn: (state, action) => {
      state.appUser = action.payload.appUser;
    },
    setManager: (state, action) => {
      state.manager = action.payload.manager;
    },
    logOut: (state) => {
      state = initialState;
    },
  },
});

export const { logIn, setManager, logOut } = userSlice.actions;
export default userSlice.reducer;
