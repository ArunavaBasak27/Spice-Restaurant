import categoryModel from "./categoryModel";

export default interface subCategoryModel {
	id: number;
	name: string;
	categoryId: number;
	category: categoryModel;
}
