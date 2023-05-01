import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import SD from "../Utility/SD";

const orderApi = createApi({
	reducerPath: "orderApi",
	baseQuery: fetchBaseQuery({
		baseUrl: SD.baseUrl,
		prepareHeaders(headers: Headers, api) {
			const token = localStorage.getItem(SD.token);
			token && headers.append("Authorization", "Bearer " + token);
		},
	}),
	tagTypes: ["orderApi"],
	endpoints: (builder) => ({
		getAllOrders: builder.query({
			query: () => ({
				url: "order",
			}),
			providesTags: ["orderApi"],
		}),
		createOrder: builder.mutation({
			query: (orderDetails) => ({
				url: "order",
				method: "POST",
				body: orderDetails,
			}),
			invalidatesTags: ["orderApi"],
		}),
		updateOrder: builder.mutation({
			query: (orderHeader) => ({
				url: "order/" + orderHeader.id,
				method: "PUT",
				body: orderHeader,
			}),
			invalidatesTags: ["orderApi"],
		}),
	}),
});
export const {
	useGetAllOrdersQuery,
	useCreateOrderMutation,
	useUpdateOrderMutation,
} = orderApi;
export default orderApi;
