import { NavLink, useNavigate } from "react-router-dom";
import { LoginPartial } from "../Pages/Home";
import { useSelector } from "react-redux";
import userModel from "../../Interfaces/userModel";
import { RootState } from "../../Storage/Redux/store";
import SD from "../../Utility/SD";
let mild = require("../../Images/mild.png");
let spicy = require("../../Images/spicy.png");
let verySpicy = require("../../Images/verySpicy.png");
const Header = () => {
	const navigate = useNavigate();
	const userData: userModel = useSelector(
		(state: RootState) => state.userStore
	);

	return (
		<nav className="navbar navbar-dark navbar-expand-lg bg-dark text-white-50">
			<div className="container-fluid">
				<NavLink className="navbar-brand" to="/">
					&nbsp;
					<img src={mild} alt="mild" />
					<img src={spicy} alt="spicy" />
					<img src={verySpicy} alt="verySpicy" />
					&nbsp;Spice
				</NavLink>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarSupportedContent"
					aria-controls="navbarSupportedContent"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarSupportedContent">
					<ul className="navbar-nav me-auto mb-2 mb-lg-0">
						{(userData.role === SD.Roles.ADMIN ||
							userData.role === SD.Roles.MANAGER_USER) && (
							<>
								<li className="nav-item dropdown">
									<a
										className="nav-link dropdown-toggle"
										href="#"
										role="button"
										data-bs-toggle="dropdown"
										aria-expanded="false"
									>
										Content Management
									</a>
									<ul className="dropdown-menu">
										<li
											className="dropdown-item"
											onClick={() => navigate("/categoryList")}
										>
											Category
										</li>

										<li
											className="dropdown-item"
											onClick={() => navigate("/subCategoryList")}
										>
											Sub Category
										</li>

										<li
											className="dropdown-item"
											onClick={() => navigate("/menuItemList")}
										>
											Menu Item
										</li>

										<li>
											<hr className="dropdown-divider" />
										</li>

										<li
											className="dropdown-item"
											onClick={() => navigate("/couponList")}
										>
											Coupon
										</li>
									</ul>
								</li>

								<li className="nav-item dropdown">
									<a
										className="nav-link dropdown-toggle"
										href="#"
										role="button"
										data-bs-toggle="dropdown"
										aria-expanded="false"
									>
										User Management
									</a>
									<ul className="dropdown-menu">
										<li
											className="dropdown-item"
											onClick={() => navigate("/register")}
										>
											Register Employee
										</li>
									</ul>
								</li>
							</>
						)}

						<li className="nav-item">
							<NavLink className="nav-link active" aria-current="page" to="/">
								Home
							</NavLink>
						</li>
						<li className="nav-item">
							<NavLink
								className="nav-link active"
								aria-current="page"
								to="/shoppingCart"
							>
								<i className="bi bi-cart"></i>
							</NavLink>
						</li>
					</ul>
					<LoginPartial />
				</div>
			</div>
		</nav>
	);
};

export default Header;
