import { useEffect } from "react";
import { Footer, Header } from "../Components/Layout";
import {
	CategoryList,
	CategoryUpsert,
	CouponList,
	CouponUpsert,
	Home,
	Login,
	MenuItemDetails,
	MenuItemList,
	MenuItemUpsert,
	NotFound,
	Register,
	ShoppingCart,
	SubCategoryList,
	SubCategoryUpsert,
} from "../Pages";
import { Route, Routes } from "react-router-dom";
import SD from "../Utility/SD";
import userModel from "../Interfaces/userModel";
import { setLoggedInUser } from "../Storage/Redux/userSlice";
import { useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";
function App() {
	const dispatch = useDispatch();
	useEffect(() => {
		const token = localStorage.getItem(SD.token);
		if (token) {
			const { fullName, id, email, role }: userModel = jwtDecode(token);
			dispatch(setLoggedInUser({ fullName, id, email, role }));
		}
	}, []);

	return (
		<>
			<Header />
			<div className="py-5 px-md-5">
				<Routes>
					<Route path="/" element={<Home />} />

					<Route path="/categoryList" element={<CategoryList />} />
					<Route path="/createCategory" element={<CategoryUpsert />} />
					<Route path="/updateCategory/:id" element={<CategoryUpsert />} />

					<Route path="/subCategoryList" element={<SubCategoryList />} />
					<Route path="/createSubCategory" element={<SubCategoryUpsert />} />
					<Route
						path="/updateSubCategory/:id"
						element={<SubCategoryUpsert />}
					/>

					<Route path="/menuItemList" element={<MenuItemList />} />
					<Route path="/createMenuItem" element={<MenuItemUpsert />} />
					<Route path="/updateMenuItem/:id" element={<MenuItemUpsert />} />
					<Route path="/menuItemDetails/:id" element={<MenuItemDetails />} />

					<Route path="/couponList" element={<CouponList />} />
					<Route path="/createCoupon" element={<CouponUpsert />} />
					<Route path="/updateCoupon/:id" element={<CouponUpsert />} />

					<Route path="/shoppingCart/:id" element={<ShoppingCart />} />

					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />

					<Route path="*" element={<NotFound />} />
				</Routes>
			</div>
			<Footer />
		</>
	);
}

export default App;
