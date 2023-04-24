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
	OrderSummary,
	Register,
	ShoppingCart,
	SubCategoryList,
	SubCategoryUpsert,
} from "../Pages";
import { Route, Routes } from "react-router-dom";
import SD from "../Utility/SD";
import userModel from "../Interfaces/userModel";
import { setLoggedInUser } from "../Storage/Redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import { useGetShoppingCartQuery } from "../Apis/shoppingCartApi";
import { RootState } from "../Storage/Redux/store";
import { setShoppingCart } from "../Storage/Redux/shoppingCartSlice";
function App() {
	const dispatch = useDispatch();
	const userData: userModel = useSelector(
		(state: RootState) => state.userStore
	);

	const { data, isLoading } = useGetShoppingCartQuery(userData.id, {
		skip: userData?.id === "",
	});

	useEffect(() => {
		if (!isLoading) {
			dispatch(setShoppingCart(data?.result));
		}
	}, [isLoading, data?.result]);

	useEffect(() => {
		const token = localStorage.getItem(SD.token);
		if (token) {
			const { fullName, id, email, role }: userModel = jwtDecode(token);
			dispatch(setLoggedInUser({ fullName, id, email, role }));
		}
	}, []);
	console.log(data?.result);
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

					<Route path="/shoppingCart" element={<ShoppingCart />} />
					<Route path="/order/orderSummary" element={<OrderSummary />} />

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
