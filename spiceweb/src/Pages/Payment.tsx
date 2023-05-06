import { useLocation, useNavigate } from "react-router-dom";
import SD from "../Utility/SD";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentForm } from "../Components/Pages/Payment";
import { OrderConsolidated } from "../Components/Pages/Order";
import { useEffect, useState } from "react";
import AccessDenied from "./AccessDenied";

const Payment = () => {
	const [apiResult, setApiResult] = useState<any>();
	const [orderData, setOrderData] = useState<any>();
	const location = useLocation();
	useEffect(() => {
		if (location.state) {
			setApiResult(location.state?.apiResult);
			setOrderData(location.state?.orderData);
		}
	}, [location]);

	// const stripePromise = loadStripe(SD.publishableKey);
	const [stripePromise] = useState(() => loadStripe(SD.publishableKey));

	const options = {
		// passing the client secret obtained from the server
		clientSecret: apiResult?.clientSecret || "",
	};

	return (
		<>
			{orderData && apiResult && (
				<Elements stripe={stripePromise} options={options}>
					<div className="container backgroundWhite m-5 p-5">
						<div className="row">
							<div className="col-md-7">
								<OrderConsolidated data={apiResult} orderData={orderData} />
							</div>
							<div className="col-md-4 offset-md-1 mt-2">
								<h3 className="text-success">Payment</h3>
								<div className="mt-5">
									<PaymentForm data={apiResult} orderData={orderData} />
								</div>
							</div>
						</div>
					</div>
				</Elements>
			)}
			{(!orderData || !apiResult) && <AccessDenied />}
		</>
	);
};

export default Payment;
