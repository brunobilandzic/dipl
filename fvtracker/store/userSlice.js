import { createSlice } from "@reduxjs/toolkit";

const initialState = {
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    logIn: (state, action) => {
    },

    logOut: (state) => {
    },
  },
});

export const { logIn, logOut } = userSlice.actions;
export default userSlice.reducer;
