import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      state.session = action.payload;
    },

    logOut: (state) => {},
  },
});

export const { login, logOut } = userSlice.actions;
export default userSlice.reducer;
