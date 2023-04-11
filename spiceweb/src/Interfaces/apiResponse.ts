export default interface apiResponse {
	data?: {
		statusCode?: number;
		isSuccess?: boolean;
		errorMessages: Array<string>;
		result: any;
	};
	error?: any;
}
