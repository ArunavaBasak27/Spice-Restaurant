import SD from "../Utility/SD";

const withPaymentAuth = (WrappedComponent: any) => {
	return (props: any) => {
		const accessToken = localStorage.getItem(SD.token);

		if (!accessToken) {
			window.location.replace("/login");
		} else {
			if (!props) {
				window.location.replace("/accessDenied");
			}
		}

		return <WrappedComponent {...props} />;
	};
};

export default withPaymentAuth;
