import { useEffect } from "react";
import { useGetMenuItemsQuery } from "../../../Apis/menuItemApi";
import { useDispatch } from "react-redux";
import { setMenuItem } from "../../../Storage/Redux/menuItemSlice";
import { menuItemModel } from "../../../Interfaces";
import MenuItemCard from "./MenuItemCard";
import { MainLoader } from "../Common";
interface Props {
	menuItemList: menuItemModel[];
}
const AllMenuItems = (props: Props) => {
	return (
		<>
			<h2 className="text-success">{props.menuItemList[0]?.category?.name}</h2>
			<div>
				{props.menuItemList.map((menuItem: menuItemModel) => {
					return <MenuItemCard menuItem={menuItem} />;
				})}
			</div>
		</>
	);
};

export default AllMenuItems;
