import cartItemModel from "./cartItemModel";
import couponModel from "./couponModel";

export interface shoppingCartModel {
	id?: number;
	userId?: string;
	applicationUser?: any;
	stripePaymentIntentId?: any;
	clientSecret?: any;
	cartItems?: cartItemModel[];
	cartTotal?: number;
	couponId?: number;
	coupon?: couponModel;
}
