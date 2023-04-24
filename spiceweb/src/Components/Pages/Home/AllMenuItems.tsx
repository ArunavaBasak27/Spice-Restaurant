import { useEffect } from "react";
import { useGetMenuItemsQuery } from "../../../Apis/menuItemApi";
import { useDispatch } from "react-redux";
import { setMenuItem } from "../../../Storage/Redux/menuItemSlice";
import { menuItemModel } from "../../../Interfaces";
import MenuItemCard from "./MenuItemCard";
import { MainLoader } from "../Common";

const AllMenuItems = () => {
	const dispatch = useDispatch();
	const { data, isLoading } = useGetMenuItemsQuery(null);

	useEffect(() => {
		if (!isLoading) {
			dispatch(setMenuItem(data.result));
		}
	}, [isLoading]);

	return (
		<>
			{isLoading && <MainLoader />}
			{!isLoading &&
				data?.result.map((menuItem: menuItemModel, index: number) => {
					return <MenuItemCard key={index} menuItem={menuItem} />;
				})}
		</>
	);
};

export default AllMenuItems;
