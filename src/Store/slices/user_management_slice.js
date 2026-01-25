import { createSlice } from "@reduxjs/toolkit";
import { delete_user_service_auth, edit_user_service_auth, get_user_service_auth, add_user_service_auth } from "../../Services/UserManagement";
import { asyncStatus } from "../../Utils/asyncStatus";
import { error_toast_message, success_toast_message } from "../../Utils/toast_message";


const initialState = {
    users: [],
    user: null,
    addUserStatus: asyncStatus.IDLE,
    getUserStatus: asyncStatus.IDLE,
    editUserStatus: asyncStatus.IDLE,
    deleteUserStatus: asyncStatus.IDLE,
    error: null,
};

const userAuthSlice = createSlice({
    name: "userAuth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Add user
        builder.addCase(add_user_service_auth.pending, (state) => {
            state.addUserStatus = asyncStatus.LOADING;
            state.error = null;
        });
        builder.addCase(add_user_service_auth.fulfilled, (state, action) => {
            state.addUserStatus = asyncStatus.SUCCEEDED;
            state.users.push(action.payload);
            success_toast_message("User added successfully");
        });
        builder.addCase(add_user_service_auth.rejected, (state, action) => {
            state.addUserStatus = asyncStatus.ERROR;
            state.error = action.error.message;
            error_toast_message(action.error.message);
        });

        // Get user
        builder.addCase(get_user_service_auth.pending, (state) => {
            state.getUserStatus = asyncStatus.LOADING;
            state.error = null;
        });
        builder.addCase(get_user_service_auth.fulfilled, (state, action) => {
            state.getUserStatus = asyncStatus.SUCCEEDED;
            state.user = action.payload;
        });
        builder.addCase(get_user_service_auth.rejected, (state, action) => {
            state.getUserStatus = asyncStatus.ERROR;
            state.error = action.error.message;
        });

        // Edit user
        builder.addCase(edit_user_service_auth.pending, (state) => {
            state.editUserStatus = asyncStatus.LOADING;
            state.error = null;
        });
        builder.addCase(edit_user_service_auth.fulfilled, (state, action) => {
            state.editUserStatus = asyncStatus.SUCCEEDED;
            const index = state.users.findIndex(user => user.id === action.payload.id);
            if (index !== -1) {
                state.users[index] = action.payload;
            }
            success_toast_message("User updated successfully");
        });
        builder.addCase(edit_user_service_auth.rejected, (state, action) => {
            state.editUserStatus = asyncStatus.ERROR;
            state.error = action.error.message;
            error_toast_message(action.error.message);

        });

        // Delete user
        builder.addCase(delete_user_service_auth.pending, (state) => {
            state.deleteUserStatus = asyncStatus.LOADING;
            state.error = null;
        });
        builder.addCase(delete_user_service_auth.fulfilled, (state, action) => {
            state.deleteUserStatus = asyncStatus.SUCCEEDED;
            state.users = state.users.filter(user => user.id !== action.payload.id);
        });
        builder.addCase(delete_user_service_auth.rejected, (state, action) => {
            state.deleteUserStatus = asyncStatus.ERROR;
            state.error = action.error.message;
        });
    },
});

export default userAuthSlice.reducer;