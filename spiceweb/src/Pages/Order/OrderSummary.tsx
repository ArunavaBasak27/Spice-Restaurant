import { useNavigate } from "react-router-dom";
import { RootState } from "../../Storage/Redux/store";
import { useSelector } from "react-redux";
import { cartItemModel, shoppingCartModel } from "../../Interfaces";
import { useState, FormEvent, ChangeEvent } from "react";
import $ from "jquery";
import { inputHelper } from "../../Helper";

const OrderSummary = () => {
	const navigate = useNavigate();
	const shoppingCart: shoppingCartModel = useSelector(
		(state: RootState) => state.shoppingCartStore
	);
	const [orderInput, setOrderInput] = useState({
		name: "",
		phone: "",
		date: "",
		time: "",
		additionalInstructions: "",
	});

	let total = 0.0;
	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const tempData = inputHelper(e, orderInput);
		setOrderInput(tempData);
	};
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		orderInput.date = $("#datepicker").val()?.toString() || "";
		orderInput.time = $("#timepicker").val()?.toString() || "";
		console.log(orderInput);
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
													value={orderInput.name}
													onChange={handleChange}
													type="text"
													className="form-control"
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
													value={orderInput.phone}
													onChange={handleChange}
													className="form-control"
												/>
											</div>
										</div>
										<div className="row my-1">
											<div className="col-3">
												<label>Date</label>
											</div>
											<div className="col-9">
												<input
													id="datepicker"
													type="text"
													className="form-control"
												/>
											</div>
										</div>
										<div className="row my-1">
											<div className="col-3">
												<label>Time</label>
											</div>
											<div className="col-9">
												<input
													id="timepicker"
													type="text"
													className="form-control"
												/>
											</div>
										</div>
										<div className="row my-1">
											<div className="col-3">
												<label>Additional instructions:</label>
											</div>
											<div className="col-9">
												<textarea
													name="additionalInstructions"
													value={orderInput.additionalInstructions}
													onChange={handleChange}
													style={{ height: "100px" }}
													className="form-control"
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
																	{cartItem.menuItem.price * cartItem.quantity}
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
														<small className="text-muted">Total(USD)</small>
														<small className="text-info">
															${shoppingCart?.cartTotal!.toFixed(2)}
														</small>
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
