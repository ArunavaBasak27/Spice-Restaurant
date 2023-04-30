import couponModel from "./couponModel";
import { orderDetailModel } from "./orderDetailModel";

export interface orderHeaderModel {
	id: number;
	applicationUserId: string;
	applicationUser: any;
	orderDate: string;
	orderTotal: number;
	pickUpTime: string;
	pickUpDate: string;
	orderStatus: string;
	paymentStatus: string;
	totalItems: number;
	couponId: number;
	coupon: couponModel;
	stripePaymentIntentID: any;
	pickUpName: string;
	pickUpPhone: string;
	comment: any;
	orderDetails: orderDetailModel[];
}
