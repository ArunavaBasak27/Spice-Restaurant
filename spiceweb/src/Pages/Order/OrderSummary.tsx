import { useNavigate } from "react-router-dom";
import { RootState } from "../../Storage/Redux/store";
import { useSelector } from "react-redux";
import {
	apiResponse,
	cartItemModel,
	shoppingCartModel,
} from "../../Interfaces";
import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { inputHelper } from "../../Helper";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SD from "../../Utility/SD";
import userModel from "../../Interfaces/userModel";
import { useInitiatePaymentMutation } from "../../Apis/paymentApi";

const OrderSummary = () => {
	const navigate = useNavigate();
	const shoppingCart: shoppingCartModel = useSelector(
		(state: RootState) => state.shoppingCartStore
	);
	const userData: userModel = useSelector(
		(state: RootState) => state.userStore
	);
	const initialUserData = {
		name: userData.fullName,
		phone: shoppingCart.applicationUser?.phoneNumber,
		comments: "",
	};
	const [orderInput, setOrderInput] = useState(initialUserData);

	useEffect(() => {
		setOrderInput({
			name: userData.fullName,
			phone: shoppingCart.applicationUser?.phoneNumber,
			comments: "",
		});
	}, [shoppingCart]);

	let total = 0.0;
	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const tempData = inputHelper(e, orderInput);
		setOrderInput(tempData);
	};

	var today = new Date();
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [minTime, setMinTime] = useState("11:00");
	const [mTime, setMTime] = useState<Date | null>(null);
	const handleDateChange = (date: Date) => {
		var time =
			today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
		if (date > today) {
			time = "11:00";
			date.setHours(11, 0, 0, 0);
		} else {
			if (today.getHours() < 11) {
				time = "12:00";
				date.setHours(12, 0, 0, 0);
			} else {
				if (today.getMinutes() < 30) {
					time = (today.getHours() + 1).toString() + ":30";
					date.setHours(today.getHours() + 1, 30, 0, 0);
				} else {
					time = (today.getHours() + 2).toString() + ":00";
					date.setHours(today.getHours() + 2, 0, 0, 0);
					setMTime(SD.newDate(time!));
				}
			}
		}
		setMinTime(time);
		setStartDate(date!);
	};

	const [initiatePayment] = useInitiatePaymentMutation();
	const [loading, setLoading] = useState(false);
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		const obj = {
			name: orderInput.name,
			phoneNumber: orderInput.phone,
			date: startDate,
			time: startDate,
			additionalInstructions: orderInput.comments,
		};
		if (today.getHours() >= 20) {
			obj.date = SD.addDays(mTime!, startDate?.getDate()! - today.getDate());
			obj.time = SD.addDays(mTime!, startDate?.getDate()! - today.getDate());
		}

		const response: apiResponse = await initiatePayment(userData.id);

		navigate("/payment", {
			state: { apiResult: response.data?.result, obj },
		});

		setLoading(false);
	};

	return (
		<div className="backgroundWhite">
			<div className="container">
				<div className="card">
					<div className="card-header bg-dark text-light m-0 row container">
						<div className="col-6">Order Summary</div>
						<div className="col-6 text-end">
							<a
								className="btn btn-outline-info btn-sm"
								onClick={() => navigate("/shoppingCart")}
							>
								Back to Cart
							</a>
						</div>
					</div>
					<form onSubmit={handleSubmit} method="post">
						<div className="card-body">
							<div className="container rounded p-2">
								<div className="row">
									<div className="col-12 col-lg-6 pb-4">
										<div className="row">
											<h4 className="d-flex justify-content-between align-items-center mb-3">
												<span className="text-info">Pickup Details:</span>
											</h4>
										</div>
										<div className="row my-1">
											<div className="col-3">
												<label>Name</label>
											</div>
											<div className="col-9">
												<input
													name="name"
													defaultValue={orderInput.name}
													onChange={handleChange}
													type="text"
													className="form-control"
													placeholder="Enter name.."
												/>
											</div>
										</div>
										<div className="row my-1">
											<div className="col-3">
												<label>Phone</label>
											</div>
											<div className="col-9">
												<input
													type="text"
													name="phone"
													defaultValue={orderInput.phone}
													onChange={handleChange}
													className="form-control"
													placeholder="Enter phone number.."
												/>
											</div>
										</div>
										<div className="row my-1">
											<div className="col-3">
												<label>Date</label>
											</div>
											<div className="col-9">
												{today.getHours() >= 20 && (
													<DatePicker
														selected={startDate}
														onChange={(date) => setStartDate(date!)}
														minDate={SD.addDays(today, 1)}
														maxDate={SD.addDays(today, 6)}
														placeholderText="Enter pickup date.."
														className="form-control"
													/>
												)}
												{today.getHours() < 20 && (
													<DatePicker
														selected={startDate}
														onChange={(date) => handleDateChange(date!)}
														minDate={today}
														maxDate={SD.addDays(today, 5)}
														placeholderText="Enter pickup date.."
														className="form-control"
													/>
												)}
											</div>
										</div>
										<div className="row my-1">
											<div className="col-3">
												<label>Time</label>
											</div>
											<div className="col-9">
												{today.getHours() >= 20 && (
													<DatePicker
														selected={mTime}
														onChange={(date) => setMTime(date)}
														minTime={SD.newDate("11:00")}
														maxTime={SD.newDate("21:00")}
														showTimeSelect
														showTimeSelectOnly
														timeIntervals={30}
														timeCaption="Time"
														dateFormat="h:mm aa"
														className="form-control"
														placeholderText="Enter pickup time..."
													/>
												)}
												{today.getHours() < 20 && (
													<DatePicker
														selected={startDate}
														onChange={(date) => setStartDate(date)}
														minTime={SD.newDate(minTime)}
														maxTime={SD.newDate("21:00")}
														showTimeSelect
														showTimeSelectOnly
														timeIntervals={30}
														timeCaption="Time"
														dateFormat="h:mm aa"
														className="form-control"
														placeholderText="Enter pickup time..."
													/>
												)}
											</div>
										</div>
										<div className="row my-1">
											<div className="col-3">
												<label>Additional instructions:</label>
											</div>
											<div className="col-9">
												<textarea
													name="comments"
													value={orderInput.comments}
													onChange={handleChange}
													style={{ height: "100px" }}
													className="form-control"
													placeholder="Enter additional instructions.."
												/>
											</div>
										</div>
									</div>

									<div className="col-12 col-lg-5 offset-lg-1">
										<div className="row">
											<h4 className="d-flex justify-content-between align-items-center mb-3">
												<span className="text-info">Order Summary:</span>
											</h4>
											<ul className="list-group mb-3">
												{shoppingCart.cartItems?.map(
													(cartItem: cartItemModel, index: number) => {
														total +=
															cartItem.quantity * cartItem.menuItem.price;
														return (
															<li
																className="list-group-item d-flex justify-content-between"
																key={index}
															>
																<div>
																	<h6 className="my-0">
																		Name: {cartItem.menuItem.name}
																	</h6>
																	<small className="text-muted">
																		Quantity: {cartItem.quantity}
																	</small>
																</div>
																<span className="text-muted">
																	${cartItem.menuItem.price * cartItem.quantity}
																</span>
															</li>
														);
													}
												)}
												{shoppingCart.coupon !== null && (
													<li className="list-group-item d-flex justify-content-between">
														<div className="text-success">
															<h6 className="my-0">Promo Code</h6>
															<small className="text-muted">
																{shoppingCart.coupon?.name}
															</small>
														</div>
														<small className="text-success">
															-${(total - shoppingCart?.cartTotal!).toFixed(2)}
														</small>
													</li>
												)}
												{shoppingCart?.cartTotal && (
													<li className="list-group-item d-flex justify-content-between bg-light">
														<strong className="text-info">Total(USD)</strong>
														<strong className="text-info">
															${shoppingCart?.cartTotal!.toFixed(2)}
														</strong>
													</li>
												)}
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="card-footer">
							<div className="col-12 col-md-4 offset-md-8">
								<button type="submit" className="btn btn-success form-control">
									Place Order
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default OrderSummary;
