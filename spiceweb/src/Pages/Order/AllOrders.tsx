import { useEffect, useState } from "react";
import { useGetAllOrdersQuery } from "../../Apis/orderApi";
import { useDispatch } from "react-redux";
import { setOrderList } from "../../Storage/Redux/orderSlice";
import { MainLoader } from "../../Components/Pages/Common";
import { orderHeaderModel } from "../../Interfaces/orderHeaderModel";
import { format, parseISO } from "date-fns";
import { OrderDetails, OrderList } from "../../Components/Pages/Order";
const AllOrders = () => {
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
			<div className="row">
				<div className="col-6">
					<h2 className="text-info">All Orders</h2>
				</div>
			</div>
			<br />
			<OrderList orderList={data?.result} />
		</>
	);
};

export default AllOrders;
