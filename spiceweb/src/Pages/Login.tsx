import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { inputHelper, toastNotify } from "../Helper";
import { useLoginUserMutation } from "../Apis/userApi";
import { apiResponse } from "../Interfaces";
import SD from "../Utility/SD";
import { MainLoader, MiniLoader } from "../Components/Pages/Common";
import jwt_decode from "jwt-decode";
import userModel from "../Interfaces/userModel";
import { useDispatch } from "react-redux";
import { setLoggedInUser } from "../Storage/Redux/userSlice";

const Login = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [loginUser] = useLoginUserMutation();
	const [loading, setLoading] = useState(false);
	const [userInput, setUserInput] = useState({
		userName: "",
		password: "",
	});

	const handleUserInput = (e: ChangeEvent<HTMLInputElement>) => {
		const tempData = inputHelper(e, userInput);
		setUserInput(tempData);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		const response: apiResponse = await loginUser(userInput);

		if (response.data?.isSuccess) {
			setLoading(false);
			const { token } = response.data.result;
			const { fullName, id, email, role }: userModel = jwt_decode(token);
			dispatch(setLoggedInUser({ fullName, id, email, role }));
			toastNotify(`Welcome ${fullName} !`, "success");
			localStorage.setItem(SD.token, token);
			navigate("/");
		} else {
			setLoading(false);
			toastNotify(response.data?.errorMessages[0], "error");
		}

		console.log(response.data);
		setLoading(false);
	};

	return (
		<div className="container">
			{loading && <MainLoader />}
			<h2 className="text-info">Login</h2>
			<br />
			<form method="post" onSubmit={handleSubmit}>
				<div className="border backgroundWhite">
					<div className="form-froup row mt-2">
						<div className="col-12 col-md-2">
							<label htmlFor="userName" className="col-form-label">
								User Name
							</label>
						</div>
						<div className="col-12 col-md-5">
							<input
								type="text"
								name="userName"
								className="form-control"
								value={userInput.userName}
								onChange={handleUserInput}
							/>
						</div>
					</div>

					<div className="form-froup row mt-2">
						<div className="col-12 col-md-2">
							<label htmlFor="password" className="col-form-label">
								Password
							</label>
						</div>
						<div className="col-12 col-md-5">
							<input
								type="password"
								name="password"
								className="form-control"
								value={userInput.password}
								onChange={handleUserInput}
							/>
						</div>
					</div>

					<div className="form-froup row mt-2">
						<div className="col-12 col-md-5 offset-md-2">
							<div className="row">
								<div className="col-12 col-md-6 pt-2">
									<button
										type="submit"
										className="btn btn-primary form-control"
										disabled={loading}
									>
										{loading && <MiniLoader />} Login
									</button>
								</div>
								<div className="col-12 col-md-6 pt-2">
									<a
										onClick={() => navigate("/")}
										className="btn btn-success form-control"
									>
										Back To Home
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
};

export default Login;
