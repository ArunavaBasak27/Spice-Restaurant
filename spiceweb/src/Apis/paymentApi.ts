import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import SD from "../Utility/SD";

const paymentApi = createApi({
	reducerPath: "paymentApi",
	baseQuery: fetchBaseQuery({
		baseUrl: SD.baseUrl,
	}),
	endpoints: (builder) => ({
		initiatePayment: builder.mutation({
			query: (userId) => ({
				url: "Payment",
				method: "POST",
				params: {
					userId: userId,
				},
			}),
		}),
		refundPayment: builder.mutation({
			query: (id) => ({
				url: "Payment/" + id,
				method: "POST",
				params: {
					id: id,
				},
			}),
		}),
	}),
});

export const { useInitiatePaymentMutation, useRefundPaymentMutation } =
	paymentApi;
export default paymentApi;
