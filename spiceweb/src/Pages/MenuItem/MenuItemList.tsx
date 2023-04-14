import { useNavigate } from "react-router-dom";
import { useGetMenuItemsQuery } from "../../Apis/menuItemApi";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setMenuItem } from "../../Storage/Redux/menuItemSlice";
import { menuItemModel } from "../../Interfaces";

const MenuItemList = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { data, isLoading } = useGetMenuItemsQuery(null);
	const [menuItems, setMenuItems] = useState([]);

	useEffect(() => {
		if (!isLoading) {
			dispatch(setMenuItem(data.result));
			setMenuItems(data.result);
		}
	}, [isLoading]);

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
			{menuItems.length > 0 ? (
				<div className="">
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
							{menuItems.map((menuItem: menuItemModel) => {
								return (
									<tr key={menuItem.id}>
										<td>{menuItem.name}</td>
										<td>{menuItem.price}</td>
										<td>{menuItem.category.name}</td>
										<td>{menuItem.subCategory.name}</td>
										<td style={{ width: "140px" }}>
											<div className="btn-group" role="group">
												<button
													onClick={() =>
														navigate("/updateMenuItem/" + menuItem.id)
													}
													className="btn btn-success"
												>
													<i className="bi bi-pencil"></i>
												</button>
												<button className="btn btn-danger">
													<i className="bi bi-trash-fill"></i>
												</button>
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			) : (
				<p>No menu items exist...</p>
			)}
		</div>
	);
};

export default MenuItemList;
