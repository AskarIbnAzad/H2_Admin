import { createSlice } from "@reduxjs/toolkit";
import { asyncStatus } from "../../Utils/asyncStatus";
import { error_toast_message, success_toast_message } from "../../Utils/toast_message";
import { add_organs_service_auth, get_organs_service_auth } from "../../Services/SpecieService";


const initialState = {
    // status
    add_organs_status: asyncStatus.IDLE,
    get_organs_status: asyncStatus.IDLE,


    // data
    add_organs_data: null,
    get_organs_data: null,
    // error
    add_organs_error: null,
    get_organs_error: null,
};

const Organs_slice = createSlice({
    name: "organs",
    initialState,
    reducers: {
        setSpecieIdleStatus(state) {
            state.add_organs_status = asyncStatus.IDLE;
        },
    },
    extraReducers: (builder) => {

        // Add Study Type
        builder.addCase(add_organs_service_auth.pending, (state, action) => {
            state.add_organs_status = asyncStatus.LOADING;
        });

        builder.addCase(add_organs_service_auth.fulfilled, (state, { payload }) => {
            state.add_organs_status = asyncStatus.SUCCEEDED;
            state.add_organs_data = payload.data;

            success_toast_message("Add Successfully");
            state.add_organs_error = null;
        });

        builder.addCase(add_organs_service_auth.rejected, (state, action) => {
            state.add_organs_status = asyncStatus.ERROR;
            state.add_organs_error = action.error;
            error_toast_message(action.error.message);

        });

        // Get Study Type
        builder.addCase(get_organs_service_auth.pending, (state, action) => {
            state.get_organs_status = asyncStatus.LOADING;
        });

        builder.addCase(get_organs_service_auth.fulfilled, (state, { payload }) => {
            state.get_organs_status = asyncStatus.SUCCEEDED;
            state.get_organs_data = payload;
            state.get_organs_error = null;
        });

        builder.addCase(get_organs_service_auth.rejected, (state, action) => {
            state.get_organs_status = asyncStatus.ERROR;
            state.get_organs_error = action.error;
            error_toast_message(action.error.message);

        });



    },
});

export const { setSpecieIdleStatus } = Organs_slice.actions;

export default Organs_slice.reducer;
