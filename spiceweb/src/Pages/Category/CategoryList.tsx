import { useEffect } from "react";
import {
	useDeleteCategoryMutation,
	useGetCategoriesQuery,
} from "../../Apis/categoryApi";
import { categoryModel } from "../../Interfaces";
import { useDispatch } from "react-redux";
import { setCategory } from "../../Storage/Redux/categorySlice";
import { useNavigate } from "react-router-dom";
import { MainLoader } from "../../Components/Pages/Common";
import { toast } from "react-toastify";
import { withAdminAuth } from "../../HOC";

const CategoryList = () => {
	const { data, isLoading } = useGetCategoriesQuery(null);
	const [deleteCategory] = useDeleteCategoryMutation();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleCategoryDelete = (id: number) => {
		toast.promise(
			deleteCategory(id),
			{
				pending: "Processing your request",
				success: "Category deleted successfully 👌",
				error: "Error encountered 🤯",
			},
			{ theme: "dark" }
		);
	};

	useEffect(() => {
		if (!isLoading) {
			dispatch(setCategory(data.result));
		}
	}, [isLoading]);

	if (isLoading) {
		return <MainLoader />;
	}

	return (
		<div className="border backgroundWhite">
			<div className="row">
				<div className="col-6">
					<h2 className="text-info">Category List</h2>
				</div>
				<div className="col-6 text-end">
					<button
						onClick={() => navigate("/createCategory")}
						className="btn btn-info"
					>
						<i className="bi bi-plus"></i> Create Category
					</button>
				</div>
			</div>
			<br />
			<div>
				<table className="table table-striped-border">
					<thead>
						<tr className="table-secondary">
							<th>Name</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{data.result.length > 0 &&
							data.result.map((category: categoryModel, index: number) => {
								return (
									<tr key={index}>
										<td>{category.name}</td>
										<td style={{ width: "150px" }}>
											<div className="btn-group" role="group">
												<button
													className="btn btn-success "
													onClick={() =>
														navigate(`/updateCategory/${category.id}`)
													}
												>
													<i className="bi bi-pencil"></i>
												</button>
												<button
													className="btn btn-danger"
													onClick={() => handleCategoryDelete(category.id)}
												>
													<i className="bi bi-trash-fill"></i>
												</button>
											</div>
										</td>
									</tr>
								);
							})}
						{data.result.length == 0 && <div>No category exists....</div>}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default withAdminAuth(CategoryList);
