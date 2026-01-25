import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiHandle } from '../Config/ApiHandle/apiHandle';

// Get all tutorials
export const get_tutorials_service_auth = createAsyncThunk(
    'tutorial/get_tutorials',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await apiHandle.get('tutorials');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Add tutorial
export const add_tutorial_service_auth = createAsyncThunk(
    'tutorial/add_tutorial',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await apiHandle.post('tutorials', payload);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Update tutorial
export const update_tutorial_service_auth = createAsyncThunk(
    'tutorial/update_tutorial',
    async (payload, { rejectWithValue }) => {
        try {
            const { id, ...data } = payload;
            const response = await apiHandle.put(`tutorials/${id}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Delete tutorial
export const delete_tutorial_service_auth = createAsyncThunk(
    'tutorial/delete_tutorial',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiHandle.delete(`tutorials/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
