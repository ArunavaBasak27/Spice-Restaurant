import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import SD from "../Utility/SD";

const categoryApi = createApi({
	reducerPath: "categoryApi",
	baseQuery: fetchBaseQuery({
		baseUrl: SD.baseUrl,
	}),
	tagTypes: ["Categories"],
	endpoints: (builder) => ({
		getCategories: builder.query({
			query: () => ({
				url: "category",
			}),
			providesTags: ["Categories"],
		}),
		getCategoryById: builder.query({
			query: (id) => ({
				url: "category/" + id,
			}),
			providesTags: ["Categories"],
		}),
		createCategory: builder.mutation({
			query: (data) => ({
				url: "category",
				method: "POST",
				body: data,
			}),
			invalidatesTags: ["Categories"],
		}),
		updateCategory: builder.mutation({
			query: ({ data, id }) => ({
				url: "category/" + id,
				method: "PUT",
				body: data,
			}),
			invalidatesTags: ["Categories"],
		}),
		deleteCategory: builder.mutation({
			query: (id) => ({
				url: "category/" + id,
				method: "DELETE",
			}),
			invalidatesTags: ["Categories"],
		}),
	}),
});

export const {
	useGetCategoriesQuery,
	useGetCategoryByIdQuery,
	useCreateCategoryMutation,
	useUpdateCategoryMutation,
	useDeleteCategoryMutation,
} = categoryApi; 
export default categoryApi;
