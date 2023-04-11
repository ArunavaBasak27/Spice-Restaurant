import { TypeOptions, toast } from "react-toastify";

const toastNotify = (
	message: string | undefined,
	type: TypeOptions = "success"
) => {
	return toast(message, {
		type: type,
		position: "top-right",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "dark",
	});
};

export default toastNotify;
