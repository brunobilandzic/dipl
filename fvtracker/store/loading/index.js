import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoading: false,
    error: null,
};

const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            console.log("Setting loading state to", action.payload);
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const { setLoading, setError, clearError } = loadingSlice.actions;
export default loadingSlice.reducer;