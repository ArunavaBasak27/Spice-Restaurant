import { useNavigate } from "react-router-dom";
import SD from "../Utility/SD";
import { ChangeEvent, FormEvent, useState } from "react";
import { apiResponse } from "../Interfaces";
import { inputHelper, toastNotify } from "../Helper";
import { useRegisterUserMutation } from "../Apis/userApi";
import { useSelector } from "react-redux";
import userModel from "../Interfaces/userModel";
import { RootState } from "../Storage/Redux/store";
import { MainLoader } from "../Components/Pages/Common";

const Register = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [userInput, setUserInput] = useState({
		userName: "",
		name: "",
		password: "",
		confirmPassword: "",
		role: "",
		streetAddress: "",
		city: "",
		state: "",
		postalCode: "",
		phoneNumber: "",
	});
	const handleUserInput = (e: ChangeEvent<HTMLInputElement>) => {
		const tempData = inputHelper(e, userInput);
		setUserInput(tempData);
	};
	const [registerUser] = useRegisterUserMutation();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		const response: apiResponse = await registerUser(userInput);

		if (response.data?.isSuccess) {
			setLoading(false);
			toastNotify(`User registered successfully`, "success");
			navigate("/login");
		} else {
			setLoading(false);
			toastNotify(`Error while registering`, "error");
		}
	};
	const userData: userModel = useSelector(
		(state: RootState) => state.userStore
	);

	return (
		<div>
			<h2 className="text-info">Create New Account</h2>
			<br />
			{loading && <MainLoader />}
			<form method="post" onSubmit={handleSubmit}>
				<div className="border backgroundWhite">
					<div className="form-froup row">
						<div className="col-2">
							<label htmlFor="name" className="col-form-label">
								Name
							</label>
						</div>
						<div className="col-5">
							<input
								type="text"
								name="name"
								className="form-control"
								onChange={handleUserInput}
								value={userInput.name}
							/>
						</div>
					</div>
					<div className="form-froup row mt-2">
						<div className="col-2">
							<label htmlFor="userName" className="col-form-label">
								Email
							</label>
						</div>
						<div className="col-5">
							<input
								type="text"
								name="userName"
								className="form-control"
								onChange={handleUserInput}
								value={userInput.userName}
							/>
						</div>
					</div>
					<div className="form-froup row mt-2">
						<div className="col-2">
							<label htmlFor="phoneNumber" className="col-form-label">
								Phone Number
							</label>
						</div>
						<div className="col-5">
							<input
								type="text"
								name="phoneNumber"
								className="form-control"
								onChange={handleUserInput}
								value={userInput.phoneNumber}
							/>
						</div>
					</div>
					<div className="form-froup row mt-2">
						<div className="col-2">
							<label htmlFor="city" className="col-form-label">
								City
							</label>
						</div>
						<div className="col-5">
							<input
								type="text"
								name="city"
								className="form-control"
								onChange={handleUserInput}
								value={userInput.city}
							/>
						</div>
					</div>
					<div className="form-froup row mt-2">
						<div className="col-2">
							<label htmlFor="state" className="col-form-label">
								State
							</label>
						</div>
						<div className="col-5">
							<input
								type="text"
								name="state"
								className="form-control"
								onChange={handleUserInput}
								value={userInput.state}
							/>
						</div>
					</div>
					<div className="form-froup row mt-2">
						<div className="col-2">
							<label htmlFor="postalCode" className="col-form-label">
								Postal Code
							</label>
						</div>
						<div className="col-5">
							<input
								type="text"
								name="postalCode"
								className="form-control"
								onChange={handleUserInput}
								value={userInput.postalCode}
							/>
						</div>
					</div>
					<div className="form-froup row mt-2">
						<div className="col-2">
							<label htmlFor="password" className="col-form-label">
								Password
							</label>
						</div>
						<div className="col-5">
							<input
								type="password"
								name="password"
								className="form-control"
								onChange={handleUserInput}
								value={userInput.password}
							/>
						</div>
					</div>
					<div className="form-froup row mt-2">
						<div className="col-2">
							<label htmlFor="confirmPassword" className="col-form-label">
								Confirm Password
							</label>
						</div>
						<div className="col-5">
							<input
								type="password"
								name="confirmPassword"
								className="form-control"
								onChange={handleUserInput}
								value={userInput.confirmPassword}
							/>
						</div>
					</div>
					{userData.role === SD.Roles.ADMIN && (
						<div className="form-froup row mt-2">
							<div className="col-2"></div>
							<div className="col-5">
								<input
									type="radio"
									name="role"
									value={SD.Roles.FRONT_DESK_USER}
									onChange={handleUserInput}
								/>{" "}
								{SD.Roles.FRONT_DESK_USER} &nbsp;
								<input
									type="radio"
									name="role"
									value={SD.Roles.KITCHEN_USER}
									onChange={handleUserInput}
								/>{" "}
								{SD.Roles.KITCHEN_USER} &nbsp;
								<input
									type="radio"
									name="role"
									value={SD.Roles.MANAGER_USER}
									onChange={handleUserInput}
								/>{" "}
								{SD.Roles.MANAGER_USER} &nbsp;
							</div>
						</div>
					)}

					<div className="form-froup row mt-2">
						<div className="col-5 offset-2">
							<div className="row">
								<div className="col-6">
									<button
										type="submit"
										className="btn btn-primary form-control"
									>
										Register
									</button>
								</div>
								<div className="col-6">
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

export default Register;
