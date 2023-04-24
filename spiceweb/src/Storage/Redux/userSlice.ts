import { createSlice } from "@reduxjs/toolkit";
import userModel from "../../Interfaces/userModel";

export const emptyUserState: userModel = {
	fullName: "",
	id: "",
	email: "",
	role: "",
	phoneNumber: "",
};

export const userSlice = createSlice({
	name: "userSlice",
	initialState: emptyUserState,
	reducers: {
		setLoggedInUser: (state, action) => {
			state.fullName = action.payload.fullName;
			state.id = action.payload.id;
			state.email = action.payload.email;
			state.role = action.payload.role;
		},
	},
});

export const { setLoggedInUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
