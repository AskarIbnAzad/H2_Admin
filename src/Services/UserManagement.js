import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiHandle } from "../Config/ApiHandle/apiHandle";
import { type_constant } from "../Utils/asyncStatus";

// Add user service
export const add_user_service_auth = createAsyncThunk(
    type_constant.ADD_USER,
    async (post_data) => {
        try {
            const response = await apiHandle.post(`add-update-user`, post_data);
            const res_data = await response.data;
            return res_data;
        } catch (error) {
            console.log("error", error);
            if (error?.response?.data) {
                throw Error(error.response.data.message);
            } else {
                throw Error(error.message);
            }
        }
    }
);

// Get user service
export const get_user_service_auth = createAsyncThunk(
    type_constant.GET_USERS,
    async () => {
        try {
            const response = await apiHandle.get(`get-all-users`);
            const res_data = await response.data;
            return res_data;
        } catch (error) {
            console.log("error", error);
            if (error?.response?.data) {
                throw Error(error.response.data.message);
            } else {
                throw Error(error.message);
            }
        }
    }
);

// Edit user service
export const edit_user_service_auth = createAsyncThunk(
    type_constant.EDIT_USER,
    async ({ user_id, update_data }) => {
        console.log("user_id", user_id);
        console.log("update_data", update_data);

        
        try {
            const response = await apiHandle.post(`add-update-user/${user_id}`, update_data);
            const res_data = await response.data;
            return res_data;
        } catch (error) {
            console.log("error", error);
            if (error?.response?.data) {
                throw Error(error.response.data.message);
            } else {
                throw Error(error.message);
            }
        }
    }
);

// Delete user service
export const delete_user_service_auth = createAsyncThunk(
    type_constant.DELETE_USER,
    async (user_id) => {
        try {
            const response = await apiHandle.post(`delete-user/${user_id}`);
            const res_data = await response.data;
            return res_data;
        } catch (error) {
            console.log("error", error);
            if (error?.response?.data) {
                throw Error(error.response.data.message);
            } else {
                throw Error(error.message);
            }
        }
    }
);