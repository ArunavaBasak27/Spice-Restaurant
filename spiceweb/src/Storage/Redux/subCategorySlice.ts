import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	subCategory: [],
};

export const subCategorySlice = createSlice({
	name: "SubCategory",
	initialState: initialState,
	reducers: {
		setSubCategory: (state, action) => {
			state.subCategory = action.payload;
		},
	},
});

export const { setSubCategory } = subCategorySlice.actions;
export const subCategoryReducer = subCategorySlice.reducer;
