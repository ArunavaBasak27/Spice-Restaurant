import { useSelector } from "react-redux";
import { RootState } from "../../Storage/Redux/store";
import { orderDetailModel } from "../../Interfaces/orderDetailModel";
import { orderHeaderModel } from "../../Interfaces/orderHeaderModel";
import { format, parseISO } from "date-fns";
import SD from "../../Utility/SD";
import { useUpdateOrderMutation } from "../../Apis/orderApi";
import { apiResponse } from "../../Interfaces";
import { toastNotify } from "../../Helper";
import { useEffect, useState } from "react";
import { useRefundPaymentMutation } from "../../Apis/paymentApi";
import { withChefAuth } from "../../HOC";

const ManageOrder = () => {
	const orderFromStore = useSelector((state: RootState) => state.orderStore);
	const [updateOrder] = useUpdateOrderMutation();
	const [refundPayment] = useRefundPaymentMutation();
	const [orderList, setOrderList] = useState([]);

	useEffect(() => {
		var tempList =
			orderFromStore &&
			orderFromStore?.orderList?.filter(
				(orderData: orderHeaderModel) =>
					orderData.orderStatus === SD.StatusInProcess ||
					orderData.orderStatus === SD.StatusSubmitted
			);

		setOrderList(tempList);
	}, [orderFromStore]);

	useEffect(() => {
		var tempList =
			orderFromStore &&
			orderFromStore?.orderList?.filter(
				(orderData: orderHeaderModel) =>
					orderData.orderStatus === SD.StatusInProcess ||
					orderData.orderStatus === SD.StatusSubmitted
			);

		setOrderList(tempList);
	}, []);

	const startCooking = async (orderHeader: orderHeaderModel) => {
		const response: apiResponse = await updateOrder({
			...orderHeader,
			orderStatus: SD.StatusInProcess,
		});
		if (response.data?.isSuccess) {
			toastNotify("Cooking completed");
			return;
		} else {
			toastNotify(response.data?.errorMessages[0], "error");
			return;
		}
	};

	const cancelOrder = async (orderHeader: orderHeaderModel) => {
		//Make refund

		let refundResponse: apiResponse = await refundPayment(orderHeader.id);

		if (refundResponse.data?.isSuccess) {
			const response: apiResponse = await updateOrder({
				...orderHeader,
				orderStatus: SD.StatusCancelled,
				paymentStatus: SD.PaymentStatusRefunded,
			});
			if (response.data?.isSuccess) {
				toastNotify("Order cancelled!");
				return;
			} else {
				toastNotify(response.data?.errorMessages[0], "error");
				return;
			}
		} else {
			toastNotify(refundResponse.data?.errorMessages[0], "error");
			return;
		}
	};

	const orderReady = async (orderHeader: orderHeaderModel) => {
		const response: apiResponse = await updateOrder({
			...orderHeader,
			orderStatus: SD.StatusReady,
		});
		if (response.data?.isSuccess) {
			toastNotify("Order Completed!");
			return;
		} else {
			toastNotify(response.data?.errorMessages[0], "error");
			return;
		}
	};

	// console.log(orderList);

	return (
		<div>
			<h2 className="text-info">Manage Order</h2>
			<br />
			{orderList && orderList.length !== 0 && (
				<div className="container row bg-white p-2 mb-3 border rounded">
					{orderList.map((orderHeader: orderHeaderModel, index: number) => {
						return (
							<div className="col-12 pb-3 pt-3" key={index}>
								<div className="backgroundWhiteBorder10Padding">
									<div className="row">
										<div className="col-4">
											Order Number :{orderHeader.id}
											<br />
											{orderHeader.orderDetails && (
												<ul className="text-info">
													{orderHeader.orderDetails.map(
														(details: orderDetailModel, index) => {
															return (
																<li className="" key={index}>
																	{details.itemName} x {details.quantity}
																</li>
															);
														}
													)}
												</ul>
											)}
										</div>
										<div className="col-4 pb-2">
											<div className="input-group pb-2">
												<div className="input-group-append">
													<span className="input-group-text">Time</span>
												</div>
												<input
													type="text"
													className="border rounded form-control"
													disabled
													defaultValue={format(
														parseISO(
															orderHeader?.pickUpTime.endsWith("Z")
																? orderHeader?.pickUpTime
																: orderHeader?.pickUpTime + "Z"
														),
														"dd/MM/yyyy hh:mm aa"
													)}
												/>
											</div>
											<textarea
												defaultValue={orderHeader.comment ?? "No instructions"}
												className="rounded border form-control"
												style={{ width: "100%", height: "75px" }}
												disabled
											></textarea>
										</div>
										<div className="col-3 offset-1 d-flex align-content-center">
											{orderHeader.orderStatus.toLowerCase() ===
												SD.StatusSubmitted.toLowerCase() && (
												<div className="col-12">
													<button
														onClick={() => startCooking(orderHeader)}
														className="btn btn-info form-control"
													>
														<i className="bi bi-check-lg"></i> Start Cooking
													</button>
													<br />
													<button
														onClick={() => cancelOrder(orderHeader)}
														className="btn btn-danger mt-2 form-control"
													>
														&times; Cancel Order
													</button>
												</div>
											)}
											{orderHeader.orderStatus.toLowerCase() ===
												SD.StatusInProcess.toLowerCase() && (
												<div className="col-12">
													<button
														onClick={() => orderReady(orderHeader)}
														className="btn btn-success form-control"
													>
														<i className="bi bi-flag"></i> Order Ready
													</button>
													<button
														onClick={() => cancelOrder(orderHeader)}
														className="btn btn-danger mt-2 form-control"
													>
														&times; Cancel Order
													</button>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
			{orderList && orderList.length === 0 && <p>No orders to process....</p>}
		</div>
	);
};

export default withChefAuth(ManageOrder);
