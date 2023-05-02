import { useEffect } from "react";
import {
	useDeleteCouponMutation,
	useGetCouponsQuery,
} from "../../Apis/couponApi";
import { useDispatch } from "react-redux";
import { setCoupon } from "../../Storage/Redux/couponSlice";
import { MainLoader } from "../../Components/Pages/Common";
import { couponModel } from "../../Interfaces";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SD from "../../Utility/SD";
import { withAdminAuth } from "../../HOC";

const CouponList = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [deleteCoupon] = useDeleteCouponMutation();
	const { data, isLoading } = useGetCouponsQuery(null);
	useEffect(() => {
		if (!isLoading) {
			dispatch(setCoupon(data.result));
		}
	}, [isLoading]);

	if (isLoading) {
		return <MainLoader />;
	}

	const handleDelete = (id: number) => {
		toast.promise(
			deleteCoupon(id),
			{
				pending: "Processing your request",
				success: "Coupon deleted successfully 👌",
				error: "Error encountered 🤯",
			},
			{ theme: "dark" }
		);
	};

	return (
		<div className="border backgroundWhite">
			<div className="row">
				<div className="col-6">
					<h2 className="text-info">Coupon List</h2>
				</div>
				<div className="col-6 text-end">
					<a className="btn btn-info" onClick={() => navigate("/createCoupon")}>
						<i className="bi bi-plus"></i>Create Coupon
					</a>
				</div>
			</div>
			<br />
			<div className="table-responsive-sm">
				{data.result.length > 0 && (
					<table className="table table-striped-border">
						<thead className="table-secondary">
							<tr>
								<th>Name</th>
								<th>Type</th>
								<th>Discount</th>
								<th>Minimum Amount</th>
								<th>Is Active</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{data.result.map((coupon: couponModel, index: number) => {
								return (
									<tr key={index}>
										<td>{coupon.name}</td>
										<td>{SD.couponType[coupon.couponType]}</td>
										<td>{coupon.discount}</td>
										<td>{coupon.minimumAmount}</td>
										<td>{coupon.isActive ? "Active" : "Inactive"}</td>
										<td style={{ width: "150px" }}>
											<div className="btn-group" role="group">
												<button
													className="btn btn-success"
													onClick={() => navigate("/updateCoupon/" + coupon.id)}
												>
													<i className="bi bi-pencil"></i>
												</button>
												<button
													className="btn btn-danger"
													onClick={() => handleDelete(coupon.id)}
												>
													<i className="bi bi-trash-fill"></i>
												</button>
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</div>

			{data.result.length === 0 && <p>No coupon exists....</p>}
		</div>
	);
};

export default withAdminAuth(CouponList);
