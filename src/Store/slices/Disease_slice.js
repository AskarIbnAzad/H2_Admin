import { createSlice } from "@reduxjs/toolkit";
import { asyncStatus } from "../../Utils/asyncStatus";
import { error_toast_message, success_toast_message } from "../../Utils/toast_message";
import {
  add_disease_service_auth,
  get_disease_service_auth,
  edit_disease_service_auth,
  delete_disease_service_auth
} from "../../Services/DiseaseService";

const initialState = {
  // status
  add_disease_status: asyncStatus.IDLE,
  get_disease_status: asyncStatus.IDLE,
  update_disease_status: asyncStatus.IDLE,
  delete_disease_status: asyncStatus.IDLE,

  // data
  add_disease_data: null,
  get_disease_data: null,
  update_disease_data: null,
  delete_disease_data: null,

  // error
  add_disease_error: null,
  get_disease_error: null,
  update_disease_error: null,
  delete_disease_error: null,
};

const Disease_slice = createSlice({
  name: "diseases",
  initialState,
  reducers: {
    setDiseaseIdleStatus(state) {
      state.add_disease_status = asyncStatus.IDLE;
    },
    setDiseaseUpdateIdleStatus(state) {
      state.update_disease_status = asyncStatus.IDLE;
    },
    setDiseaseDeleteIdleStatus(state) {
      state.delete_disease_status = asyncStatus.IDLE;
    },
  },
  extraReducers: (builder) => {
    // Add Disease
    builder.addCase(add_disease_service_auth.pending, (state) => {
      state.add_disease_status = asyncStatus.LOADING;
    });
    builder.addCase(add_disease_service_auth.fulfilled, (state, { payload }) => {
      state.add_disease_status = asyncStatus.SUCCEEDED;
      state.add_disease_data = payload.data;
      success_toast_message("Disease added successfully");
      state.add_disease_error = null;
    });
    builder.addCase(add_disease_service_auth.rejected, (state, action) => {
      state.add_disease_status = asyncStatus.ERROR;
      state.add_disease_error = action.error;
      error_toast_message(action.error.message);
    });

    // Get Diseases
    builder.addCase(get_disease_service_auth.pending, (state) => {
      state.get_disease_status = asyncStatus.LOADING;
    });
    builder.addCase(get_disease_service_auth.fulfilled, (state, { payload }) => {
      state.get_disease_status = asyncStatus.SUCCEEDED;
      state.get_disease_data = payload;
      state.get_disease_error = null;
    });
    builder.addCase(get_disease_service_auth.rejected, (state, action) => {
      state.get_disease_status = asyncStatus.ERROR;
      state.get_disease_error = action.error;
      error_toast_message(action.error.message);
    });

    // Edit Disease
    builder.addCase(edit_disease_service_auth.pending, (state) => {
      state.update_disease_status = asyncStatus.LOADING;
    });
    builder.addCase(edit_disease_service_auth.fulfilled, (state, { payload }) => {
      state.update_disease_status = asyncStatus.SUCCEEDED;
      state.update_disease_data = payload;
      state.update_disease_error = null;
      success_toast_message("Disease updated successfully");
    });
    builder.addCase(edit_disease_service_auth.rejected, (state, action) => {
      state.update_disease_status = asyncStatus.ERROR;
      state.update_disease_error = action.error;
      error_toast_message(action.error.message);
    });

    // Delete Disease
    builder.addCase(delete_disease_service_auth.pending, (state) => {
      state.delete_disease_status = asyncStatus.LOADING;
    });
    builder.addCase(delete_disease_service_auth.fulfilled, (state, { payload }) => {
      state.delete_disease_status = asyncStatus.SUCCEEDED;
      state.delete_disease_data = payload;
      state.delete_disease_error = null;
      success_toast_message("Disease deleted successfully");
    });
    builder.addCase(delete_disease_service_auth.rejected, (state, action) => {
      state.delete_disease_status = asyncStatus.ERROR;
      state.delete_disease_error = action.error;
      error_toast_message(action.error.message);
    });
  },
});

export const { setDiseaseIdleStatus, setDiseaseUpdateIdleStatus, setDiseaseDeleteIdleStatus } = Disease_slice.actions;

export default Disease_slice.reducer;
