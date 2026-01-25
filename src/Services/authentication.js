import { createAsyncThunk } from "@reduxjs/toolkit";
import { type_constant } from "../Utils/asyncStatus.js";
import { apiHandle } from "../Config/ApiHandle/apiHandle.js";
import axios from "axios";



export const login_service_auth = createAsyncThunk(
    type_constant.LOGIN,
    async (post_data) => {
        try {
            const response = await apiHandle.post(`login`, post_data);
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

export const check_auth = createAsyncThunk(
    type_constant.CHECK_AUTH,
    async () => {
        try {
            const response = await apiHandle.get(`check-auth`);
            const res_data = await response.data;
            // localStorage.setItem('userData', res_data);
            // const res_data = await response.data;
const userRole = res_data?.role || res_data?.user?.role;

if (userRole) {
  const encodedRole = btoa(userRole); // Base64 encode
  localStorage.setItem('rl', encodedRole);
}

            return res_data;
        } catch (error) {
            if (error?.response?.data) {
                throw Error(error.response.data.message);
            } else {
                throw Error(error.message);
            }
        }
    }
);


export const fetch_pmid_Article = createAsyncThunk(
    type_constant.FETCH_PMID_ARTICLES,
    async (extId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:${extId}&resultType=core&format=json`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data.message : error.message);
        }
    }
);
