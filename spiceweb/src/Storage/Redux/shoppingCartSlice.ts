import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	cartItems: [],
};

const shoppingCartSlice = createSlice({
	name: "shoppingCartSlice",
	initialState: initialState,
	reducers: {
		setShoppingCart: (state, action) => {
			state.cartItems = action.payload;
		},
	},
});
export const { setShoppingCart } = shoppingCartSlice.actions;
export const shoppingCartReducer = shoppingCartSlice.reducer;
