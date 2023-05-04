import { useEffect, useState } from "react";
import { useGetAllOrdersQuery } from "../../Apis/orderApi";
import { MainLoader } from "../../Components/Pages/Common";
import { OrderList } from "../../Components/Pages/Order";
import { withManagerAuth } from "../../HOC";
const AllOrders = () => {
	const [totalRecords, setTotalRecords] = useState();
	const [pageOptions, setPageOptions] = useState({
		pageNumber: 1,
		pageSize: 5,
	});
	const { data, isLoading } = useGetAllOrdersQuery({
		userId: "",
		pageSize: pageOptions.pageSize,
		pageNumber: pageOptions.pageNumber,
	});

	useEffect(() => {
		if (data) {
			const { TotalRecords } = JSON.parse(data?.totalRecords!);
			setTotalRecords(TotalRecords);
		}
	}, [data]);

	const pageList = () => {
		var pages = [];
		for (let i = 0; i < totalRecords! / 5; i++) {
			pages.push(i);
		}
		return pages;
	};

	const handlePagination = (i: number) => {
		var buttons = document.querySelectorAll(".page");
		buttons.forEach((button, index) => {
			if (index === i) {
				button.classList.remove("btn-light");
				button.classList.add("btn-info", "active");
				setPageOptions({ pageNumber: i + 1, pageSize: 5 });
			} else {
				button.classList.remove("btn-info", "active");
				button.classList.add("btn-light");
			}
		});
	};

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
			<div className="border backgroundWhite">
				<div className="row">
					<div className="col-12">
						<OrderList orderList={data?.apiResponse?.result} />
					</div>
					<div className="col-12">
						<div className="btn-group float-end mt-3">
							<>
								{pageList().map((i) => {
									return (
										<button
											key={i}
											className={`btn page ${
												i === 0 ? "btn-info active" : "btn-light"
											}`}
											onClick={() => handlePagination(i)}
										>
											{i + 1}
										</button>
									);
								})}
							</>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default withManagerAuth(AllOrders);
