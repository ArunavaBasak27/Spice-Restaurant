import { useNavigate, useParams } from "react-router-dom";
import SD from "../../Utility/SD";
import { useGetCategoriesQuery } from "../../Apis/categoryApi";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setCategory } from "../../Storage/Redux/categorySlice";
import { useGetSubCategoriesQuery } from "../../Apis/subCategoryApi";
import { setSubCategory } from "../../Storage/Redux/subCategorySlice";
import { categoryModel, subCategoryModel } from "../../Interfaces";
import { inputHelper } from "../../Helper";
import { useGetMenuItemByIdQuery } from "../../Apis/menuItemApi";
import { Editor } from "@tinymce/tinymce-react";
let default_food = require("../../Images/default_food.png");
const menuItemData = {
	name: "",
	description: "",
	price: 0,
	spicyness: 0,
	image: "",
	categoryId: 0,
	subCategoryId: 0,
};
const MenuItemDetails = () => {
	const { id } = useParams();

	const { data: menuItem, isLoading: isMenuItemLoading } =
		useGetMenuItemByIdQuery(id, { skip: id === undefined });

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { data: categoryData, isLoading: isCategoryLoading } =
		useGetCategoriesQuery(null);
	const { data, isLoading } = useGetSubCategoriesQuery(null);
	const [subCategories, setSubCategories] = useState([]);
	const [categoryDropdown, setCategoryDropdown] = useState([]);

	const [imageToDisplay, setImageToDisplay] = useState(default_food);

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!isCategoryLoading) {
			dispatch(setCategory(categoryData.result));
			setCategoryDropdown(categoryData.result);
		}
	}, [isCategoryLoading]);

	useEffect(() => {
		if (!isLoading) {
			dispatch(setSubCategory(data.result));
			setSubCategories(data.result);
		}
	}, [isLoading]);

	useEffect(() => {
		if (!isMenuItemLoading) {
			if (menuItem && menuItem.result) {
				setMenuItemInputs(menuItem.result);
				setImageToDisplay(menuItem.result.image);
			}
		}
	}, [isMenuItemLoading]);

	const subCategoryDropdown = (categoryId: number) => {
		var subCatDropdown = subCategories.filter(
			(subCategory: subCategoryModel) => {
				if (subCategory.categoryId === categoryId) {
					return subCategory;
				}
			}
		);
		return subCatDropdown;
	};

	const [menuItemInputs, setMenuItemInputs] = useState(menuItemData);
	const handleMenuItemInputs = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
	) => {
		const tempData = inputHelper(e, menuItemInputs);
		setMenuItemInputs(tempData);
	};

	const [, setTextArea] = useState(menuItemData.description);
	const editorRef = useRef<any>("");
	const log = () => {
		if (editorRef.current) {
			setTextArea(editorRef.current?.getContent());
		}
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		setLoading(false);
	};

	return (
		<div>
			<h2 className="text-info">{id ? "Update" : "Create"} Menu Item</h2>
			<br />
			<form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
				<div className="border backgroundWhite row">
					<div className="col-8">
						<div className="form-group row mt-2">
							<div className="col-4">Name</div>
							<div className="col-8">
								<input
									disabled
									type="text"
									name="name"
									className="form-control"
									value={menuItemInputs.name}
									onChange={handleMenuItemInputs}
								/>
							</div>
						</div>

						<div className="form-group row mt-2">
							<div className="col-4">Description</div>
							<div className="col-8">
								<Editor
									disabled
									apiKey="p13w5s0vlrclepzoitrbezndnjepzy2twdglsozg8v67w53m"
									onInit={(evt, editor) => (editorRef.current = editor)}
									init={{
										height: 300,
										menubar: false,
										content_style:
											"body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
									}}
									initialValue={menuItemInputs.description}
									onChange={log}
								/>
							</div>
						</div>

						<div className="form-group row mt-2">
							<div className="col-4">Category</div>
							<div className="col-8">
								<select
									disabled
									name="categoryId"
									className="form-control"
									value={menuItemInputs.categoryId}
									onChange={handleMenuItemInputs}
								>
									<option value={0}>-Select Category-</option>
									{categoryDropdown.map((category: categoryModel) => {
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
							<div className="col-4">Sub Category</div>
							<div className="col-8">
								<select
									disabled
									name="subCategoryId"
									className="form-control"
									value={menuItemInputs.subCategoryId}
									onChange={handleMenuItemInputs}
								>
									<option value={0}>-Select Sub Category-</option>
									{subCategoryDropdown(Number(menuItemInputs.categoryId)).map(
										(subCategory: subCategoryModel, index: number) => {
											return (
												<option key={index} value={subCategory.id}>
													{subCategory.name}
												</option>
											);
										}
									)}
								</select>
							</div>
						</div>

						<div className="form-group row mt-2">
							<div className="col-4">Price</div>
							<div className="col-8">
								<input
									disabled
									type="number"
									name="price"
									className="form-control"
									value={menuItemInputs.price}
									onChange={handleMenuItemInputs}
								/>
							</div>
						</div>

						<div className="form-group row mt-2">
							<div className="col-4">Spicyness</div>
							<div className="col-8">
								<select
									disabled
									name="spicyness"
									className="form-control"
									value={menuItemInputs.spicyness}
									onChange={handleMenuItemInputs}
								>
									{SD.spicyness.map((spicy: string, index: number) => {
										return (
											<option key={index} value={index}>
												{spicy}
											</option>
										);
									})}
								</select>
							</div>
						</div>

						<div className="form-group row mt-2">
							<div className="col-8 offset-4">
								<div className="row">
									<div className="col-6">
										<button
											type="submit"
											className="btn btn-primary form-control"
											disabled={loading}
										>
											Add to Cart
										</button>
									</div>
									<div className="col-6">
										<a
											onClick={() => navigate("/")}
											className="btn btn-success form-control"
										>
											Back to Home
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-3 offset-1">
						<img
							src={imageToDisplay}
							alt=""
							width="100%"
							style={{ borderRadius: "5px" }}
						/>
					</div>
				</div>
			</form>
		</div>
	);
};
export default MenuItemDetails;
