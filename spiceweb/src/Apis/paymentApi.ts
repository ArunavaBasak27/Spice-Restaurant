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
	}),
});

export const { useInitiatePaymentMutation } = paymentApi;
export default paymentApi;
