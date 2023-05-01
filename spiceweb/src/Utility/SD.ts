export default class SD {
	static baseUrl = "https://localhost:7165/api";
	static spicyness = ["NA", "NotSpicy", "Spicy", "VerySpicy"];
	static validImageTypes = ["jpeg", "jpg", "png"];
	static couponType = ["Percent", "Dollar"];
	static Roles = {
		ADMIN: "admin",
		CUSTOMER: "customer",
		MANAGER_USER: "manager",
		KITCHEN_USER: "kitchen",
		FRONT_DESK_USER: "frontDesk",
	};

	static convertToRawHtml = (source: string) => {
		let result = "",
			inside = false;

		for (let i = 0; i < source.length; i++) {
			const element = source[i];
			if (element === "<") {
				inside = true;
				continue;
			}
			if (element === ">") {
				inside = false;
				continue;
			}
			if (!inside) {
				result += element;
			}
		}
		if (result.length >= 150) {
			result = result.substring(0, 150) + "...";
		}
		return result;
	};

	static newDate(time: string) {
		var result = new Date();
		var hhmm = time.split(":");
		result.setHours(+hhmm[0], +hhmm[1], 0, 0);
		return result;
	}
	static addDays(days: Date, i: number) {
		var result = new Date(days);
		result.setDate(days.getDate() + i);
		return result;
	}

	static token = "token";
	static publishableKey =
		"pk_test_51KYMRhSEeYgsRHjr6bt5Thlx12KJGNgsevn9uq8bfkNuBnuLGq1qKouKBEi9hZnbZEFHK9RvSphPr7imLA87LUEG00ClvaMHIO";

	static StatusSubmitted = "Submitted";
	static StatusInProcess = "Being Prepared";
	static StatusReady = "Ready For Pickup";
	static StatusCompleted = "Completed";
	static StatusCancelled = "Cancelled";

	static PaymentStatusPending = "Pending";
	static PaymentStatusApproved = "Approved";
	static PaymentStatusRejected = "Rejected";
	static PaymentStatusRefunded = "Refunded";
}
