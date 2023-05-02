import { useNavigate } from "react-router-dom";
import {
	useDeleteMenuItemMutation,
	useGetMenuItemsQuery,
} from "../../Apis/menuItemApi";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setMenuItem } from "../../Storage/Redux/menuItemSlice";
import { menuItemModel } from "../../Interfaces";
import { MainLoader } from "../../Components/Pages/Common";
import { toast } from "react-toastify";
import { withAdminAuth } from "../../HOC";

const MenuItemList = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { data, isLoading } = useGetMenuItemsQuery(null);
	const [deleteMenuItem] = useDeleteMenuItemMutation();
	useEffect(() => {
		if (!isLoading) {
			dispatch(setMenuItem(data?.result));
		}
	}, [isLoading]);

	if (isLoading) {
		return <MainLoader />;
	}
	const handleMenuItemDelete = (id: number) => {
		toast.promise(
			deleteMenuItem(id),
			{
				pending: "Processing your request",
				success: "Menu Item deleted successfully 👌",
				error: "Error encountered 🤯",
			},
			{ theme: "dark" }
		);
	};
	return (
		<div className="border backgroundWhite">
			<div className="row">
				<div className="col-6">
					<h2 className="text-info">Menu Item List</h2>
				</div>
				<div className="col-6 text-end">
					<a
						onClick={() => navigate("/createMenuItem")}
						className="btn btn-info"
					>
						<i className="bi bi-plus"></i>Create Menu Item
					</a>
				</div>
			</div>
			<br />

			<div className="table-responsive-sm">
				<table className="table table-striped-border">
					<thead className="table-secondary">
						<tr>
							<th>Name</th>
							<th>Price</th>
							<th>Category</th>
							<th>Sub Category</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{data?.result.length > 0 &&
							data?.result.map((menuItem: menuItemModel) => {
								return (
									<tr key={menuItem.id}>
										<td>{menuItem.name}</td>
										<td>{menuItem.price}</td>
										<td>{menuItem.category?.name}</td>
										<td>{menuItem.subCategory?.name}</td>
										<td style={{ width: "140px" }}>
											<div className="btn-group" role="group">
												<button
													onClick={() =>
														navigate("/updateMenuItem/" + menuItem.id)
													}
													className="btn btn-primary"
												>
													<i className="bi bi-pencil"></i>
												</button>
												<button
													onClick={() =>
														navigate("/menuItemDetails/" + menuItem.id)
													}
													className="btn btn-success"
												>
													<i className="bi bi-list-ul"></i>
												</button>
												<button
													className="btn btn-danger"
													onClick={() => handleMenuItemDelete(menuItem.id)}
												>
													<i className="bi bi-trash-fill"></i>
												</button>
											</div>
										</td>
									</tr>
								);
							})}
					</tbody>
				</table>
				{data.result.length == 0 && <div>No menu items exists....</div>}
			</div>
		</div>
	);
};

export default withAdminAuth(MenuItemList);
