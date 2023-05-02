import { withPaymentAuth } from "../../../HOC";
import { cartItemModel, couponModel } from "../../../Interfaces";
import userModel from "../../../Interfaces/userModel";

interface Props {
	data: {
		id: number;
		cartItems: cartItemModel[];
		cartTotal: number;
		applicationUser: userModel;
		coupon: couponModel;
	};
	orderData: {
		name: string;
		phoneNumber: string;
	};
}
const OrderConsolidated = ({ data, orderData }: Props) => {
	var total = 0.0;
	return (
		<div>
			<h3 className="text-success">Order Summary</h3>
			<div className="mt-3">
				<div className="border py-3 px-2">Name : {orderData.name}</div>
				<div className="border py-3 px-2">
					Email : {data.applicationUser.email}
				</div>
				<div className="border py-3 px-2">Phone : {orderData.phoneNumber}</div>
				<div className="border py-3 px-2">
					<h4 className="text-success">Menu Items</h4>
					<div className="p-3">
						{data.cartItems.map((cartItem: cartItemModel, index: number) => {
							total += cartItem.menuItem.price * cartItem.quantity;
							return (
								<div key={index} className="d-flex">
									<div className="d-flex w-100 justify-content-between">
										<p>{cartItem.menuItem.name}</p>
										<p>
											${cartItem.menuItem.price.toFixed(2)}x {cartItem.quantity}
											{"    "}=
										</p>
									</div>
									<p style={{ width: "70px", textAlign: "right" }}>
										${cartItem.menuItem.price * cartItem.quantity}
									</p>
								</div>
							);
						})}
						<hr />
						<div className="d-flex">
							<div className="d-flex w-100 justify-content-between">
								<p>Total:</p>
								<p></p>
							</div>
							<p style={{ width: "70px", textAlign: "right" }}>
								${total.toFixed(2)}
							</p>
						</div>
						{data.coupon && (
							<>
								<hr />
								<h4 className="text-info" style={{ textAlign: "center" }}>
									Coupon : {data.coupon.name}
								</h4>
								<div className="d-flex">
									<div className="d-flex w-100 justify-content-between">
										<p>Discount:</p>
										<p></p>
									</div>
									<p style={{ width: "70px", textAlign: "right" }}>
										-${(total - data.cartTotal).toFixed(2)}
									</p>
								</div>
								<hr />
								<div className="d-flex">
									<div className="d-flex w-100 justify-content-between">
										<p>Grand Total:</p>
										<p></p>
									</div>
									<p style={{ width: "70px", textAlign: "right" }}>
										${data.cartTotal.toFixed(2)}
									</p>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default withPaymentAuth(OrderConsolidated);
