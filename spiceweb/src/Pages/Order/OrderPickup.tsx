import { OrderPickupList } from "../../Components/Pages/Order";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useGetAllOrdersQuery } from "../../Apis/orderApi";
import { MainLoader } from "../../Components/Pages/Common";
import { withFrontDeskAuth } from "../../HOC";

const OrderPickup = () => {
	const [totalRecords, setTotalRecords] = useState();
	const [pageOptions, setPageOptions] = useState({
		pageNumber: 1,
		pageSize: 5,
	});
	const [currentPageSize, setCurrentPageSize] = useState(pageOptions.pageSize);

	const { data, isLoading } = useGetAllOrdersQuery({
		userId: "",
		pageSize: 10,
		pageNumber: 1,
	});

	useEffect(() => {
		if (data) {
			const { TotalRecords } = JSON.parse(data?.totalRecords!);
			setTotalRecords(TotalRecords);
		}
	}, [data]);

	const pageList = () => {
		var pages = [];
		for (let i = 0; i < totalRecords! / currentPageSize; i++) {
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
				setPageOptions({ pageNumber: i + 1, pageSize: currentPageSize });
			} else {
				button.classList.remove("btn-info", "active");
				button.classList.add("btn-light");
			}
		});
	};

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
				<div className="row">
					<div className="col-12">
						<OrderPickupList orderList={data?.apiResponse?.result} />
					</div>
					<div className="col-12">
						<div className="row">
							<div className="col-6">
								<select
									name=""
									id=""
									className="form-select"
									onChange={(e: ChangeEvent<HTMLSelectElement>) => {
										setPageOptions({
											pageSize: Number(e.target.value),
											pageNumber: 1,
										});
										setCurrentPageSize(Number(e.target.value));
									}}
									style={{ width: "80px" }}
								>
									<option value="5">5</option>
									<option value="10">10</option>
									<option value="15">15</option>
									<option value="20">20</option>
								</select>
								<div className="float-end">{getPageDetails()}</div>
							</div>
							<div className="col-6 text-end">
								<div className="btn-group mt-3">
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
				</div>
			</div>
		</>
	);
};
export default withFrontDeskAuth(OrderPickup);
