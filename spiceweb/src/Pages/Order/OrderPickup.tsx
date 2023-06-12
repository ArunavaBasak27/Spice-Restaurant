import { OrderList } from "../../Components/Pages/Order";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useGetAllOrdersQuery } from "../../Apis/orderApi";
import { MainLoader } from "../../Components/Pages/Common";
import { withFrontDeskAuth } from "../../HOC";
import SD from "../../Utility/SD";
import { inputHelper } from "../../Helper";
import { orderHeaderModel } from "../../Interfaces/orderHeaderModel";

const OrderPickup = () => {
	const [totalRecords, setTotalRecords] = useState();
	const [pageOptions, setPageOptions] = useState({
		pageNumber: 1,
		pageSize: 5,
	});
	const [currentPageSize, setCurrentPageSize] = useState(pageOptions.pageSize);
	const [apiFilters, setApiFilters] = useState({
		name: "",
		email: "",
		phoneNumber: "",
	});

	const [filters, setFilters] = useState({
		name: "",
		email: "",
		phoneNumber: "",
	});

	const { data, isLoading } = useGetAllOrdersQuery({
		userId: "",
		pageSize: currentPageSize,
		pageNumber: pageOptions.pageNumber,
		status: SD.StatusReady,
		...(apiFilters && {
			name: apiFilters.name,
			email: apiFilters.email,
			phoneNumber: apiFilters.phoneNumber,
		}),
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

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const tempData = inputHelper(e, filters);
		setFilters(tempData);
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setApiFilters({
			name: filters.name,
			email: filters.email,
			phoneNumber: filters.phoneNumber,
		});
		// console.log("first");
	};

	const handleReset = () => {
		setApiFilters({
			name: "",
			email: "",
			phoneNumber: "",
		});
	};

	if (isLoading) {
		return <MainLoader />;
	}
	return (
		<>
			<h2 className="text-info">Orders Ready for Pickup</h2>
			<div className="border backgroundWhite">
				<div className="container border border-secondary p-2">
					<form method="post" onSubmit={handleSubmit} onReset={handleReset}>
						<div className="row container">
							<div className="col-md-11 pb-2">
								<div className="row" style={{ paddingTop: "10px" }}>
									<div className="col-12 col-md-4">
										<input
											type="text"
											className="form-control"
											placeholder="Enter name..."
											name="name"
											onChange={handleChange}
										/>
									</div>
									<div className="col-12 col-md-4 mt-md-0 mt-2">
										<input
											type="text"
											className="form-control"
											placeholder="Enter email..."
											name="email"
											onChange={handleChange}
										/>
									</div>
									<div className="col-12 col-md-4 mt-md-0 mt-2">
										<input
											type="text"
											className="form-control"
											placeholder="Enter Phone number..."
											name="phoneNumber"
											onChange={handleChange}
										/>
									</div>
								</div>
							</div>
							<div className="col-md-1">
								<div className="row" style={{ paddingTop: "10px" }}>
									<div className="col-12">
										<button
											className={`btn ${
												data?.apiResponse?.result?.length === 0
													? "btn-success"
													: "btn-info"
											} form-control`}
											type={`${
												data?.apiResponse?.result?.length === 0
													? "reset"
													: "submit"
											}`}
										>
											{data?.apiResponse?.result?.length === 0 ? (
												<i className="bi bi-arrow-clockwise"></i>
											) : (
												<i className="bi bi-search"></i>
											)}
										</button>
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>

				<br />
				<div className="row">
					<div className="col-12">
						<OrderList orderList={data?.apiResponse?.result} />
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
