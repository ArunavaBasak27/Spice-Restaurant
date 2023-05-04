import { menuItemModel } from "../../../Interfaces";
import MenuItemCard from "./MenuItemCard";
interface Props {
	menuItemList: menuItemModel[];
}
const AllMenuItems = (props: Props) => {
	return (
		<>
			<h2 className="text-success">{props.menuItemList[0]?.category?.name}</h2>
			<div>
				{props.menuItemList.map((menuItem: menuItemModel, index: number) => {
					return <MenuItemCard key={index} menuItem={menuItem} />;
				})}
			</div>
		</>
	);
};

export default AllMenuItems;
