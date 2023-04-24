import { useLocation } from "react-router-dom";
import SD from "../Utility/SD";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentForm } from "../Components/Pages/Payment";

const Payment = () => {
	const {
		state: { apiResult, obj },
	} = useLocation();
	console.log(apiResult);
	console.log(obj);
	const stripePromise = loadStripe(SD.publishableKey);

	const options = {
		// passing the client secret obtained from the server
		clientSecret: apiResult.clientSecret,
	};

	return (
		<Elements stripe={stripePromise} options={options}>
			<PaymentForm />
		</Elements>
	);
};

export default Payment;
