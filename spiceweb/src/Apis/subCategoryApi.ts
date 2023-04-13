import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

const subCategoryApi = createApi({
	reducerPath: "subCategoryApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://localhost:7165/api",
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
