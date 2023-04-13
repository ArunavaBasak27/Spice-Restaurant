import React, { useEffect, useState } from "react";
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

	return (
		<>
			{isLoading && <MiniLoader />}
			{!isLoading && (
				<div>
					<p>Existing sub categories: </p>
					<ul className="list-group">
						{subCategoryList.length &&
							subCategoryList.map(
								(subCategory: subCategoryModel, index: number) => {
									if (subCategory.categoryId === +props.category) {
										return (
											<li key={index} className="list-group-item">
												{subCategory.name}
											</li>
										);
									}
								}
							)}
					</ul>
				</div>
			)}
		</>
	);
};

export default SubCategoryOfCategory;
