import { orderHeaderModel } from "../../../Interfaces/orderHeaderModel";
import { format, parseISO } from "date-fns";
import OrderDetails from "./OrderDetails";
import OrderStatus from "./OrderStatus";

interface Props {
	orderList: orderHeaderModel[];
}
const OrderList = (props: Props) => {
	return (
		<div className="border backgroundWhite">
			{props.orderList !== null && props.orderList.length > 0 && (
				<div className="table-responsive-sm">
					<table className="table table-bordered border">
						<thead>
							<tr className="table-secondary">
								<th>Order Header Id</th>
								<th>Pickup Name</th>
								<th>Email</th>
								<th>Pickup Time</th>
								<th>Order Total</th>
								<th>Total Items</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{props.orderList?.length > 0 &&
								props.orderList.map(
									(orderHeader: orderHeaderModel, index: number) => {
										return (
											<tr key={index}>
												<td>{orderHeader.id}</td>
												<td>{orderHeader.pickUpName}</td>
												<td>{orderHeader.applicationUser?.email}</td>
												<td>
													{format(
														parseISO(
															orderHeader?.pickUpTime.endsWith("Z")
																? orderHeader?.pickUpTime
																: orderHeader?.pickUpTime + "Z"
														),
														"dd/MM/yyyy hh:mm aa"
													)}
												</td>
												<td>{orderHeader.orderTotal}</td>
												<td>{orderHeader.totalItems}</td>
												<td>
													<div className="row">
														<div className="col-md-6 col-12">
															<a
																type="button"
																className="btn btn-success form-control"
																data-bs-toggle="modal"
																data-bs-target={`#staticBackdrop${index}`}
															>
																<i className="bi bi-list-ul"></i>
															</a>
															<OrderDetails
																id={index}
																orderHeader={orderHeader}
																orderDetails={orderHeader.orderDetails}
															/>
														</div>
														<div className="col-md-6 col-12 mt-md-0 mt-2">
															<a
																type="button"
																className="btn btn-info form-control"
																data-bs-toggle="modal"
																data-bs-target={`#statusBackdrop${index}`}
															>
																<i className="bi bi-clock"></i>
															</a>
															<OrderStatus
																id={index}
																orderHeader={orderHeader}
															/>
														</div>
													</div>
												</td>
											</tr>
										);
									}
								)}
						</tbody>
					</table>
				</div>
			)}
			{!props.orderList.length && <p>No Orders found...</p>}
		</div>
	);
};

export default OrderList;
