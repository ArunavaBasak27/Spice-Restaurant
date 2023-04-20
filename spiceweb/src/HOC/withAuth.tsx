import SD from "../Utility/SD";

const withAuth = (WrappedComponent: any) => {
	return (props: any) => {
		const accessToken = localStorage.getItem(SD.token);
		if (!accessToken) {
			window.location.replace("/login");
		}
		return <WrappedComponent {...props} />;
	};
};

export default withAuth;
