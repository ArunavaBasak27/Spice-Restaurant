import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import SD from "../Utility/SD";

const couponApi = createApi({
	reducerPath: "couponApi",
	baseQuery: fetchBaseQuery({
		baseUrl: SD.baseUrl,
		prepareHeaders(headers: Headers, api) {
			const token = localStorage.getItem(SD.token);
			token && headers.append("Authorization", "Bearer " + token);
		},
	}),
	tagTypes: ["Coupons"],
	endpoints: (builder) => ({
		getCoupons: builder.query({
			query: () => ({
				url: "coupon",
			}),
			providesTags: ["Coupons"],
		}),
		getCouponById: builder.query({
			query: (id) => ({
				url: "coupon/" + id,
			}),
			providesTags: ["Coupons"],
		}),
		createCoupon: builder.mutation({
			query: (data) => ({
				url: "coupon",
				body: data,
				method: "POST",
			}),
			invalidatesTags: ["Coupons"],
		}),
		updateCoupon: builder.mutation({
			query: ({ data, id }) => ({
				url: "Coupon/" + id,
				method: "PUT",
				body: data,
			}),
			invalidatesTags: ["Coupons"],
		}),
		deleteCoupon: builder.mutation({
			query: (id) => ({
				url: "coupon/" + id,
				method: "DELETE",
			}),
			invalidatesTags: ["Coupons"],
		}),
	}),
});
export const {
	useGetCouponsQuery,
	useGetCouponByIdQuery,
	useCreateCouponMutation,
	useUpdateCouponMutation,
	useDeleteCouponMutation,
} = couponApi;
export default couponApi;
