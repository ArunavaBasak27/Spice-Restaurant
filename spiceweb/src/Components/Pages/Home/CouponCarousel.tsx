import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetCouponsQuery } from "../../../Apis/couponApi";
import { setCoupon } from "../../../Storage/Redux/couponSlice";
import { couponModel } from "../../../Interfaces";

const CouponCarousel = () => {
	const { data, isLoading } = useGetCouponsQuery(null);
	const dispatch = useDispatch();
	useEffect(() => {
		if (!isLoading) {
			dispatch(setCoupon(data.result));
		}
	}, [isLoading]);
	return (
		<div className="border">
			<div
				className="carousel slide carousel-fade"
				data-bs-ride="carousel"
				data-bs-interval="2500"
			>
				<div className="carousel-inner">
					{data?.result.map((coupon: couponModel, index: number) => {
						if (coupon.isActive) {
							return (
								<div
									key={index}
									className={`carousel-item ${index === 0 ? "active" : ""} `}
								>
									<img
										src={`data:image/png;base64,` + coupon.picture}
										alt=""
										height="50px"
										className="d-block w-100"
									/>
								</div>
							);
						}
					})}
				</div>
			</div>
		</div>
	);
};

export default CouponCarousel;
