import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { inputHelper, toastNotify } from "../../Helper";
import {
	useCreateCategoryMutation,
	useGetCategoryByIdQuery,
	useUpdateCategoryMutation,
} from "../../Apis/categoryApi";
import { apiResponse } from "../../Interfaces";

const categoryData = {
	name: "",
};

const CategoryUpsert = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [categoryInput, setCategoryInput] = useState(categoryData);
	const [loading, setLoading] = useState(false);
	const [createCategory] = useCreateCategoryMutation();
	const [updateCategory] = useUpdateCategoryMutation();

	const { data } = useGetCategoryByIdQuery(id!, {
		skip: id == null || id == undefined,
	});

	useEffect(() => {
		if (data && data.result) {
			const tempData = {
				name: data.result.name,
			};
			setCategoryInput(tempData);
		}
	}, [data]);

	const handleCategoryInput = (e: ChangeEvent<HTMLInputElement>) => {
		const tempData = inputHelper(e, categoryInput);
		setCategoryInput(tempData);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		let response: apiResponse;
		const tempCategory = {
			name: categoryInput.name,
		};

		if (id) {
			response = await updateCategory({
				data: { ...tempCategory, id: id },
				id,
			});
		} else {
			response = await createCategory(tempCategory);
		}

		if (response.data?.isSuccess) {
			setLoading(false);
			console.log(response);
			toastNotify(
				`Category ${id ? "updated" : "created"} successfully`,
				"success"
			);
			navigate("/categoryList");
		} else {
			toastNotify(response.data?.errorMessages[0], "error");
		}

		setLoading(false);
	};

	return (
		<div>
			<div className="row">
				<h2 className="text-info">{id ? "Update" : "Create"} Category</h2>
			</div>
			<div className="border backgroundWhite mt-2">
				<form method="post" onSubmit={handleSubmit}>
					<div className="form-group row">
						<div className="col-2">Name:</div>
						<div className="col-5">
							<input
								type="text"
								name="name"
								placeholder="Enter category"
								value={categoryInput.name}
								className="form-control"
								onChange={handleCategoryInput}
							/>
						</div>
					</div>
					<div className="form-group row mt-2">
						<div className="col-5 offset-2">
							<div className="row">
								<div className="col-6">
									<button type="submit" className="btn btn-info form-control">
										{id ? "Update" : "Create"}
									</button>
								</div>
								<div className="col-6">
									<a
										className="btn btn-success form-control"
										onClick={() => navigate("/categoryList")}
									>
										Back to List
									</a>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CategoryUpsert;
