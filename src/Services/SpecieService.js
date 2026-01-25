import { createAsyncThunk } from "@reduxjs/toolkit";
import { type_constant } from "../Utils/asyncStatus.js";
import { apiHandle } from "../Config/ApiHandle/apiHandle.js";


export const add_specie_service_auth = createAsyncThunk(
    type_constant.ADD_SPECIE,
    async (post_data) => {
        try {
            const response = await apiHandle.post(`add-specie`, post_data);
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

export const add_study_type_service_auth = createAsyncThunk(
    type_constant.ADD_STUDY_TYPE,
    async (post_data) => {
        try {
            const response = await apiHandle.post(`add-study-type`, post_data);
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

export const add_research_topic_service_auth = createAsyncThunk(
    type_constant.ADD_RESEARCH_TYPE,
    async (post_data) => {
        try {
            const response = await apiHandle.post(`add-research-topic`, post_data);
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

export const add_organs_service_auth = createAsyncThunk(
    type_constant.ADD_ORGANS,
    async (post_data) => {
        try {
            const response = await apiHandle.post(`add-organs`, post_data);
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
export const add_systems_service_auth = createAsyncThunk(
    type_constant.ADD_SYSTEMS,
    async (post_data) => {
        try {
            const response = await apiHandle.post(`add-systems`, post_data);
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
export const add_methods_service_auth = createAsyncThunk(
    type_constant.ADD_METHODS,
    async (post_data) => {
        try {
            const response = await apiHandle.post(`add-methods`, post_data);
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

export const get_specie_service_auth = createAsyncThunk(
    type_constant.GET_SPECIE,
    async () => {
        try {
            const response = await apiHandle.get(`get-species`);
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

export const get_study_type_service_auth = createAsyncThunk(
    type_constant.GET_STUDY_TYPE,
    async () => {
        try {
            const response = await apiHandle.get(`get-study-type`);
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

export const get_research_topic_service_auth = createAsyncThunk(
    type_constant.GET_RESEARCH_TOPIC,
    async () => {
        try {
            const response = await apiHandle.get(`get-research-topic`);
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

export const get_organs_service_auth = createAsyncThunk(
    type_constant.GET_ORGANS,
    async () => {
        try {
            const response = await apiHandle.get(`get-organs`);
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

export const get_systems_service_auth = createAsyncThunk(
    type_constant.GET_SYSTEMS,
    async () => {
        try {
            const response = await apiHandle.get(`get-systems`);
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

export const get_methods_service_auth = createAsyncThunk(
    type_constant.GET_METHODS,
    async () => {
        try {
            const response = await apiHandle.get(`get-methods`);
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
export const get_countries_service_auth = createAsyncThunk(
    type_constant.GET_COUNTRY,
    async () => {
        try {
            const response = await apiHandle.get(`get-countries`);
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

export const add_country_service_auth = createAsyncThunk(
    type_constant.ADD_COUNTRY,
    async (post_data) => {
        try {
            const response = await apiHandle.post(`add-country`, post_data);
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


export const edit_specie_service_auth = createAsyncThunk(
    type_constant.EDIT_SPECIE,
    async (post_data) => {
        const { id, data } = post_data
        try {
            const response = await apiHandle.post(`edit-specie/${id}`, data);
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



export const get_roles_service_auth = createAsyncThunk(
    type_constant.GET_ROLE,
    async () => {
        try {
            const response = await apiHandle.get("get-roles");
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


export const add_roles_service_auth  = createAsyncThunk(
    type_constant.ADD_ROLE,
    async (post_data) => {
        try {
            const response = await apiHandle.post(`add-role`, post_data);
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

export const edit_roles_service_auth  = createAsyncThunk(
    type_constant.EDIT_ROLE,
    async (post_data) => {
        const { id, data } = post_data
        try {
            const response = await apiHandle.post(`edit-role/${id}`, data);
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

export const delete_roles_service_auth   = createAsyncThunk(
    type_constant.DELETE_ROLE,
    async (id) => {
        try {
            const response = await apiHandle.post(`delete-role/${id}`);
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