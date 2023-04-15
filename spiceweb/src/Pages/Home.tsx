import { AllMenuItems, CouponCarousel } from "../Components/Pages/Home";

const Home = () => {
	return (
		<div className="container">
			<CouponCarousel />
			<br />
			<br />

			<div className="backgroundWhite container">
				<div className="row">
					<AllMenuItems />
				</div>
			</div>
		</div>
	);
};

export default Home;
