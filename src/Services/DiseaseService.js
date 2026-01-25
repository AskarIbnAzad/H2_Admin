import { createAsyncThunk } from "@reduxjs/toolkit";
import { type_constant } from "../Utils/asyncStatus.js";
import { apiHandle } from "../Config/ApiHandle/apiHandle.js";

// Add Disease
export const add_disease_service_auth = createAsyncThunk(
    type_constant.ADD_DISEASE,
    async (post_data) => {
        try {
            const response = await apiHandle.post(`add-disease`, post_data);
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

// Get Diseases
export const get_disease_service_auth = createAsyncThunk(
    type_constant.GET_DISEASE,
    async () => {
        try {
            const response = await apiHandle.get(`get-disease`);
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

// Edit Disease
export const edit_disease_service_auth = createAsyncThunk(
    type_constant.EDIT_DISEASE,
    async (post_data) => {
        const { id, data } = post_data;
        console.log("Editing disease with ID:", id, "Data:", data);
        try {
            const response = await apiHandle.post(`edit-disease/${id}`, data);
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

// Delete Disease
export const delete_disease_service_auth = createAsyncThunk(
    type_constant.DELETE_DISEASE,
    async (id) => {
        try {
            const response = await apiHandle.post(`delete-disease/${id}`);
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
