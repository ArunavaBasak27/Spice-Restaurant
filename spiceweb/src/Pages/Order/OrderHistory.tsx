import { format, parseISO } from "date-fns";
import { useGetOrdersByUserQuery } from "../../Apis/orderApi";
import { OrderDetails, OrderList } from "../../Components/Pages/Order";
import { orderHeaderModel } from "../../Interfaces/orderHeaderModel";
import { useSelector } from "react-redux";
import { RootState } from "../../Storage/Redux/store";
import { useEffect, useState } from "react";
import { MainLoader } from "../../Components/Pages/Common";

const OrderHistory = () => {
	const userData = useSelector((state: RootState) => state.userStore);
	const { data, isLoading } = useGetOrdersByUserQuery(userData.id, {
		skip: userData === null,
	});

	if (isLoading) {
		return <MainLoader />;
	}

	return (
		<>
			<div className="row">
				<div className="col-6">
					<h2 className="text-info">Order History</h2>
				</div>
			</div>
			<br />
			<OrderList orderList={data?.result} />
		</>
	);
};

export default OrderHistory;
