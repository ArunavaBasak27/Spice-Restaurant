import {
	useStripe,
	useElements,
	PaymentElement,
} from "@stripe/react-stripe-js";
import { FormEvent, useState } from "react";
import { toastNotify } from "../../../Helper";
import { MiniLoader } from "../Common";
import { apiResponse, cartItemModel, couponModel } from "../../../Interfaces";
import userModel from "../../../Interfaces/userModel";
import { useCreateOrderMutation } from "../../../Apis/orderApi";
import SD from "../../../Utility/SD";
import { useNavigate } from "react-router-dom";
import { useClearShoppingCartMutation } from "../../../Apis/shoppingCartApi";
interface Props {
	data: {
		stripePaymentIntentId: string;
		id: number;
		cartItems: cartItemModel[];
		cartTotal: number;
		applicationUser: userModel;
		coupon: couponModel;
	};
	orderData: {
		name: string;
		phoneNumber: string;
		date: string;
		time: string;
		additionalInstructions: string;
	};
}

const PaymentForm = ({ data, orderData }: Props) => {
	console.log(data);
	const navigate = useNavigate();
	const stripe = useStripe();
	const elements = useElements();
	const [isProcessing, setIsProcessing] = useState(false);
	const [createOrder] = useCreateOrderMutation();
	const [clearCart] = useClearShoppingCartMutation();
	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsProcessing(true);
		if (!stripe || !elements) {
			return;
		}
		const result = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: "",
			},
			redirect: "if_required",
		});
		if (result.error) {
			toastNotify(result.error.message, "error");
		} else {
			if (result.paymentIntent.status === "succeeded") {
				let totalItems = 0;
				let grandTotal = 0;
				const orderDetails: any = [];
				data.cartItems.forEach((item: cartItemModel) => {
					const tempOrderDetail: any = {};
					tempOrderDetail["menuItemId"] = item.menuItem.id;
					tempOrderDetail["itemName"] = item.menuItem.name;
					tempOrderDetail["quantity"] = item.quantity;
					tempOrderDetail["price"] = item.menuItem.price;
					orderDetails.push(tempOrderDetail);
					grandTotal += item.menuItem.price * item.quantity;
					totalItems += item.quantity;
				});

				const response: apiResponse = await createOrder({
					applicationUserId: data.applicationUser.id,
					orderTotal: grandTotal,
					pickUpTime: orderData.date,
					pickUpDate: orderData.time,
					orderStatus:
						result.paymentIntent.status === "succeeded"
							? SD.StatusSubmitted
							: SD.StatusCancelled,
					paymentStatus:
						result.paymentIntent.status === "succeeded"
							? SD.PaymentStatusApproved
							: SD.PaymentStatusRejected,
					totalItems: totalItems,
					couponId: data?.coupon?.id || 0,
					pickUpName: orderData.name,
					pickUpPhone: orderData.phoneNumber,
					orderDetails: orderDetails,
					comment: orderData.additionalInstructions,
					stripePaymentIntentId: data?.stripePaymentIntentId,
				});

				if (response.data?.isSuccess) {
					toastNotify("Payment successful", "success");
					clearCart(data.applicationUser.id);
					navigate("/order/orderConfirmed/" + response.data.result.id);
				}
			} else {
				toastNotify("Error encountered", "error");
			}
		}
		setIsProcessing(false);
	};

	return (
		<form onSubmit={handleSubmit}>
			<PaymentElement />
			<button className="btn btn-success form-control mt-5 w-100">
				{isProcessing && <MiniLoader />} Submit
			</button>
		</form>
	);
};

export default PaymentForm;
