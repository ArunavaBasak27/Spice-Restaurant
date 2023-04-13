import { useNavigate, useParams } from "react-router-dom";
import { useGetCategoriesQuery } from "../../Apis/categoryApi";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCategory } from "../../Storage/Redux/categorySlice";
import { apiResponse, categoryModel } from "../../Interfaces";
import { inputHelper, toastNotify } from "../../Helper";
import { SubCategoryOfCategory } from "../../Components/Pages/SubCategory";
import {
	useCreateSubCategoryMutation,
	useGetSubCategoryQuery,
	useUpdateSubCategoryMutation,
} from "../../Apis/subCategoryApi";
const subCategoryElement = {
	categoryId: 0,
	name: "",
	category: {},
};
const SubCategoryUpsert = () => {
	const { id } = useParams();
	const { data: category, isLoading: isCategoryLoading } =
		useGetCategoriesQuery(null);
	const [dropdown, setDropdown] = useState([]);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [subCategoryInputs, setSubCategoryInputs] =
		useState(subCategoryElement);

	const [isLoading, setIsLoading] = useState(false);

	const { data } = useGetSubCategoryQuery(id, {
		skip: id === undefined,
	});

	const [createSubCategory] = useCreateSubCategoryMutation();
	const [updateSubCategory] = useUpdateSubCategoryMutation();

	useEffect(() => {
		if (data && data.result) {
			setSubCategoryInputs(data.result);
		}
	}, [data]);

	useEffect(() => {
		if (!isCategoryLoading) {
			dispatch(setCategory(category.result));
			setDropdown(category.result);
		}
	}, [isCategoryLoading]);

	const handleSubCategoryInput = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const tempData = inputHelper(e, subCategoryInputs);
		setSubCategoryInputs(tempData);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		let response: apiResponse = {};

		const subCategoryElement = {
			categoryId: subCategoryInputs.categoryId,
			name: subCategoryInputs.name,
		};
		if (id) {
			response = await updateSubCategory({
				data: { ...subCategoryElement, id: id },
				id,
			});
		} else {
			response = await createSubCategory(subCategoryElement);
		}
		if (response.data?.isSuccess) {
			setIsLoading(false);
			toastNotify(
				`Sub Category ${id ? "updated" : "created"} successfully`,
				"success"
			);
			navigate("/subCategoryList");
		} else {
			setIsLoading(false);
			toastNotify(response.data?.errorMessages[0], "error");
		}
	};
	return (
		<div>
			<div className="row">
				<h2 className="text-info">{id ? "Update" : "Create"} Sub Category</h2>
			</div>
			<br />
			<br />
			<div className="border backgroundWhite row">
				<div className="col-8 border-end">
					<form method="post" onSubmit={handleSubmit}>
						<div className="form-group row">
							<div className="col-2">Category:</div>
							<div className="col-5">
								<select
									name="categoryId"
									className="form-select"
									value={subCategoryInputs.categoryId}
									onChange={handleSubCategoryInput}
									disabled={id !== undefined}
								>
									<option disabled value={0}>
										-Select Category-
									</option>
									{dropdown &&
										dropdown.map((category: categoryModel) => {
											return (
												<option key={category.id} value={category.id}>
													{category.name}
												</option>
											);
										})}
								</select>
							</div>
						</div>
						<div className="form-group row mt-2">
							<div className="col-2">Sub Category:</div>
							<div className="col-5">
								<input
									type="text"
									name="name"
									className="form-control"
									onChange={handleSubCategoryInput}
									value={subCategoryInputs.name}
								/>
							</div>
						</div>
						<div className="form-group row mt-2">
							<div className="col-5 offset-2">
								<div className="row">
									<div className="col-6">
										<button
											type="submit"
											className="btn btn-primary form-control"
										>
											{id ? "Update" : "Create"}
										</button>
									</div>
									<div className="col-6">
										<a
											className="btn btn-success form-control"
											onClick={() => navigate("/subCategoryList")}
										>
											Back to List
										</a>
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>
				{subCategoryInputs.category !== 0 && (
					<div className="col-3 offset-1">
						<SubCategoryOfCategory category={subCategoryInputs.categoryId} />
					</div>
				)}
			</div>
		</div>
	);
};

export default SubCategoryUpsert;
