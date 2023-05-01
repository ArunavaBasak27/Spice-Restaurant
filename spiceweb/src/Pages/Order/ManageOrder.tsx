import { useSelector } from "react-redux";
import { RootState } from "../../Storage/Redux/store";
import { orderDetailModel } from "../../Interfaces/orderDetailModel";
import { orderHeaderModel } from "../../Interfaces/orderHeaderModel";
import { format, parseISO } from "date-fns";
import SD from "../../Utility/SD";

const ManageOrder = () => {
	const orderFromStore = useSelector((state: RootState) => state.orderStore);
	console.log(orderFromStore);
	return (
		<div>
			<h2 className="text-info">Manage Order</h2>
			<br />
			<form method="post">
				{orderFromStore && (
					<div className="container row bg-white p-2 mb-3 border rounded">
						{orderFromStore.orderList.map(
							(orderHeader: orderHeaderModel, index: number) => {
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
																parseISO(orderHeader?.pickUpTime),
																"dd/MM/yyyy hh:mm aa"
															)}
														/>
													</div>
													<textarea
														defaultValue={
															orderHeader.comment ?? "No instructions"
														}
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
																type="submit"
																className="btn btn-info form-control"
															>
																<i className="bi bi-check-lg"></i> Start Cooking
															</button>
															<br />
															<button
																type="submit"
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
																type="submit"
																className="btn btn-info form-control"
															>
																<i className="bi bi-flag"></i> Order Ready
															</button>
															<button
																type="submit"
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
							}
						)}
					</div>
				)}
			</form>
		</div>
	);
};

export default ManageOrder;
