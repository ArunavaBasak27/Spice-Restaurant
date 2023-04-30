import menuItemModel from "./menuItemModel";

export interface orderDetailModel {
	id: number;
	orderHeaderId: number;
	menuItemId: number;
	menuItem: menuItemModel;
	itemName: string;
	quantity: number;
	price: number;
}
