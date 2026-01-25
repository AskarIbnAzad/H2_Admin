import { createSlice } from "@reduxjs/toolkit";
import { asyncStatus } from "../../Utils/asyncStatus";
import { error_toast_message, success_toast_message } from "../../Utils/toast_message";
import { add_country_service_auth, add_roles_service_auth, add_specie_service_auth, delete_roles_service_auth, edit_roles_service_auth, edit_specie_service_auth, get_countries_service_auth, get_roles_service_auth, get_specie_service_auth } from "../../Services/SpecieService";


const initialState = {
    // status
    add_specie_status: asyncStatus.IDLE,
    get_specie_status: asyncStatus.IDLE,
    update_specie_status: asyncStatus.IDLE,
    get_country_status: asyncStatus.IDLE,
    add_country_status: asyncStatus.IDLE,



    // data
    add_specie_data: null,
    get_specie_data: null,
    update_specie_data: null,
    get_country_data: null,
    add_country_data: null,

    // error
    add_specie_error: null,
    get_specie_error: null,
    update_specie_error: null,
    get_country_error: null,
    add_country_error: null,

    // Country 

    get_roles_status: asyncStatus.IDLE,
    get_roles_data: null,
    get_roles_error: null,

    add_role_status: asyncStatus.IDLE,
    add_role_data: null,
    add_role_error: null,

    edit_role_status: asyncStatus.IDLE,
    edit_role_data: null,
    edit_role_error: null,

    delete_role_status: asyncStatus.IDLE,
    delete_role_data: null,
    delete_role_error: null,
};

const Specie_slice = createSlice({
    name: "species",
    initialState,
    reducers: {
        setSpecieIdleStatus(state) {
            state.add_specie_status = asyncStatus.IDLE;
        },
        setCountryIdleStatus(state) {
            state.add_country_status = asyncStatus.IDLE;
        },
        setSpecieUpdateIdleStatus(state) {
            state.update_specie_status = asyncStatus.IDLE;
        },
    },
    extraReducers: (builder) => {

        // Add Specie
        builder.addCase(add_specie_service_auth.pending, (state, action) => {
            state.add_specie_status = asyncStatus.LOADING;
        });

        builder.addCase(add_specie_service_auth.fulfilled, (state, { payload }) => {
            state.add_specie_status = asyncStatus.SUCCEEDED;
            state.add_specie_data = payload.data;

            success_toast_message("Add Successfully");
            state.add_specie_error = null;
        });

        builder.addCase(add_specie_service_auth.rejected, (state, action) => {
            state.add_specie_status = asyncStatus.ERROR;
            state.add_specie_error = action.error;
            error_toast_message(action.error.message);

        });

        // Get Specie
        builder.addCase(get_specie_service_auth.pending, (state, action) => {
            state.get_specie_status = asyncStatus.LOADING;
        });

        builder.addCase(get_specie_service_auth.fulfilled, (state, { payload }) => {
            state.get_specie_status = asyncStatus.SUCCEEDED;
            state.get_specie_data = payload;
            state.get_specie_error = null;
        });

        builder.addCase(get_specie_service_auth.rejected, (state, action) => {
            state.get_specie_status = asyncStatus.ERROR;
            state.get_specie_error = action.error;
            error_toast_message(action.error.message);

        });

        // Get Country
        builder.addCase(get_countries_service_auth.pending, (state, action) => {
            state.get_country_status = asyncStatus.LOADING;
        });

        builder.addCase(get_countries_service_auth.fulfilled, (state, { payload }) => {
            state.get_country_status = asyncStatus.SUCCEEDED;
            state.get_country_data = payload;
            state.get_country_error = null;
        });

        builder.addCase(get_countries_service_auth.rejected, (state, action) => {
            state.get_country_status = asyncStatus.ERROR;
            state.get_country_error = action.error;
            error_toast_message(action.error.message);

        });


        // Add Country
        builder.addCase(add_country_service_auth.pending, (state, action) => {
            state.add_country_status = asyncStatus.LOADING;
        });

        builder.addCase(add_country_service_auth.fulfilled, (state, { payload }) => {
            state.add_country_status = asyncStatus.SUCCEEDED;
            state.add_country_data = payload;
            state.add_country_error = null;
        });

        builder.addCase(add_country_service_auth.rejected, (state, action) => {
            state.add_country_status = asyncStatus.ERROR;
            state.add_country_error = action.error;
            error_toast_message(action.error.message);

        });

        // Update Specie
        builder.addCase(edit_specie_service_auth.pending, (state, action) => {
            state.update_specie_status = asyncStatus.LOADING;
        });

        builder.addCase(edit_specie_service_auth.fulfilled, (state, { payload }) => {
            state.update_specie_status = asyncStatus.SUCCEEDED;
            state.update_specie_data = payload;
            state.update_specie_error = null;
            success_toast_message("Update Successfully");
        });

        builder.addCase(edit_specie_service_auth.rejected, (state, action) => {
            state.update_specie_status = asyncStatus.ERROR;
            state.update_specie_error = action.error;
            error_toast_message(action.error.message);

        });

        // country

        // Get Roles
        builder.addCase(get_roles_service_auth.pending, (state) => {
            state.get_roles_status = asyncStatus.LOADING;
        });
        builder.addCase(get_roles_service_auth.fulfilled, (state, { payload }) => {
            state.get_roles_status = asyncStatus.SUCCEEDED;
            state.get_roles_data = payload;
            state.get_roles_error = null;
        });
        builder.addCase(get_roles_service_auth.rejected, (state, action) => {
            state.get_roles_status = asyncStatus.ERROR;
            state.get_roles_error = action.error;
            error_toast_message(action.error.message);
        });

        // Add Role
        builder.addCase(add_roles_service_auth.pending, (state) => {
            state.add_role_status = asyncStatus.LOADING;
        });
        builder.addCase(add_roles_service_auth.fulfilled, (state, { payload }) => {
            state.add_role_status = asyncStatus.SUCCEEDED;
            state.add_role_data = payload;
            state.add_role_error = null;
        });
        builder.addCase(add_roles_service_auth.rejected, (state, action) => {
            state.add_role_status = asyncStatus.ERROR;
            state.add_role_error = action.error;
            error_toast_message(action.error.message);
        });

        // Edit Role
        builder.addCase(edit_roles_service_auth.pending, (state) => {
            state.edit_role_status = asyncStatus.LOADING;
        });
        builder.addCase(edit_roles_service_auth.fulfilled, (state, { payload }) => {
            state.edit_role_status = asyncStatus.SUCCEEDED;
            state.edit_role_data = payload;
            state.edit_role_error = null;
        });
        builder.addCase(edit_roles_service_auth.rejected, (state, action) => {
            state.edit_role_status = asyncStatus.ERROR;
            state.edit_role_error = action.error;
            error_toast_message(action.error.message);
        });

        // Delete Role
        builder.addCase(delete_roles_service_auth.pending, (state) => {
            state.delete_role_status = asyncStatus.LOADING;
        });
        builder.addCase(delete_roles_service_auth.fulfilled, (state, { payload }) => {
            state.delete_role_status = asyncStatus.SUCCEEDED;
            state.delete_role_data = payload;
            state.delete_role_error = null;
        });
        builder.addCase(delete_roles_service_auth.rejected, (state, action) => {
            state.delete_role_status = asyncStatus.ERROR;
            state.delete_role_error = action.error;
            error_toast_message(action.error.message);
        });

    },
});

export const { setSpecieIdleStatus, setSpecieUpdateIdleStatus, setCountryIdleStatus } = Specie_slice.actions;

export default Specie_slice.reducer;
