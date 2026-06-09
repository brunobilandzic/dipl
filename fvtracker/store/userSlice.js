import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  session: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      state.session = action.payload;
    },

    logOut: () => ({ ...initialState }),
  },
});

export const { login, logOut } = userSlice.actions;
export default userSlice.reducer;
