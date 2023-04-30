import { useDispatch, useSelector } from "react-redux";
import { withAuth } from "../HOC";
import { apiResponse, cartItemModel } from "../Interfaces";
import { RootState } from "../Storage/Redux/store";
import { useNavigate } from "react-router-dom";
import { MainLoader, MiniLoader } from "../Components/Pages/Common";
import {
	removeFromCart,
	updateQuantity,
} from "../Storage/Redux/shoppingCartSlice";
import {
	useAddCouponToShoppingCartMutation,
	useRemoveCouponFromShoppingCartMutation,
	useUpdateShoppingCartMutation,
} from "../Apis/shoppingCartApi";
import userModel from "../Interfaces/userModel";
import SD from "../Utility/SD";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { inputHelper, toastNotify } from "../Helper";

function ShoppingCart() {
	const shoppingCartFromStore = useSelector(
		(state: RootState) => state.shoppingCartStore ?? []
	);
	const couponData = {
		coupon: shoppingCartFromStore.coupon?.name,
	};
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [addCouponToCart] = useAddCouponToShoppingCartMutation();
	const [removeCouponFromCart] = useRemoveCouponFromShoppingCartMutation();
	const [updateShoppingCart] = useUpdateShoppingCartMutation();
	const [loading, setLoading] = useState(false);
	const userData: userModel = useSelector(
		(state: RootState) => state.userStore ?? []
	);

	const handleQuantity = async (
		updateQuantityBy: number,
		cartItem: cartItemModel
	) => {
		if (
			(updateQuantityBy === -1 && cartItem.quantity === 1) ||
			updateQuantityBy === 0
		) {
			await updateShoppingCart({
				userId: userData.id,
				menuItemId: cartItem.menuItem.id,
				updateQuantityBy: 0,
			});
			dispatch(removeFromCart({ cartItem, quantity: 0 }));
		} else {
			await updateShoppingCart({
				userId: userData.id,
				menuItemId: cartItem.menuItem.id,
				updateQuantityBy: updateQuantityBy,
			});
			dispatch(
				updateQuantity({
					cartItem,
					quantity: cartItem?.quantity! + updateQuantityBy,
				})
			);
		}
	};

	const [couponInput, setCouponInput] = useState(couponData);
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const tempData = inputHelper(e, couponInput);
		setCouponInput(tempData);
	};

	useEffect(() => {
		setCouponInput({
			coupon: shoppingCartFromStore.coupon?.name,
		});
	}, [shoppingCartFromStore]);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		const response: apiResponse = await addCouponToCart({
			userId: userData.id,
			coupon: couponInput.coupon,
		});

		if (response.data?.isSuccess) {
			toastNotify("Coupon added successfully", "success");
		} else {
			toastNotify(response.data?.errorMessages[0], "error");
		}

		setLoading(false);
	};

	const handleDeleteCoupon = async () => {
		const response: apiResponse = await removeCouponFromCart(userData.id);

		if (response.data?.isSuccess) {
			toastNotify("Coupon removed successfully", "success");
			setCouponInput({
				coupon: "",
			});
		} else {
			toastNotify(response.data?.errorMessages[0], "error");
		}
	};

	if (!shoppingCartFromStore) {
		return <MainLoader />;
	}
	return (
		<div className="backgroundWhite">
			<div className="container">
				{shoppingCartFromStore?.cartItems?.length! > 0 && (
					<div className="card">
						<div className="card-header bg-dark text-light m-0 row container">
							<div className="col-6">
								<i className="bi bi-cart"></i> &nbsp; Shopping Cart
							</div>
							<div className="col-6 text-end">
								<a
									className="btn btn-outline-info btn-sm"
									onClick={() => navigate("/")}
								>
									Continue Shopping
								</a>
							</div>
						</div>
						<div className="card-body">
							{shoppingCartFromStore.cartItems?.map(
								(cartItem: cartItemModel, index: number) => {
									return (
										<div className="row" key={index}>
											<div className="d-none d-lg-block col-lg-2 text-center">
												<img
													src={cartItem.menuItem.image}
													width="130"
													height="130"
													alt={cartItem.menuItem.name}
													className="rounded py-2"
												/>
											</div>
											<div className="col-12 text-sm-center col-lg-5 text-lg-start">
												<h4>
													<strong>{cartItem.menuItem.name}</strong>
												</h4>
												<small>
													{SD.convertToRawHtml(cartItem.menuItem.description)}
												</small>
											</div>
											<div className="col-12 text-sm-center col-lg-5 text-lg-start row">
												<div
													className="col-4 text-md-end"
													style={{ paddingTop: "5px" }}
												>
													<h6>
														<strong>
															$ {cartItem.menuItem.price.toFixed(2)}{" "}
															<span className="text-muted">x</span>{" "}
															{cartItem.quantity}
														</strong>
													</h6>
												</div>
												<div className="col-6 col-sm-4 col-lg-6">
													<div className="float-end mx-1">
														<button
															className="btn btn-primary"
															onClick={() => handleQuantity(+1, cartItem)}
														>
															<i className="bi bi-plus"></i>
														</button>
													</div>
													<div className="float-end mx-1">
														<button
															className="btn btn-danger"
															onClick={() => handleQuantity(-1, cartItem)}
														>
															<i className="bi bi-dash"></i>
														</button>
													</div>
												</div>
												<div className="col-2 col-sm-4 col-lg-2 text-end">
													<div className="mx-1">
														<button
															className="btn btn-outline-danger"
															onClick={() => handleQuantity(0, cartItem)}
														>
															<i className="bi bi-trash"></i>
														</button>
													</div>
												</div>
											</div>
											<hr />
										</div>
									);
								}
							)}
							<div className="row">
								<div className="col-12 col-md-5">
									<div className="row">
										<div className="col-12">
											<form onSubmit={handleSubmit} method="post">
												<div className="form-group row">
													<div className="col-7">
														<input
															type="text"
															name="coupon"
															className="form-control"
															placeholder="coupon code..."
															disabled={shoppingCartFromStore.coupon !== null}
															defaultValue={couponInput.coupon}
															onChange={handleChange}
														/>
													</div>
													<div className="col-5">
														{shoppingCartFromStore.coupon === null && (
															<button
																type="submit"
																className="btn btn-sm form-control btn-outline-success"
																disabled={loading}
															>
																{loading && <MiniLoader />}Apply Coupon
															</button>
														)}
														{shoppingCartFromStore.coupon !== null && (
															<button
																onClick={handleDeleteCoupon}
																type="reset"
																className="btn btn-sm form-control btn-outline-danger"
															>
																Delete Coupon
															</button>
														)}
													</div>
												</div>
											</form>
										</div>
									</div>
								</div>

								<div className="col-12 col-md-6 offset-md-1 col-lg-4 offset-lg-3 pr-4">
									<ul className="list-group pt-1 pt-md-0">
										<li className="list-group-item d-flex justify-content-between bg-light">
											<span className="text-info">Total (USD)</span>
											<strong className="text-info">
												${shoppingCartFromStore.cartTotal?.toFixed(2)}
											</strong>
										</li>
									</ul>
								</div>
							</div>
						</div>
						<div className="card-footer">
							<div className="col-12 col-lg-4 offset-lg-4 offset-lg-8 col-md-6 offset-md-6">
								<a
									onClick={() => navigate("/order/orderSummary")}
									className="btn btn-success form-control"
								>
									Summary
								</a>
							</div>
						</div>
					</div>
				)}
				{!shoppingCartFromStore?.cartItems?.length && (
					<p>Shopping cart is empty</p>
				)}
			</div>
		</div>
	);
}

export default withAuth(ShoppingCart);
