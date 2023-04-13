import { configureStore } from "@reduxjs/toolkit";
import { categoryReducer } from "./categorySlice";
import { categoryApi, subCategoryApi } from "../../Apis";
import { subCategoryReducer } from "./subCategorySlice";

const store = configureStore({
	reducer: {
		categoryStore: categoryReducer,
		subCategoryStore: subCategoryReducer,
		[categoryApi.reducerPath]: categoryApi.reducer,
		[subCategoryApi.reducerPath]: subCategoryApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(categoryApi.middleware)
			.concat(subCategoryApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
