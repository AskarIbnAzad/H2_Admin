import { createSlice } from "@reduxjs/toolkit";
import { asyncStatus } from "../../Utils/asyncStatus";
import { error_toast_message, success_toast_message } from "../../Utils/toast_message";
import { get_tutorials_service_auth, add_tutorial_service_auth, update_tutorial_service_auth, delete_tutorial_service_auth } from "../../Services/TutorialService";

const initialState = {
    // status
    get_tutorials_status: asyncStatus.IDLE,
    add_tutorial_status: asyncStatus.IDLE,
    update_tutorial_status: asyncStatus.IDLE,
    delete_tutorial_status: asyncStatus.IDLE,

    // data
    get_tutorials_data: [],
    add_tutorial_data: null,
    update_tutorial_data: null,
    delete_tutorial_data: null,

    // error
    get_tutorials_error: null,
    add_tutorial_error: null,
    update_tutorial_error: null,
    delete_tutorial_error: null,

    // pagination
    total_tutorials: 0,
};

const Tutorial_slice = createSlice({
    name: "tutorial",
    initialState,
    reducers: {
        setTutorialIdleStatus(state) {
            state.add_tutorial_status = asyncStatus.IDLE;
            state.update_tutorial_status = asyncStatus.IDLE;
            state.delete_tutorial_status = asyncStatus.IDLE;
        },
        resetTutorialData(state) {
            state.add_tutorial_data = null;
            state.update_tutorial_data = null;
            state.delete_tutorial_data = null;
        },
    },
    extraReducers: (builder) => {
        // Get Tutorials
        builder.addCase(get_tutorials_service_auth.pending, (state, action) => {
            state.get_tutorials_status = asyncStatus.LOADING;
            state.get_tutorials_error = null;
        });

        builder.addCase(get_tutorials_service_auth.fulfilled, (state, { payload }) => {
            state.get_tutorials_status = asyncStatus.SUCCEEDED;
            state.get_tutorials_data = payload.data || payload;
            state.total_tutorials = payload.total || payload.length || 0;
        });

        builder.addCase(get_tutorials_service_auth.rejected, (state, { payload }) => {
            state.get_tutorials_status = asyncStatus.FAILED;
            state.get_tutorials_error = payload?.message || "Failed to fetch tutorials";
            error_toast_message(state.get_tutorials_error);
        });

        // Add Tutorial
        builder.addCase(add_tutorial_service_auth.pending, (state, action) => {
            state.add_tutorial_status = asyncStatus.LOADING;
            state.add_tutorial_error = null;
        });

        builder.addCase(add_tutorial_service_auth.fulfilled, (state, { payload }) => {
            state.add_tutorial_status = asyncStatus.SUCCEEDED;
            state.add_tutorial_data = payload;
            success_toast_message("Tutorial added successfully");
        });

        builder.addCase(add_tutorial_service_auth.rejected, (state, { payload }) => {
            state.add_tutorial_status = asyncStatus.FAILED;
            state.add_tutorial_error = payload?.message || "Failed to add tutorial";
            error_toast_message(state.add_tutorial_error);
        });

        // Update Tutorial
        builder.addCase(update_tutorial_service_auth.pending, (state, action) => {
            state.update_tutorial_status = asyncStatus.LOADING;
            state.update_tutorial_error = null;
        });

        builder.addCase(update_tutorial_service_auth.fulfilled, (state, { payload }) => {
            state.update_tutorial_status = asyncStatus.SUCCEEDED;
            state.update_tutorial_data = payload;
            success_toast_message("Tutorial updated successfully");
        });

        builder.addCase(update_tutorial_service_auth.rejected, (state, { payload }) => {
            state.update_tutorial_error = payload?.message || "Failed to update tutorial";
            state.update_tutorial_status = asyncStatus.FAILED;
            error_toast_message(state.update_tutorial_error);
        });

        // Delete Tutorial
        builder.addCase(delete_tutorial_service_auth.pending, (state, action) => {
            state.delete_tutorial_status = asyncStatus.LOADING;
            state.delete_tutorial_error = null;
        });

        builder.addCase(delete_tutorial_service_auth.fulfilled, (state, { payload }) => {
            state.delete_tutorial_status = asyncStatus.SUCCEEDED;
            state.delete_tutorial_data = payload;
            success_toast_message("Tutorial deleted successfully");
        });

        builder.addCase(delete_tutorial_service_auth.rejected, (state, { payload }) => {
            state.delete_tutorial_status = asyncStatus.FAILED;
            state.delete_tutorial_error = payload?.message || "Failed to delete tutorial";
            error_toast_message(state.delete_tutorial_error);
        });
    },
});

export const { setTutorialIdleStatus, resetTutorialData } = Tutorial_slice.actions;
export default Tutorial_slice.reducer;
