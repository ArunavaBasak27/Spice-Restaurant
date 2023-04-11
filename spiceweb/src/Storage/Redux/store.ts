import { configureStore } from "@reduxjs/toolkit";
import { categoryReducer } from "./categorySlice";
import { categoryApi } from "../../Apis";

const store = configureStore({
	reducer: {
		categoryStore: categoryReducer,
		[categoryApi.reducerPath]: categoryApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(categoryApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
