import { OrderList } from "../../Components/Pages/Order";
import { useSelector } from "react-redux";
import { RootState } from "../../Storage/Redux/store";
import { MainLoader } from "../../Components/Pages/Common";
import { withAuth } from "../../HOC";
import { useEffect, useState } from "react";
import { useGetAllOrdersQuery } from "../../Apis/orderApi";

const OrderHistory = () => {
	const userData = useSelector((state: RootState) => state.userStore);
	const [totalRecords, setTotalRecords] = useState();
	const [pageOptions, setPageOptions] = useState({
		pageNumber: 1,
		pageSize: 5,
	});
	const { data, isLoading } = useGetAllOrdersQuery(
		{
			userId: userData.id,
			pageSize: pageOptions.pageSize,
			pageNumber: pageOptions.pageNumber,
		},
		{
			skip: userData.id === "",
		}
	);
	useEffect(() => {
		if (data) {
			const { TotalRecords } = JSON.parse(data?.totalRecords!);
			setTotalRecords(TotalRecords);
		}
	}, [data]);

	console.log(data);

	const getPageDetails = () => {
		const dataStartNumber =
			(pageOptions.pageNumber - 1) * pageOptions.pageSize + 1;
		const dataEndNumber = pageOptions.pageNumber * pageOptions.pageSize;

		return `${dataStartNumber} 
		  -
		 ${
				dataEndNumber < totalRecords! ? dataEndNumber : totalRecords
			} of ${totalRecords}`;
	};

	const handlePaginationClick = (direction: string) => {
		console.log(direction);
		if (direction === "prev") {
			setPageOptions({ pageSize: 5, pageNumber: pageOptions.pageNumber - 1 });
		} else if (direction === "next") {
			setPageOptions({ pageSize: 5, pageNumber: pageOptions.pageNumber + 1 });
		}
	};

	if (isLoading) {
		return <MainLoader />;
	}

	console.log(totalRecords);
	return (
		<>
			<div className="row">
				<div className="col-6">
					<h2 className="text-info">Order History</h2>
				</div>
			</div>
			<br />
			<div className="border backgroundWhite">
				<OrderList orderList={data?.apiResponse?.result} />

				<div className="d-flex mx-5 justify-content-end align-items-center">
					<div className="mx-2">{getPageDetails()}</div>
					<button
						disabled={pageOptions.pageNumber === 1}
						onClick={() => handlePaginationClick("prev")}
						className="btn btn-outline-primary px-3 mx-2"
					>
						<i className="bi bi-chevron-left"></i>
					</button>
					<button
						disabled={
							pageOptions.pageNumber * pageOptions.pageSize >= totalRecords!
						}
						onClick={() => handlePaginationClick("next")}
						className="btn btn-outline-primary px-3 mx-2"
					>
						<i className="bi bi-chevron-right"></i>
					</button>
				</div>
			</div>
		</>
	);
};

export default withAuth(OrderHistory);
