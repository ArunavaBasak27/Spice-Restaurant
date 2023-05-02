import { orderHeaderModel } from "../../../Interfaces/orderHeaderModel";
import SD from "../../../Utility/SD";
var completed = require("../../../Images/completed.png");
var inKitchen = require("../../../Images/InKitchen.png");
var readyForPickUp = require("../../../Images/ReadyForPickup.png");
var orderPlaced = require("../../../Images/OrderPlaced.png");
var cancelled = require("../../../Images/cancelled.jpg");

interface Props {
	id: number;
	orderHeader: orderHeaderModel;
}
const OrderStatus = (props: Props) => {
	const imagePath = (status: string) => {
		var img: string = cancelled;
		if (status === SD.StatusSubmitted) {
			img = orderPlaced;
		} else if (status === SD.StatusInProcess) {
			img = inKitchen;
		} else if (status === SD.StatusReady) {
			img = readyForPickUp;
		} else if (status === SD.StatusCompleted) {
			img = completed;
		}
		return img;
	};

	return (
		<div
			className="modal fade"
			id={`statusBackdrop${props.id}`}
			// data-bs-backdrop="static"
			data-bs-keyboard="true"
			tabIndex={-1}
			aria-labelledby="statusBackdropLabel"
			aria-hidden="true"
		>
			<div
				className="modal-dialog-centered modal-dialog modal-lg"
				role="document"
			>
				<div className="modal-content">
					<div className="modal-header bg-success text-light justify-content-center">
						<h5 className="modal-title">Order Status</h5>
					</div>
					<div className="modal-body justify-content-center">
						<img
							src={imagePath(props.orderHeader.orderStatus)}
							style={{ width: "100%", height: "30%" }}
							alt=""
						/>
					</div>
					<div className="modal-footer">
						<button
							type="button"
							className="btn btn-secondary"
							style={{ width: "20%" }}
							data-bs-dismiss="modal"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderStatus;
