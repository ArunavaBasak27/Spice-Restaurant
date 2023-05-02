import jwtDecode from "jwt-decode";
import SD from "../Utility/SD";

const withChefAuth = (WrappedComponent: any) => {
	return (props: any) => {
		const accessToken = localStorage.getItem(SD.token);

		if (accessToken) {
			const decode: {
				role: string;
			} = jwtDecode(accessToken);

			if (
				decode.role === SD.Roles.CUSTOMER ||
				decode.role === SD.Roles.FRONT_DESK_USER
			) {
				window.location.replace("/accessDenied");
				return null;
			}
		}

		if (!accessToken) {
			window.location.replace("/login");
		}
		return <WrappedComponent {...props} />;
	};
};

export default withChefAuth;
