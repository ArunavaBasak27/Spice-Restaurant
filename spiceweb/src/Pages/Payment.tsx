import { useLocation } from "react-router-dom";
import SD from "../Utility/SD";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentForm } from "../Components/Pages/Payment";
import { OrderConsolidated } from "../Components/Pages/Order";

const Payment = () => {
	const {
		state: { apiResult, orderData },
	} = useLocation();
	console.log(apiResult);
	console.log(orderData);
	const stripePromise = loadStripe(SD.publishableKey);

	const options = {
		// passing the client secret obtained from the server
		clientSecret: apiResult.clientSecret,
	};

	return (
		<Elements stripe={stripePromise} options={options}>
			<div className="container backgroundWhite m-5 p-5">
				<div className="row">
					<div className="col-md-7">
						<OrderConsolidated data={apiResult} orderData={orderData} />
					</div>
					<div className="col-md-4 offset-md-1 mt-2">
						<h3 className="text-success">Payment</h3>
						<div className="mt-5">
							<PaymentForm />
						</div>
					</div>
				</div>
			</div>
		</Elements>
	);
};

export default Payment;
