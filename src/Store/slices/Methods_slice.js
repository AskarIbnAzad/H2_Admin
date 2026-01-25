import { createSlice } from "@reduxjs/toolkit";
import { asyncStatus } from "../../Utils/asyncStatus";
import { error_toast_message, success_toast_message } from "../../Utils/toast_message";
import { add_methods_service_auth, get_methods_service_auth } from "../../Services/SpecieService";


const initialState = {
    // status
    add_method_status: asyncStatus.IDLE,
    get_method_status: asyncStatus.IDLE,


    // data
    add_method_data: null,
    get_method_data: null,
    // error
    add_method_error: null,
    get_method_error: null,
};

const Methods_slice = createSlice({
    name: "method",
    initialState,
    reducers: {
        setSpecieIdleStatus(state) {
            state.add_method_status = asyncStatus.IDLE;
        },
    },
    extraReducers: (builder) => {

        // Add Study Type
        builder.addCase(add_methods_service_auth.pending, (state, action) => {
            state.add_method_status = asyncStatus.LOADING;
        });

        builder.addCase(add_methods_service_auth.fulfilled, (state, { payload }) => {
            state.add_method_status = asyncStatus.SUCCEEDED;
            state.add_method_data = payload.data;

            success_toast_message("Add Successfully");
            state.add_method_error = null;
        });

        builder.addCase(add_methods_service_auth.rejected, (state, action) => {
            state.add_method_status = asyncStatus.ERROR;
            state.add_method_error = action.error;
            error_toast_message(action.error.message);

        });

        // Get Study Type
        builder.addCase(get_methods_service_auth.pending, (state, action) => {
            state.get_method_status = asyncStatus.LOADING;
        });

        builder.addCase(get_methods_service_auth.fulfilled, (state, { payload }) => {
            state.get_method_status = asyncStatus.SUCCEEDED;
            state.get_method_data = payload;
            state.get_method_error = null;
        });

        builder.addCase(get_methods_service_auth.rejected, (state, action) => {
            state.get_method_status = asyncStatus.ERROR;
            state.get_method_error = action.error;
            error_toast_message(action.error.message);

        });



    },
});

export const { setSpecieIdleStatus } = Methods_slice.actions;

export default Methods_slice.reducer;
