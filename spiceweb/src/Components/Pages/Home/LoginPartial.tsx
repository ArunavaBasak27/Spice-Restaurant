import { useNavigate } from "react-router-dom";
import userModel from "../../../Interfaces/userModel";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Storage/Redux/store";
import SD from "../../../Utility/SD";
import {
	emptyUserState,
	setLoggedInUser,
} from "../../../Storage/Redux/userSlice";

const LoginPartial = () => {
	const navigate = useNavigate();
	const userData: userModel = useSelector(
		(state: RootState) => state.userStore
	);
	const dispatch = useDispatch();
	const handleLogout = () => {
		localStorage.removeItem(SD.token);
		dispatch(setLoggedInUser({ ...emptyUserState }));
		navigate("/");
	};
	return (
		<>
			{!userData.id ? (
				<ul className="navbar-nav" style={{ cursor: "pointer" }}>
					<li className="nav-item">
						<a
							className="nav-link text-white"
							onClick={() => navigate("/register")}
						>
							Register
						</a>
					</li>
					<li className="nav-item">
						<a
							className="nav-link text-white"
							onClick={() => navigate("/login")}
						>
							Login
						</a>
					</li>
				</ul>
			) : (
				<ul className="navbar-nav" style={{ cursor: "pointer" }}>
					<li className="nav-item">
						<a className="nav-link text-white">
							<i className="bi bi-person" />
							&nbsp; Welcome &nbsp;
							{userData.fullName} !&nbsp;
						</a>
					</li>
					<li className="nav-item">
						<a className="nav-link text-white" onClick={handleLogout}>
							Logout
						</a>
					</li>
				</ul>
			)}
		</>
	);
};

export default LoginPartial;
