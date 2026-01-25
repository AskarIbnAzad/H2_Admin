import { createAsyncThunk } from "@reduxjs/toolkit";
import { type_constant } from "../Utils/asyncStatus.js";
import { apiHandle } from "../Config/ApiHandle/apiHandle.js";


export const add_biomarker_service_auth = createAsyncThunk(
    type_constant.ADD_BIO_MARKER,
    async (post_data) => {
        try {
            // const response = await apiHandle.post(`add-biomaker-front`, post_data);
            const response = await apiHandle.post(`add-biomarker`, post_data);
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

export const get_biomarker_service_auth = createAsyncThunk(
    type_constant.GET_BIO_MARKER,
    async () => {
        try {
            // const response = await apiHandle.get(`get-biomakers`);
            const response = await apiHandle.get(`manage-main-sub-categories`);
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

export const update_biomarker_service_auth = createAsyncThunk(
    type_constant.UPDATE_BIO_MARKER,
    async (post_data) => {
        const { id, data } = post_data
        try {
            const response = await apiHandle.post(`edit-biomarker/${id}`, data);
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

export const get_biomarker_handling_service_auth = createAsyncThunk(
    type_constant.GET_BIO_MARKER_HANDLING,
    async () => {
        try {
            const response = await apiHandle.get(`list-sub-cat`);
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

export const approve_reject_biomarker_handling_service_auth = createAsyncThunk(
    type_constant.APPROVE_REJECT_BIO_MARKER_HANDLING,
    async (post_data) => {
        try {
            const response = await apiHandle.post(`reject-approve-makers`, post_data);
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