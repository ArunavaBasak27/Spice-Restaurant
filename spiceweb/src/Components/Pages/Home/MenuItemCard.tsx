import { useNavigate } from "react-router";
import { menuItemModel } from "../../../Interfaces";
let mild = require("../../../Images/mild.png");
let spicy = require("../../../Images/spicy.png");
let verySpicy = require("../../../Images/verySpicy.png");

interface Props {
	menuItem: menuItemModel;
}

const MenuItemCard = (props: Props) => {
	const navigate = useNavigate();
	return (
		<div
			className="col-12 border border-info rounded"
			style={{ marginBottom: "10px", marginTop: "10px", padding: "10px" }}
		>
			<div className="row">
				<div className="col-md-3 col-sm-12">
					<img
						src={props.menuItem.image}
						width="100%"
						alt=""
						style={{ borderRadius: "5px", border: "1px solid #bbb9b9" }}
					/>
				</div>
				<div className="col-md-9 col-sm-12">
					<div className="row pr-3">
						<div
							className="col-8"
							style={{ fontSize: "21px", color: "maroon" }}
						>
							{props.menuItem.name}
							{props.menuItem.spicyness === 1 && (
								<img srcSet={mild} title="Mild" />
							)}
							{props.menuItem.spicyness === 2 && (
								<img srcSet={spicy} title="Spicy" />
							)}
							{props.menuItem.spicyness === 3 && (
								<img srcSet={verySpicy} title="Very Spicy" />
							)}
						</div>
						<div className="col-4 text-end" style={{ color: "maroon" }}>
							<h4>${props.menuItem.price}</h4>
						</div>
					</div>
					<div className="row col-12 text-justify d-none d-md-block">
						<p>{props.menuItem.description}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MenuItemCard;
