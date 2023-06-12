import { configureStore } from "@reduxjs/toolkit";
import { categoryReducer } from "./categorySlice";
import {
	categoryApi,
	subCategoryApi,
	menuItemApi,
	couponApi,
	userApi,
	shoppingCartApi,
	paymentApi,
	orderApi,
} from "../../Apis";
import { subCategoryReducer } from "./subCategorySlice";
import { menuItemReducer } from "./menuItemSlice";
import { couponReducer } from "./couponSlice";
import { userReducer } from "./userSlice";
import { shoppingCartReducer } from "./shoppingCartSlice";
import { orderReducer } from "./orderSlice";

const store = configureStore({
	reducer: {
		categoryStore: categoryReducer,
		subCategoryStore: subCategoryReducer,
		menuItemStore: menuItemReducer,
		couponStore: couponReducer,
		userStore: userReducer,
		shoppingCartStore: shoppingCartReducer,
		orderStore: orderReducer,
		[categoryApi.reducerPath]: categoryApi.reducer,
		[subCategoryApi.reducerPath]: subCategoryApi.reducer,
		[menuItemApi.reducerPath]: menuItemApi.reducer,
		[couponApi.reducerPath]: couponApi.reducer,
		[userApi.reducerPath]: userApi.reducer,
		[shoppingCartApi.reducerPath]: shoppingCartApi.reducer,
		[paymentApi.reducerPath]: paymentApi.reducer,
		[orderApi.reducerPath]: orderApi.reducer,
	},
	devTools: false,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(categoryApi.middleware)
			.concat(subCategoryApi.middleware)
			.concat(menuItemApi.middleware)
			.concat(couponApi.middleware)
			.concat(userApi.middleware)
			.concat(shoppingCartApi.middleware)
			.concat(paymentApi.middleware)
			.concat(orderApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
