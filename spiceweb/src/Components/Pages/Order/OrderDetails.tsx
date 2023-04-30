import { orderDetailModel } from "../../../Interfaces/orderDetailModel";
import { orderHeaderModel } from "../../../Interfaces/orderHeaderModel";
import { format, parseISO } from "date-fns";

interface Props {
	id: number;
	orderHeader: orderHeaderModel;
	orderDetails: orderDetailModel[];
}
const OrderDetails = (props: Props) => {
	console.log(props.orderDetails);
	let total = 0.0;
	return (
		<div
			className="modal fade"
			id={`staticBackdrop${props.id}`}
			// data-bs-backdrop="static"
			data-bs-keyboard="true"
			tabIndex={-1}
			aria-labelledby="staticBackdropLabel"
			aria-hidden="true"
		>
			<div
				className="modal-dialog-centered modal-dialog modal-xl"
				role="document"
			>
				<div className="modal-content">
					<div className="modal-header bg-success text-light justify-content-center">
						<h5 className="modal-title">Order Details</h5>
					</div>
					<div className="modal-body justify-content-center">
						<div
							className="container boder row ml-1 backgroundWhiteBorder10Padding"
							style={{ width: "100%" }}
						>
							<div
								className="col-lg-8 col-12"
								style={{ borderRight: "1px solid #bbb9b9" }}
							>
								<br />
								<div className="form-group row mt-2">
									<div className="col-3">Name</div>
									<div className="col-9">
										<input
											type="text"
											className="form-control"
											defaultValue={props.orderHeader.pickUpName}
											disabled
										/>
									</div>
								</div>
								<div className="form-group row mt-2">
									<div className="col-3">Phone No.</div>
									<div className="col-9">
										<input
											type="text"
											className="form-control"
											defaultValue={props.orderHeader.pickUpPhone}
											disabled
										/>
									</div>
								</div>
								<div className="form-group row mt-2">
									<div className="col-3">Email</div>
									<div className="col-9">
										<input
											type="text"
											className="form-control"
											defaultValue={props.orderHeader.applicationUser.email}
											disabled
										/>
									</div>
								</div>
								<div className="form-group row mt-2">
									<div className="col-3">Order Total</div>
									<div className="col-9">
										<input
											type="text"
											className="form-control"
											defaultValue={"$" + props.orderHeader.orderTotal}
											disabled
										/>
									</div>
								</div>
								<div className="form-group row mt-2">
									<div className="col-3">Pickup Date</div>
									<div className="col-9">
										<input
											type="text"
											className="form-control"
											defaultValue={format(
												parseISO(props.orderHeader?.pickUpTime),
												"dd/MM/yyyy"
											)}
											disabled
										/>
									</div>
								</div>
								<div className="form-group row mt-2">
									<div className="col-3">Pickup Time</div>
									<div className="col-9">
										<input
											type="text"
											className="form-control"
											defaultValue={format(
												parseISO(props.orderHeader?.pickUpTime),
												"hh:mm aa"
											)}
											disabled
										/>
									</div>
								</div>
								<div className="form-group row mt-2">
									<div className="col-3">Comment</div>
									<div className="col-9">
										<input
											type="text"
											className="form-control"
											defaultValue={props.orderHeader.comment ?? "NA"}
											disabled
										/>
									</div>
								</div>
							</div>

							<div className="col-lg-4 col-12">
								<h4 className="d-flex justify-content-between align-content-center mb-3">
									<span className="text-muted">Order ID: </span>
									<div className="badge bg-secondary rounded-pill">
										{props.orderHeader.id}
									</div>
								</h4>
								<ul className="list-group mb-3">
									{props.orderDetails.map(
										(orderDetail: orderDetailModel, index: number) => {
											total += orderDetail.price * orderDetail.quantity;
											return (
												<li
													key={index}
													className="list-group-item d-flex justify-content-between"
												>
													<div>
														<h6 className="my-0">{orderDetail.itemName}</h6>
														<small className="text-muted">
															Quantity : {orderDetail.quantity}
														</small>
													</div>
													<span className="text-muted">
														${total.toFixed(2)}
													</span>
												</li>
											);
										}
									)}
									{props.orderHeader.coupon && (
										<li className="list-group-item d-flex justify-content-between">
											<div className="text-success">
												<h6 className="my-0">Promo Code</h6>
												<small>{props.orderHeader.coupon.name}</small>
											</div>
											<span className="text-muted">
												- ${(total - props.orderHeader.orderTotal).toFixed(2)}
											</span>
										</li>
									)}
									<li className="list-group-item d-flex justify-content-between bg-light">
										<span className="text-info">Total (USD)</span>
										<strong className="text-info">
											${props.orderHeader.orderTotal.toFixed(2)}
										</strong>
									</li>
								</ul>

								<button className="btn btn-info form-control" disabled>
									{props.orderHeader.orderStatus}
								</button>
							</div>
						</div>
					</div>
					<div className="modal-footer">
						<button
							type="button"
							className="btn btn-secondary"
							style={{ width: "20%" }}
							data-bs-dismiss="modal"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderDetails;
