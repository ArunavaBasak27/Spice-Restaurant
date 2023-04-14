import { configureStore } from "@reduxjs/toolkit";
import { categoryReducer } from "./categorySlice";
import { categoryApi, subCategoryApi, menuItemApi } from "../../Apis";
import { subCategoryReducer } from "./subCategorySlice";
import { menuItemReducer } from "./menuItemSlice";

const store = configureStore({
	reducer: {
		categoryStore: categoryReducer,
		subCategoryStore: subCategoryReducer,
		menuItemStore: menuItemReducer,
		[categoryApi.reducerPath]: categoryApi.reducer,
		[subCategoryApi.reducerPath]: subCategoryApi.reducer,
		[menuItemApi.reducerPath]: menuItemApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(categoryApi.middleware)
			.concat(subCategoryApi.middleware)
			.concat(menuItemApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
