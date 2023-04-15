import { configureStore } from "@reduxjs/toolkit";
import { categoryReducer } from "./categorySlice";
import {
	categoryApi,
	subCategoryApi,
	menuItemApi,
	couponApi,
} from "../../Apis";
import { subCategoryReducer } from "./subCategorySlice";
import { menuItemReducer } from "./menuItemSlice";
import { couponReducer } from "./couponSlice";

const store = configureStore({
	reducer: {
		categoryStore: categoryReducer,
		subCategoryStore: subCategoryReducer,
		menuItemStore: menuItemReducer,
		couponStore: couponReducer,
		[categoryApi.reducerPath]: categoryApi.reducer,
		[subCategoryApi.reducerPath]: subCategoryApi.reducer,
		[menuItemApi.reducerPath]: menuItemApi.reducer,
		[couponApi.reducerPath]: couponApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(categoryApi.middleware)
			.concat(subCategoryApi.middleware)
			.concat(menuItemApi.middleware)
			.concat(couponApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
