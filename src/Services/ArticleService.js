import { createAsyncThunk } from "@reduxjs/toolkit";
import { type_constant } from "../Utils/asyncStatus.js";
import { apiHandle } from "../Config/ApiHandle/apiHandle.js";


export const add_article_service_auth = createAsyncThunk(
    type_constant.ADD_ARTICLE,
    async (post_data) => {
        try {
            const response = await apiHandle.post(`final-article-submit`, post_data);
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


export const get_article_service_auth = createAsyncThunk(
    type_constant.GET_ARTICLE,
    async () => {
        try {
            const response = await apiHandle.get(`get-new-articles`);
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


export const get_dashboard_data_service_auth = createAsyncThunk(
    type_constant.GET_DASHBOARD_DATA,
    async () => {
        try {
            const response = await apiHandle.get(`admin-dashboard`);
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


export const delete_article_service_auth = createAsyncThunk(
    type_constant.DELETE_ARTICLE,
    async (id) => {
        try {
            const response = await apiHandle.post(`article-delete/${id}`);
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

export const update_article_status_service_auth = createAsyncThunk(
    type_constant.UPDATE_ARTICLE_STATUS,
    async (data) => {
        const { id, status } = data
        try {
            const response = await apiHandle.post(`update-status/${id}`, { status: status });
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

