import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import SD from "../Utility/SD";

const shoppingCartApi = createApi({
	reducerPath: "shoppingCartApi",
	baseQuery: fetchBaseQuery({
		baseUrl: SD.baseUrl,
	}),
	tagTypes: ["ShoppingCart"],
	endpoints: (builder) => ({
		getShoppingCart: builder.query({
			query: (userId) => ({
				url: "ShoppingCart/" + userId,
				params: {
					userId: userId,
				},
			}),
			providesTags: ["ShoppingCart"],
		}),
		updateShoppingCart: builder.mutation({
			query: ({ userId, menuItemId, updateQuantityBy }) => ({
				url: "ShoppingCart",
				method: "POST",
				params: {
					userId: userId,
					menuItemId: menuItemId,
					updateQuantityBy: updateQuantityBy,
				},
			}),
			invalidatesTags: ["ShoppingCart"],
		}),
	}),
});

export const { useGetShoppingCartQuery, useUpdateShoppingCartMutation } =
	shoppingCartApi;
export default shoppingCartApi;
