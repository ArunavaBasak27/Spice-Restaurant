import { useDispatch, useSelector } from "react-redux";
import { withAuth } from "../HOC";
import { cartItemModel } from "../Interfaces";
import { RootState } from "../Storage/Redux/store";
import { useNavigate } from "react-router-dom";
import { MainLoader } from "../Components/Pages/Common";
import {
	removeFromCart,
	updateQuantity,
} from "../Storage/Redux/shoppingCartSlice";
import { useUpdateShoppingCartMutation } from "../Apis/shoppingCartApi";
import userModel from "../Interfaces/userModel";

function ShoppingCart() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const shoppingCartFromStore = useSelector(
		(state: RootState) => state.shoppingCartStore ?? []
	);
	const [updateShoppingCart] = useUpdateShoppingCartMutation();
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
	if (!shoppingCartFromStore) {
		return <MainLoader />;
	}
	return (
		<div className="backgroundWhite">
			<div className="container">
				{shoppingCartFromStore?.cartItems?.length! > 0 ? (
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
						<div className="card-body pb-0">
							{shoppingCartFromStore.cartItems?.map(
								(cartItem: cartItemModel, index: number) => {
									return (
										<div className="row" key={index}>
											<div className="d-none d-lg-block col-lg-2 text-center">
												<img
													src={cartItem.menuItem.image}
													width="120"
													height="80"
													alt={cartItem.menuItem.name}
													className="rounded py-2"
												/>
											</div>
											<div className="col-12 text-sm col-lg-5 text-lg-left">
												<h4>
													<strong>{cartItem.menuItem.name}</strong>
												</h4>
												<small
													dangerouslySetInnerHTML={{
														__html: cartItem.menuItem.description,
													}}
												></small>
											</div>
											<div className="col-12 text-sm col-lg-5 text-lg-left row">
												<div className="col-4 text-md-end">
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
						</div>

						<div className="row p-2">
							<div className="col-12 col-md-5">
								<div className="row">
									<div className="col-7">
										<input
											type="text"
											className="form-control"
											placeholder="coupon code..."
										/>
									</div>
									<div className="col-5">
										<button className="btn btn-sm form-control btn-outline-success">
											Apply Coupon
										</button>
									</div>
								</div>
							</div>

							<div className="col-12 col-md-6 offset-md-1 col-lg-4 offset-lg-3 pr-4">
								<ul className="list-group">
									<li className="list-group-item d-flex justify-content-between bg-light">
										<span className="text-info">Total (USD)</span>
										<strong className="text-info">$</strong>
									</li>
								</ul>
							</div>
						</div>
					</div>
				) : (
					<p>Shopping cart is empty</p>
				)}
			</div>
		</div>
	);
}

export default withAuth(ShoppingCart);
