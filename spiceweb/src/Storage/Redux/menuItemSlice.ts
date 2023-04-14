import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	menuItems: [],
};
const menuItemSlice = createSlice({
	name: "menuItemSlice",
	initialState: initialState,
	reducers: {
		setMenuItem: (state, action) => {
			state.menuItems = action.payload;
		},
	},
});
export const { setMenuItem } = menuItemSlice.actions;
export const menuItemReducer = menuItemSlice.reducer;
