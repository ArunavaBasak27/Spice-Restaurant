import { useGetOrdersByUserQuery } from "../../Apis/orderApi";
import { OrderList } from "../../Components/Pages/Order";
import { useSelector } from "react-redux";
import { RootState } from "../../Storage/Redux/store";
import { MainLoader } from "../../Components/Pages/Common";
import { withAuth } from "../../HOC";

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
					<h2 className="text-info">Past Orders List</h2>
				</div>
			</div>
			<br />
			<OrderList orderList={data?.result} />
		</>
	);
};

export default withAuth(OrderHistory);
