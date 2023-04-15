export default interface couponModel {
	id: number;
	name: string;
	couponType: ECoupon;
	discount: number;
    minimumAmount:number
	picture: any;
	isActive: boolean;
}

enum ECoupon {
	Percent = 0,
	Dollar = 1,
}
