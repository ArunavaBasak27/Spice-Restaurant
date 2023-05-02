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

			if (!shoppingCartFromStore || !shoppingCartFromStore.cartItems) {
				window.location.replace("/");
			}
		}

		if (!accessToken) {
			window.location.replace("/login");
		}

		return <WrappedComponent {...props} />;
	};
};

export default withSummaryAuth;
