import { useEffect } from "react";
import { useGetAllOrdersQuery } from "../../Apis/orderApi";
import { useDispatch } from "react-redux";
import { setOrderList } from "../../Storage/Redux/orderSlice";
import { MainLoader } from "../../Components/Pages/Common";
import { orderHeaderModel } from "../../Interfaces/orderHeaderModel";
import { format, parseISO } from "date-fns";

const OrderList = () => {
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
		<div className="border backgroundWhite">
			<div className="row">
				<div className="col-6">
					<h2 className="text-info">Order List</h2>
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
											{/* <td>{orderHeader.coupon?.name ?? ""}</td> */}
											<td>
												<a className="btn btn-success form-control w-75">
													<i className="bi bi-list-ul"></i>
												</a>
											</td>
										</tr>
									);
								}
							)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default OrderList;
