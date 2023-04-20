import cartItemModel from "./cartItemModel";

export interface shoppingCartModel {
	id?: number;
	userId?: string;
	applicationUser?: any;
	stripePaymentIntentId?: any;
	clientSecret?: any;
	cartItems?: cartItemModel[];
	cartTotal?: number;
}
