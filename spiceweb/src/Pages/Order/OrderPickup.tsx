import { data } from "jquery";
import { format, parseISO } from "date-fns";
import { OrderDetails, OrderStatus } from "../../Components/Pages/Order";
import { orderHeaderModel } from "../../Interfaces/orderHeaderModel";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetAllOrdersQuery } from "../../Apis/orderApi";
import { MainLoader } from "../../Components/Pages/Common";
import { setOrderList } from "../../Storage/Redux/orderSlice";
import SD from "../../Utility/SD";
import { withFrontDeskAuth } from "../../HOC";

const OrderPickup = () => {
	const { data, isLoading } = useGetAllOrdersQuery(null);
	const dispatch = useDispatch();
	useEffect(() => {
		if (!isLoading) {
			dispatch(setOrderList(data?.result));
		}
	}, [isLoading]);

	if (isLoading) {
		return <MainLoader />;
	}
	return (
		<>
			<h2 className="text-info">Orders Ready for Pickup</h2>
			<div className="border backgroundWhite">
				<div
					className="container border border-secondary"
					style={{ height: "60px" }}
				>
					<div className="row container">
						<div className="col-11">
							<div className="row" style={{ paddingTop: "10px" }}>
								<div className="col-4">
									<input
										type="text"
										className="form-control"
										placeholder="Enter name..."
									/>
								</div>
								<div className="col-4">
									<input
										type="text"
										className="form-control"
										placeholder="Enter email..."
									/>
								</div>
								<div className="col-4">
									<input
										type="text"
										className="form-control"
										placeholder="Enter Phone number..."
									/>
								</div>
							</div>
						</div>
						<div className="col-1">
							<div className="row" style={{ paddingTop: "10px" }}>
								<button className="btn btn-info form-control">
									<i className="bi bi-search"></i>
								</button>
							</div>
						</div>
					</div>
				</div>

				<br />
				<div>
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
							{data?.result.length > 0 &&
								data?.result.map(
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
															<OrderStatus
																id={index}
																orderHeader={orderHeader}
															/>
														</div>
													</td>
												</tr>
											);
										}
									}
								)}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
};
export default withFrontDeskAuth(OrderPickup);
