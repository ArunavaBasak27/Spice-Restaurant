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
				console.log(result);
			}
		}
		if (result.length >= 150) {
			result = result.substring(0, 150) + "...";
		}
		return result;
	};

	static token = "token";
}
