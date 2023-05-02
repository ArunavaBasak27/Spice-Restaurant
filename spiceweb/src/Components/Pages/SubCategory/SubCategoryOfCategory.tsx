import { useEffect, useState } from "react";
import { useGetSubCategoriesQuery } from "../../../Apis/subCategoryApi";
import { useDispatch } from "react-redux";
import { setSubCategory } from "../../../Storage/Redux/subCategorySlice";
import { subCategoryModel } from "../../../Interfaces";
import { MiniLoader } from "../Common";
interface Props {
	category: number;
}
const SubCategoryOfCategory = (props: Props) => {
	const { data, isLoading } = useGetSubCategoriesQuery(null);
	const [subCategoryList, setSubCategoryList] = useState([]);

	const dispatch = useDispatch();
	useEffect(() => {
		if (!isLoading && data.result !== null) {
			dispatch(setSubCategory(data.result));
			setSubCategoryList(data.result);
		}
	}, [isLoading]);

	var filteredSubCategories = subCategoryList.filter(
		(subCategory: subCategoryModel) => {
			if (subCategory.categoryId === +props.category) {
				return subCategory;
			}
		}
	);

	return (
		<>
			{isLoading ? (
				<MiniLoader />
			) : filteredSubCategories.length > 0 ? (
				<div>
					<p>Existing sub categories: </p>
					<ul className="list-group">
						{filteredSubCategories.map(
							(subCategory: subCategoryModel, index: number) => {
								return (
									<li key={index} className="list-group-item">
										{subCategory.name}
									</li>
								);
							}
						)}
					</ul>
				</div>
			) : (
				<div>
					<p>No Sub category exists...</p>
				</div>
			)}
		</>
	);
};

export default SubCategoryOfCategory;
