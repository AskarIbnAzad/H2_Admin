import { createSlice } from "@reduxjs/toolkit";
import { asyncStatus } from "../../Utils/asyncStatus";
import { error_toast_message, success_toast_message } from "../../Utils/toast_message";
import { add_research_topic_service_auth, get_research_topic_service_auth } from "../../Services/SpecieService";


const initialState = {
    // status
    add_research_type_status: asyncStatus.IDLE,
    get_research_type_status: asyncStatus.IDLE,


    // data
    add_research_type_data: null,
    get_research_type_data: null,
    // error
    add_research_type_error: null,
    get_research_type_error: null,
};

const Research_type_slice = createSlice({
    name: "research_type",
    initialState,
    reducers: {
        setSpecieIdleStatus(state) {
            state.add_research_type_status = asyncStatus.IDLE;
        },
    },
    extraReducers: (builder) => {

        // Add Study Type
        builder.addCase(add_research_topic_service_auth.pending, (state, action) => {
            state.add_research_type_status = asyncStatus.LOADING;
        });

        builder.addCase(add_research_topic_service_auth.fulfilled, (state, { payload }) => {
            state.add_research_type_status = asyncStatus.SUCCEEDED;
            state.add_research_type_data = payload.data;

            success_toast_message("Add Successfully");
            state.add_research_type_error = null;
        });

        builder.addCase(add_research_topic_service_auth.rejected, (state, action) => {
            state.add_research_type_status = asyncStatus.ERROR;
            state.add_research_type_error = action.error;
            error_toast_message(action.error.message);

        });

        // Get Study Type
        builder.addCase(get_research_topic_service_auth.pending, (state, action) => {
            state.get_research_type_status = asyncStatus.LOADING;
        });

        builder.addCase(get_research_topic_service_auth.fulfilled, (state, { payload }) => {
            state.get_research_type_status = asyncStatus.SUCCEEDED;
            state.get_research_type_data = payload;
            state.get_research_type_error = null;
        });

        builder.addCase(get_research_topic_service_auth.rejected, (state, action) => {
            state.get_research_type_status = asyncStatus.ERROR;
            state.get_research_type_error = action.error;
            error_toast_message(action.error.message);

        });



    },
});

export const { setSpecieIdleStatus } = Research_type_slice.actions;

export default Research_type_slice.reducer;
