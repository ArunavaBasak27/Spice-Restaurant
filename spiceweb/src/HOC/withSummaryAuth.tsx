import { useSelector } from "react-redux";
import SD from "../Utility/SD";
import { RootState } from "../Storage/Redux/store";

const withSummaryAuth = (WrappedComponent: any) => {
	return (props: any) => {
		const accessToken = localStorage.getItem(SD.token);

		if (accessToken) {
			var shoppingCartFromStore = useSelector(
				(state: RootState) => state.shoppingCartStore
			);

			if (shoppingCartFromStore?.cartItems?.length === 0) {
				window.location.replace("/shoppingCart");
			}
		}

		if (!accessToken) {
			window.location.replace("/login");
		}

		return <WrappedComponent {...props} />;
	};
};

export default withSummaryAuth;
