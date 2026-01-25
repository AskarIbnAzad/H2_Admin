import { createSlice } from "@reduxjs/toolkit";
import { asyncStatus } from "../../Utils/asyncStatus";
import { error_toast_message, success_toast_message } from "../../Utils/toast_message";
import { add_systems_service_auth, get_systems_service_auth } from "../../Services/SpecieService";


const initialState = {
    // status
    add_systems_status: asyncStatus.IDLE,
    get_systems_status: asyncStatus.IDLE,


    // data
    add_systems_data: null,
    get_systems_data: null,
    // error
    add_systems_error: null,
    get_systems_error: null,
};

const Systems_slice = createSlice({
    name: "systems",
    initialState,
    reducers: {
        setSpecieIdleStatus(state) {
            state.add_systems_status = asyncStatus.IDLE;
        },
    },
    extraReducers: (builder) => {

        // Add Study Type
        builder.addCase(add_systems_service_auth.pending, (state, action) => {
            state.add_systems_status = asyncStatus.LOADING;
        });

        builder.addCase(add_systems_service_auth.fulfilled, (state, { payload }) => {
            state.add_systems_status = asyncStatus.SUCCEEDED;
            state.add_systems_data = payload.data;

            success_toast_message("Add Successfully");
            state.add_systems_error = null;
        });

        builder.addCase(add_systems_service_auth.rejected, (state, action) => {
            state.add_systems_status = asyncStatus.ERROR;
            state.add_systems_error = action.error;
            error_toast_message(action.error.message);

        });

        // Get Study Type
        builder.addCase(get_systems_service_auth.pending, (state, action) => {
            state.get_systems_status = asyncStatus.LOADING;
        });

        builder.addCase(get_systems_service_auth.fulfilled, (state, { payload }) => {
            state.get_systems_status = asyncStatus.SUCCEEDED;
            state.get_systems_data = payload;
            state.get_systems_error = null;
        });

        builder.addCase(get_systems_service_auth.rejected, (state, action) => {
            state.get_systems_status = asyncStatus.ERROR;
            state.get_systems_error = action.error;
            error_toast_message(action.error.message);

        });



    },
});

export const { setSpecieIdleStatus } = Systems_slice.actions;

export default Systems_slice.reducer;
