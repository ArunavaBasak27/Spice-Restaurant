import cartItemModel from "./cartItemModel";
import couponModel from "./couponModel";
import userModel from "./userModel";

export interface shoppingCartModel {
	id?: number;
	userId?: string;
	applicationUser?: userModel;
	stripePaymentIntentId?: any;
	clientSecret?: any;
	cartItems?: cartItemModel[];
	cartTotal?: number;
	couponId?: number;
	coupon?: couponModel;
}
