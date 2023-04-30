import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	orderList: [],
};

export const orderSlice = createSlice({
	name: "order",
	initialState: initialState,
	reducers: {
		setOrderList: (state, action) => {
			state.orderList = action.payload;
		},
	},
});

export const { setOrderList } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
