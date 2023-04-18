import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import SD from "../Utility/SD";

const userApi = createApi({
	reducerPath: "userApi",
	baseQuery: fetchBaseQuery({
		baseUrl: SD.baseUrl,
		prepareHeaders(headers: Headers, api) {
			const token = localStorage.getItem(SD.token);
			token && headers.append("Authorization", "Bearer " + token);
		},
	}),
	endpoints: (builder) => ({
		registerUser: builder.mutation({
			query: (userData) => ({
				url: "user/register",
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: userData,
			}),
		}),
		loginUser: builder.mutation({
			query: (userData) => ({
				url: "user/login",
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: userData,
			}),
		}),
	}),
});
export const { useLoginUserMutation, useRegisterUserMutation } = userApi;
export default userApi;
