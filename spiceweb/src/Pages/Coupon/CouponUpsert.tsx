import { useNavigate, useParams } from "react-router-dom";
import SD from "../../Utility/SD";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { inputHelper, toastNotify } from "../../Helper";
import {
	useCreateCouponMutation,
	useGetCouponByIdQuery,
	useUpdateCouponMutation,
} from "../../Apis/couponApi";
import { apiResponse } from "../../Interfaces";
import { blob } from "stream/consumers";
const couponData = {
	name: "",
	couponType: "-1",
	discount: "",
	minimumAmount: "",
	isActive: false,
};
const CouponUpsert = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [couponInput, setCouponInput] = useState(couponData);
	const [loading, setLoading] = useState(false);
	const [checked, setChecked] = useState(couponData.isActive);

	const [imageToStore, setImageToStore] = useState<any>("");
	const [imageToDisplay, setImageToDisplay] = useState<any>("");

	const [createCoupon] = useCreateCouponMutation();
	const [updateCoupon] = useUpdateCouponMutation();

	const { data, isLoading } = useGetCouponByIdQuery(id, {
		skip: id === undefined,
	});

	useEffect(() => {
		if (!isLoading) {
			if (data && data?.result) {
				setChecked(data?.result.isActive);
				setImageToDisplay("data:image/png;base64," + data?.result.picture);
				setCouponInput(data?.result);
			}
		}
	}, [isLoading]);

	const handleCouponChange = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const tempData = inputHelper(e, couponInput);
		setCouponInput(tempData);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData();

		formData.append("Name", couponInput.name);
		formData.append("CouponType", couponInput.couponType.toString());
		formData.append("Discount", couponInput.discount);
		formData.append("MinimumAmount", couponInput.minimumAmount);
		formData.append("File", imageToStore);
		formData.append("IsActive", checked.toString());
		console.log(imageToStore);
		let response: apiResponse = {};
		if (id) {
			formData.append("Id", id);
			response = await updateCoupon({ data: formData, id: id });
			console.log(response);
		} else {
			response = await createCoupon(formData);
		}
		if (response.data?.isSuccess) {
			setLoading(false);
			toastNotify(
				`Coupon ${id ? "updated" : "created"} successfully`,
				"success"
			);
			navigate("/couponList");
		} else {
			setLoading(false);
			toastNotify(response.data?.errorMessages[0], "error");
		}

		setLoading(false);
	};

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		var file = e.target.files && e.target.files[0];
		if (file) {
			const imgType = file?.type.split("/")[1];
			const isImageTypeValid = SD.validImageTypes.filter((e) => {
				return e === imgType;
			});

			if (isImageTypeValid.length === 0) {
				setImageToStore("");
				toastNotify("File must be in jpeg , jpg or png format", "error");
				return;
			} else if (file.size > 1000 * 1024) {
				setImageToStore("");
				toastNotify("File must be less than 1 MB", "error");
				return;
			}

			const reader = new FileReader();

			reader.readAsDataURL(file);
			setImageToStore(file);
			console.log(file);
			reader.onload = (e) => {
				const imageUrl = e.target?.result as string;
				setImageToDisplay(imageUrl);
			};
		}
	};

	return (
		<div>
			<h2 className="text-info">{id ? "Update" : "Create"} Coupon</h2>
			<br />
			<div className="border backgroundWhite row">
				<div className="col-12">
					{imageToDisplay.length > 0 && (
						<img
							src={imageToDisplay}
							alt="coupon"
							width={"100%"}
							height={"100%"}
						/>
					)}
				</div>
				<div className="col-12 pt-4">
					<form
						method="post"
						encType="multipart/form-data"
						onSubmit={handleSubmit}
					>
						<div className="form-group row mt-2">
							<div className="col-2">Name</div>
							<div className="col-5">
								<input
									type="text"
									name="name"
									className="form-control"
									onChange={handleCouponChange}
									value={couponInput.name}
								/>
							</div>
						</div>

						<div className="form-group row mt-2">
							<div className="col-2">Coupon Type</div>
							<div className="col-5">
								<select
									name="couponType"
									className="form-select"
									onChange={handleCouponChange}
									value={couponInput.couponType}
								>
									<option disabled value={-1}>
										-Select coupon type-
									</option>
									{SD.couponType.map((coupon: string, index: number) => {
										return (
											<option key={index} value={index}>
												{coupon}
											</option>
										);
									})}
								</select>
							</div>
						</div>

						<div className="form-group row mt-2">
							<div className="col-2">Discount</div>
							<div className="col-5">
								<input
									type="number"
									min={0}
									name="discount"
									className="form-control"
									onChange={handleCouponChange}
									value={couponInput.discount}
								/>
							</div>
						</div>

						<div className="form-group row mt-2">
							<div className="col-2">Minimum Amount</div>
							<div className="col-5">
								<input
									type="number"
									name="minimumAmount"
									min={1}
									className="form-control"
									onChange={handleCouponChange}
									value={couponInput.minimumAmount}
								/>
							</div>
						</div>

						<div className="form-group row mt-2">
							<div className="col-2">Image</div>
							<div className="col-5">
								<input
									type="file"
									name="file"
									className="form-control"
									onChange={handleImageChange}
								/>
							</div>
						</div>

						<div className="form-group row mt-2">
							<div className="col-2">Active</div>
							<div className="col-5">
								<input
									type="checkbox"
									name="isActive"
									className="form-check"
									checked={checked}
									onChange={() => {
										setChecked(!checked);
									}}
								/>
							</div>
						</div>
						<div className="form-group row mt-2">
							<div className="col-5 offset-2">
								<div className="row">
									<div className="col-6">
										<button
											type="submit"
											className="btn btn-primary form-control"
										>
											{id ? "Update" : "Create"}
										</button>
									</div>
									<div className="col-6">
										<a
											onClick={() => navigate("/couponList")}
											className="btn btn-success form-control"
										>
											Back To List
										</a>
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default CouponUpsert;
