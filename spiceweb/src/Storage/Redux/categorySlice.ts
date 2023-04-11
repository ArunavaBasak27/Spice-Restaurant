import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	category: [],
};

export const categorySlice = createSlice({
	name: "Category",
	initialState: initialState,
	reducers: {
		setCategory: (state, action) => {
			state.category = action.payload;
		},
	},
});

export const { setCategory } = categorySlice.actions;
export const categoryReducer = categorySlice.reducer;
