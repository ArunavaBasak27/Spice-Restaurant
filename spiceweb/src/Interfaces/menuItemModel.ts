import categoryModel from "./categoryModel";
import subCategoryModel from "./subCategoryModel";

export default interface menuItemModel {
	id: number;
	name: string;
	spicyness: number;
	image: string;
	categoryId: number;
	category: categoryModel;
	subCategoryId: number;
	subCategory: subCategoryModel;
	price: number;
}
