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
    logOut: (state) => {
      state = initialState;
    },
  },
});

export const { logIn, logOut } = userSlice.actions;
export default userSlice.reducer;
