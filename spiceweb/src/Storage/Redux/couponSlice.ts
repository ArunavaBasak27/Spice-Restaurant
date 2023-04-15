import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	coupon: [],
};

export const couponSlice = createSlice({
	name: "couponSlice",
	initialState: initialState,
	reducers: {
		setCoupon: (state, action) => {
			state.coupon = action.payload;
		},
	},
});
export const { setCoupon } = couponSlice.actions;
export const couponReducer = couponSlice.reducer;
