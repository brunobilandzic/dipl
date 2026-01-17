import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    logIn: (state, action) => {
      state.userInfo = action.payload;
    },
    logOut: (state) => {
      state = initialState;
    },
  },
});

export const { logIn, logOut } = userSlice.actions;
export default userSlice.reducer;