import { useGetAllOrdersQuery } from "../../Apis/orderApi";
import { MainLoader } from "../../Components/Pages/Common";
import { OrderList } from "../../Components/Pages/Order";
import { withManagerAuth } from "../../HOC";
const AllOrders = () => {
	const { data, isLoading } = useGetAllOrdersQuery(null);
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

export default withManagerAuth(AllOrders);
