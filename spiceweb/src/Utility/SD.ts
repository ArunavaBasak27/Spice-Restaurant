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
	static token = "token";
}
