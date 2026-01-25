import { createSlice } from "@reduxjs/toolkit";
import { asyncStatus } from "../../Utils/asyncStatus";
import { error_toast_message, success_toast_message } from "../../Utils/toast_message";
import { add_study_type_service_auth, get_study_type_service_auth } from "../../Services/SpecieService";


const initialState = {
    showDefaultRedux: false,
    showNonExperimental: false,
    BothTrueState: false,
    ShowConcernReportRedux: false,
    ShowInhalationRedux: false,
    ShowIngestionRedux: false,
    ShowCellCultureTissuesRedux: false,
    ShowTopicalApplicationsRedux: false,
    ShowDoseConcentrationComparisonRedux: false,
    ShowComparisonDetailRedux: false,
    showInhalationConcentrationFields : false,
    // status
    add_study_type_status: asyncStatus.IDLE,
    get_study_type_status: asyncStatus.IDLE,

    // data
    add_study_type_data: null,
    get_study_type_data: null,
    // error
    add_study_type_error: null,
    get_study_type_error: null,
};

const Study_Type_slice = createSlice({
    name: "study_type",
    initialState,
    reducers: {
        setSpecieIdleStatus(state) {
            state.add_study_type_status = asyncStatus.IDLE;
        },
        setDefaultStatus: (state, action) => {
            state.showDefaultRedux = action.payload;
        },
        setNonExperimentalStatus: (state, action) => {
            state.showNonExperimental = action.payload;
        },
        setBothStatus: (state, action) => {
            state.BothTrueState = action.payload;
        },
        setShowConcernReportStatus: (state, action) => {
            state.ShowConcernReportRedux = action.payload;
        },
        setShowInhalationStatus: (state, action) => {
            state.ShowInhalationRedux = action.payload;
        },
        setShowIngestionStatus: (state, action) => {
            state.ShowIngestionRedux = action.payload;
        },
        setShowCellCultureTissuesStatus: (state, action) => {
            state.ShowCellCultureTissuesRedux = action.payload;
        },
        setShowTopicalApplicationsStatus: (state, action) => {
            state.ShowTopicalApplicationsRedux = action.payload;
        },
        setShowInhalationConcentrationFields: (state, action) => {
            state.showInhalationConcentrationFields  = action.payload;
        },
        setShowDoseConcentrationComparisonStatus: (state, action) => {
            state.ShowDoseConcentrationComparisonRedux = action.payload;
        },
        setShowComparisonDetailStatus: (state, action) => {
            state.ShowComparisonDetailRedux = action.payload;
        },
    },
    extraReducers: (builder) => {

        // Add Study Type
        builder.addCase(add_study_type_service_auth.pending, (state, action) => {
            state.add_study_type_status = asyncStatus.LOADING;
        });

        builder.addCase(add_study_type_service_auth.fulfilled, (state, { payload }) => {
            state.add_study_type_status = asyncStatus.SUCCEEDED;
            state.add_study_type_data = payload.data;

            success_toast_message("Add Successfully");
            state.add_study_type_error = null;
        });

        builder.addCase(add_study_type_service_auth.rejected, (state, action) => {
            state.add_study_type_status = asyncStatus.ERROR;
            state.add_study_type_error = action.error;
            error_toast_message(action.error.message);

        });

        // Get Study Type
        builder.addCase(get_study_type_service_auth.pending, (state, action) => {
            state.get_study_type_status = asyncStatus.LOADING;
        });

        builder.addCase(get_study_type_service_auth.fulfilled, (state, { payload }) => {
            state.get_study_type_status = asyncStatus.SUCCEEDED;
            state.get_study_type_data = payload;
            state.get_study_type_error = null;
        });

        builder.addCase(get_study_type_service_auth.rejected, (state, action) => {
            state.get_study_type_status = asyncStatus.ERROR;
            state.get_study_type_error = action.error;
            error_toast_message(action.error.message);

        });



    },
});

export const {
    setSpecieIdleStatus,
    setNonExperimentalStatus,
    setBothStatus,
    setShowConcernReportStatus,
    setShowInhalationStatus,
    setShowIngestionStatus,
    setShowCellCultureTissuesStatus,
    setShowTopicalApplicationsStatus,
    setShowInhalationConcentrationFields,
    setShowDoseConcentrationComparisonStatus,
    setShowComparisonDetailStatus,
    setDefaultStatus
} = Study_Type_slice.actions;

export default Study_Type_slice.reducer;
