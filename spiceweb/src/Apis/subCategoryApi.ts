import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import SD from "../Utility/SD";

const subCategoryApi = createApi({
	reducerPath: "subCategoryApi",
	baseQuery: fetchBaseQuery({
		baseUrl: SD.baseUrl,
		prepareHeaders(headers: Headers, api) {
			const token = localStorage.getItem(SD.token);
			token && headers.append("Authorization", "Bearer " + token);
		},
	}),
	tagTypes: ["SubCategory"],
	endpoints: (builder) => ({
		getSubCategories: builder.query({
			query: () => ({
				url: "subCategory",
			}),
			providesTags: ["SubCategory"],
		}),
		getSubCategory: builder.query({
			query: (id) => ({
				url: "subCategory/" + id,
			}),
			providesTags: ["SubCategory"],
		}),
		createSubCategory: builder.mutation({
			query: (data) => ({
				url: "subCategory",
				method: "POST",
				body: data,
			}),
			invalidatesTags: ["SubCategory"],
		}),
		updateSubCategory: builder.mutation({
			query: ({ data, id }) => ({
				url: "subCategory/" + id,
				method: "PUT",
				body: data,
			}),
			invalidatesTags: ["SubCategory"],
		}),
		deleteSubCategory: builder.mutation({
			query: (id) => ({
				url: `subCategory/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["SubCategory"],
		}),
	}),
});

export const {
	useGetSubCategoriesQuery,
	useGetSubCategoryQuery,
	useCreateSubCategoryMutation,
	useUpdateSubCategoryMutation,
	useDeleteSubCategoryMutation,
} = subCategoryApi;
export default subCategoryApi;
