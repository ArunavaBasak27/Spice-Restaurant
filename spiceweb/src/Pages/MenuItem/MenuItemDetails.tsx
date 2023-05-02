import { useNavigate, useParams } from "react-router-dom";
import { useGetMenuItemByIdQuery } from "../../Apis/menuItemApi";
import { MainLoader, MiniLoader } from "../../Components/Pages/Common";
import { useState } from "react";
import { useUpdateShoppingCartMutation } from "../../Apis/shoppingCartApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Storage/Redux/store";
import { apiResponse } from "../../Interfaces";
import { toastNotify } from "../../Helper";
import { withAdminAuth } from "../../HOC";

const MenuItemDetails = () => {
	const { id } = useParams();
	const { data, isLoading } = useGetMenuItemByIdQuery(id, {
		skip: id === undefined,
	});
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [quantity, setQuantity] = useState(1);
	const [updateShoppingCart] = useUpdateShoppingCartMutation();
	const [isAddingToCart, setIsAddingToCart] = useState(false);

	const handleQuantity = (counter: number) => {
		let newQuantity = quantity + counter;
		if (newQuantity > 0) {
			setQuantity(quantity + counter);
		}
		return;
	};

	const userData = useSelector((state: RootState) => state.userStore);

	const handleAddToCart = async (menuItemId: number) => {
		setIsAddingToCart(true);

		const response: apiResponse = await updateShoppingCart({
			menuItemId: menuItemId,
			updateQuantityBy: quantity,
			userId: userData.id,
		});
		if (response.data?.isSuccess) {
			toastNotify("Item added to cart successfully", "success");
			navigate("/shoppingCart");
		} else {
			toastNotify(response.data?.errorMessages[0], "error");
		}
		setIsAddingToCart(false);
	};

	return (
		<div className="container pt-4 pt-md-5">
			{isLoading && <MainLoader />}
			<div className="row d-md-none d-block">
				<img
					src={data?.result?.image}
					width="100%"
					style={{ borderRadius: "50%" }}
					alt="No content"
				></img>
			</div>
			<div className="row pt-4">
				<div className="col-md-7 col-12">
					<h2 className="text-success text-center">{data?.result?.name}</h2>
					<div className="text-center">
						<span>
							<span
								className="badge text-bg-warning pt-2"
								style={{ height: "40px", fontSize: "20px" }}
							>
								{data?.result?.category.name}
							</span>
						</span>
						<span>
							<span
								className="badge text-bg-light text-danger pt-2"
								style={{ height: "40px", fontSize: "20px" }}
							>
								{data?.result?.subCategory.name}
							</span>
						</span>
					</div>
					<div
						style={{ fontSize: "20px" }}
						dangerouslySetInnerHTML={{ __html: data?.result?.description }}
						className="p-4"
					></div>
					<div className="text-center">
						<span className="h3">${data?.result?.price.toFixed(2)}</span>{" "}
						&nbsp;&nbsp;&nbsp;
						<span
							className="pb-2  p-3"
							style={{ border: "1px solid #333", borderRadius: "30px" }}
						>
							<i
								className="bi bi-dash p-1"
								style={{ fontSize: "25px", cursor: "pointer" }}
								onClick={() => handleQuantity(-1)}
							></i>
							<span className="h3 mt-3 px-3">{quantity}</span>
							<i
								className="bi bi-plus p-1"
								style={{ fontSize: "25px", cursor: "pointer" }}
								onClick={() => handleQuantity(+1)}
							></i>
						</span>
					</div>

					<div className="row p-4 ml-2">
						<div className="col-5">
							<button
								onClick={() => handleAddToCart(data?.result.id)}
								className="btn btn-success form-control"
							>
								Add to Cart
							</button>
						</div>

						<div className="col-5">
							<button
								className="btn btn-secondary form-control"
								onClick={() => navigate("/")}
							>
								Back to Home
							</button>
						</div>
					</div>
				</div>
				<div className="col-md-5 d-none d-md-block">
					<img
						src={data?.result?.image}
						width="99%"
						style={{ borderRadius: "50%" }}
						alt="No content"
					></img>
				</div>
			</div>
		</div>
	);
};
export default withAdminAuth(MenuItemDetails);
