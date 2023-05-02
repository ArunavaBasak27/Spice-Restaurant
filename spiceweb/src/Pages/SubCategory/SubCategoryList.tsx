import { useNavigate } from "react-router-dom";
import {
	useDeleteSubCategoryMutation,
	useGetSubCategoriesQuery,
} from "../../Apis/subCategoryApi";
import { apiResponse, subCategoryModel } from "../../Interfaces";
import { MainLoader } from "../../Components/Pages/Common";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setSubCategory } from "../../Storage/Redux/subCategorySlice";
import { toastNotify } from "../../Helper";
import { withAdminAuth } from "../../HOC";

const SubCategoryList = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { data, isLoading } = useGetSubCategoriesQuery(null);
	const [deleteSubCategory] = useDeleteSubCategoryMutation();

	useEffect(() => {
		if (!isLoading) {
			dispatch(setSubCategory(data.result));
		}
	}, [isLoading]);

	const handleSubCategoryDelete = async (id: number) => {
		const response: apiResponse = await deleteSubCategory(id);
		if (response.data?.isSuccess) {
			toastNotify("Sub Category deleted successfully", "success");
			navigate("/subCategoryList");
		} else {
			toastNotify(response.data?.errorMessages[0], "error");
		}
	};

	if (isLoading) {
		return <MainLoader />;
	}

	return (
		<div className="border backgroundWhite">
			<div className="row">
				<div className="col-6">
					<h2 className="text-info">Sub Category List</h2>
				</div>
				<div className="col-6 text-end">
					<button
						className="btn btn-info"
						onClick={() => navigate("/createSubCategory")}
					>
						<i className="bi bi-plus"></i>Create Sub Category
					</button>
				</div>
			</div>
			<br />
			<div className="table-responsive-sm">
				<table className="table table-striped-border">
					<thead>
						<tr className="table-secondary">
							<th>Name</th>
							<th>Category Name</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{data.result &&
							data.result.map(
								(subCategory: subCategoryModel, index: number) => {
									return (
										<tr key={index}>
											<td>{subCategory.name}</td>
											<td>{subCategory.category.name}</td>
											<td style={{ width: "150px" }}>
												<div className="btn-group" role="group">
													<button
														className="btn btn-success "
														onClick={() =>
															navigate(`/updateSubCategory/${subCategory.id}`)
														}
													>
														<i className="bi bi-pencil"></i>
													</button>
													<button
														className="btn btn-danger"
														onClick={() =>
															handleSubCategoryDelete(subCategory.id)
														}
													>
														<i className="bi bi-trash-fill"></i>
													</button>
												</div>
											</td>
										</tr>
									);
								}
							)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default withAdminAuth(SubCategoryList);
