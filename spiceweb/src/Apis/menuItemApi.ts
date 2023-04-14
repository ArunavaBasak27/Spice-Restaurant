import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import SD from "../Utility/SD";

const menuItemApi = createApi({
	reducerPath: "menuItemApi",
	baseQuery: fetchBaseQuery({
		baseUrl: SD.baseUrl,
	}),
	tagTypes: ["MenuItem"],

	endpoints: (builder) => ({
		getMenuItems: builder.query({
			query: () => ({
				url: "MenuItem",
			}),
			providesTags: ["MenuItem"],
		}),
		getMenuItemById: builder.query({
			query: (id) => ({
				url: "MenuItem/" + id,
			}),
			providesTags: ["MenuItem"],
		}),
		createMenuItem: builder.mutation({
			query: (data) => ({
				url: "MenuItem",
				method: "POST",
				body: data,
			}),
			invalidatesTags: ["MenuItem"],
		}),
		updateMenuItem: builder.mutation({
			query: ({ data, id }) => ({
				url: "MenuItem/" + id,
				method: "PUT",
				body: data,
			}),
			invalidatesTags: ["MenuItem"],
		}),
		deleteMenuItem: builder.mutation({
			query: (id) => ({
				url: "MenuItem/" + id,
				method: "DELETE",
			}),
			invalidatesTags: ["MenuItem"],
		}),
	}),
});

export const {
	useGetMenuItemsQuery,
	useGetMenuItemByIdQuery,
	useCreateMenuItemMutation,
	useUpdateMenuItemMutation,
	useDeleteMenuItemMutation,
} = menuItemApi;
export default menuItemApi;
