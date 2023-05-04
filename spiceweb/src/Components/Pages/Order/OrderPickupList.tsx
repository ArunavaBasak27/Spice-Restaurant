import { data } from "jquery";
import { format, parseISO } from "date-fns";
import { orderHeaderModel } from "../../../Interfaces/orderHeaderModel";
import SD from "../../../Utility/SD";
import OrderDetails from "./OrderDetails";
import OrderStatus from "./OrderStatus";
interface Props {
	orderList: orderHeaderModel[];
}
const OrderPickupList = (props: Props) => {
	return (
		<>
			<table className="table table-bordered border">
				<thead>
					<tr className="table-secondary">
						<th>Order Header Id</th>
						<th>Pickup Name</th>
						<th>Email</th>
						<th>Pickup Time</th>
						<th>Order Total</th>
						<th>Total Items</th>
						{/* <th>Coupon</th> */}
						<th></th>
					</tr>
				</thead>
				<tbody>
					{props.orderList.length > 0 &&
						props.orderList.map(
							(orderHeader: orderHeaderModel, index: number) => {
								if (orderHeader.orderStatus === SD.StatusReady) {
									return (
										<tr key={index}>
											<td>{orderHeader.id}</td>
											<td>{orderHeader.pickUpName}</td>
											<td>{orderHeader.applicationUser?.email}</td>
											<td>
												{format(
													parseISO(orderHeader?.pickUpTime),
													"dd/MM/yyyy hh:mm aa"
												)}
											</td>
											<td>{orderHeader.orderTotal}</td>
											<td>{orderHeader.totalItems}</td>
											<td className="row">
												<div className="col-6">
													<a
														type="button"
														className="btn btn-success form-control w-100"
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
												<div className="col-6">
													<a
														type="button"
														className="btn btn-info form-control w-100"
														data-bs-toggle="modal"
														data-bs-target={`#statusBackdrop${index}`}
													>
														<i className="bi bi-clock"></i>
													</a>
													<OrderStatus id={index} orderHeader={orderHeader} />
												</div>
											</td>
										</tr>
									);
								}
							}
						)}
				</tbody>
			</table>
		</>
	);
};

export default OrderPickupList;
