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
				url: "ShoppingCart/",
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

		addCouponToShoppingCart: builder.mutation({
			query: ({ userId, coupon }) => ({
				url: "ShoppingCart",
				method: "PUT",
				params: {
					userId: userId,
					coupon: coupon,
				},
			}),
			invalidatesTags: ["ShoppingCart"],
		}),
	}),
});

export const {
	useGetShoppingCartQuery,
	useUpdateShoppingCartMutation,
	useAddCouponToShoppingCartMutation,
} = shoppingCartApi;
export default shoppingCartApi;
