import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import SD from "../Utility/SD";

const orderApi = createApi({
	reducerPath: "orderApi",
	baseQuery: fetchBaseQuery({
		baseUrl: SD.baseUrl,
	}),
	endpoints: (builder) => ({
		createOrder: builder.mutation({
			query: (orderDetails) => ({
				url: "order",
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: orderDetails,
			}),
		}),
	}),
});
export const { useCreateOrderMutation } = orderApi;
export default orderApi;
