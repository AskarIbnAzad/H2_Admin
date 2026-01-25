import { createSlice } from "@reduxjs/toolkit";
import { asyncStatus } from "../../Utils/asyncStatus";
import { error_toast_message, success_toast_message } from "../../Utils/toast_message";
import { add_biomarker_service_auth, approve_reject_biomarker_handling_service_auth, get_biomarker_handling_service_auth, get_biomarker_service_auth, update_biomarker_service_auth } from "../../Services/BioMarkerService";


const initialState = {
    // status
    add_biomarker_status: asyncStatus.IDLE,
    get_biomarker_status: asyncStatus.IDLE,
    update_biomarker_status: asyncStatus.IDLE,
    get_biomarker_handling_status: asyncStatus.IDLE,
    app_rej_biomarker_handling_status: asyncStatus.IDLE,



    // data

    add_biomarker_data: null,
    get_biomarker_data: null,
    update_biomarker_data: null,
    get_biomarker_handling_data: null,
    app_rej_biomarker_handling_data: null,
    // error
    add_biomarker_error: null,
    get_biomarker_error: null,
    uptate_biomarker_error: null,
    get_biomarker_handling_error: null,
    app_rej_biomarker_handling_error: null,
};

const bio_marker_slice = createSlice({
    name: "biomarker",
    initialState,
    reducers: {
        setaddMarkerIdleStatus(state) {
            state.add_biomarker_status = asyncStatus.IDLE;
        },
        seteditMarkerIdleStatus(state) {
            state.update_biomarker_status = asyncStatus.IDLE;
        },
    },
    extraReducers: (builder) => {

        // Add Bio Marker
        builder.addCase(add_biomarker_service_auth.pending, (state, action) => {
            state.add_biomarker_status = asyncStatus.LOADING;
        });

        builder.addCase(add_biomarker_service_auth.fulfilled, (state, { payload }) => {
            state.add_biomarker_status = asyncStatus.SUCCEEDED;
            state.add_biomarker_data = payload.data;

            success_toast_message("Add Successfully");
            state.add_biomarker_error = null;
        });

        builder.addCase(add_biomarker_service_auth.rejected, (state, action) => {
            state.add_biomarker_status = asyncStatus.ERROR;
            state.add_biomarker_error = action.error;
            error_toast_message(action.error.message);

        });

        // Get Bio Marker
        builder.addCase(get_biomarker_service_auth.pending, (state, action) => {
            state.get_biomarker_status = asyncStatus.LOADING;
        });

        builder.addCase(get_biomarker_service_auth.fulfilled, (state, { payload }) => {
            state.get_biomarker_status = asyncStatus.SUCCEEDED;
            state.get_biomarker_data = payload;
            state.get_biomarker_error = null;
        });

        builder.addCase(get_biomarker_service_auth.rejected, (state, action) => {
            state.get_biomarker_status = asyncStatus.ERROR;
            state.get_biomarker_error = action.error;
            error_toast_message(action.error.message);

        });

        // Update Bio Marker
        builder.addCase(update_biomarker_service_auth.pending, (state, action) => {
            state.update_biomarker_status = asyncStatus.LOADING;
        });

        builder.addCase(update_biomarker_service_auth.fulfilled, (state, { payload }) => {
            state.update_biomarker_status = asyncStatus.SUCCEEDED;
            state.update_biomarker_data = payload;
            state.uptate_biomarker_error = null;
            success_toast_message("Update Successfully");

        });

        builder.addCase(update_biomarker_service_auth.rejected, (state, action) => {
            state.update_biomarker_status = asyncStatus.ERROR;
            state.uptate_biomarker_error = action.error;
            error_toast_message(action.error.message);

        });


        // Get Bio Marker Handling
        builder.addCase(get_biomarker_handling_service_auth.pending, (state, action) => {
            state.get_biomarker_handling_status = asyncStatus.LOADING;
        });

        builder.addCase(get_biomarker_handling_service_auth.fulfilled, (state, { payload }) => {
            state.get_biomarker_handling_status = asyncStatus.SUCCEEDED;
            state.get_biomarker_handling_data = payload;
            state.get_biomarker_handling_error = null;
        });

        builder.addCase(get_biomarker_handling_service_auth.rejected, (state, action) => {
            state.get_biomarker_handling_status = asyncStatus.ERROR;
            state.get_biomarker_handling_error = action.error;
            error_toast_message(action.error.message);

        });

        // Approve and Reject Bio Marker Handling
        builder.addCase(approve_reject_biomarker_handling_service_auth.pending, (state, action) => {
            state.app_rej_biomarker_handling_status = asyncStatus.LOADING;
        });

        builder.addCase(approve_reject_biomarker_handling_service_auth.fulfilled, (state, { payload }) => {
            state.app_rej_biomarker_handling_status = asyncStatus.SUCCEEDED;
            state.app_rej_biomarker_handling_data = payload;
            state.app_rej_biomarker_handling_error = null;
        });

        builder.addCase(approve_reject_biomarker_handling_service_auth.rejected, (state, action) => {
            state.app_rej_biomarker_handling_status = asyncStatus.ERROR;
            state.app_rej_biomarker_handling_error = action.error;
            error_toast_message(action.error.message);

        });

    },
});

export const { setaddMarkerIdleStatus, seteditMarkerIdleStatus } = bio_marker_slice.actions;

export default bio_marker_slice.reducer;
