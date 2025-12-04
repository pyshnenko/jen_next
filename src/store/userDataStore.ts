import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types/frontGlobalTypes";

const initialState: User = {
    Id: -1,
    login: "",
    hash: "",
    name: "",
    lastname: "",
    access: 0,
    folder: "",
    project: ""
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User>) {
            Object.assign(state, action.payload)
        },
        userExit(state) {
            state = initialState;
        }
    }
})

export const {setUser, userExit} = userSlice.actions;
export default userSlice.reducer;