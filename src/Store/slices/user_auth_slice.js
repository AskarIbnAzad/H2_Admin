import { createSlice } from "@reduxjs/toolkit";
import { asyncStatus, save_tokens_constant } from "../../Utils/asyncStatus";
import { check_auth, fetch_pmid_Article, login_service_auth } from "../../Services/authentication";
import { error_toast_message, success_toast_message } from "../../Utils/toast_message";


const initialState = {
    // status
    check_auth_status: asyncStatus.IDLE,
    login_status: asyncStatus.IDLE,
    user_logout_status: asyncStatus.IDLE,
    Pmid_Article_Loading: false,




    // data
    userAuth: false,
    user: null,
    authTokens: null,
    user_profile: null,
    Pmid_Article_Data: null,

    // error
    check_auth_error: null,
    login_error: null,
    user_logout_error: null,
    Pmid_Article_Error: null,
};

const user_auth_slice = createSlice({
    name: "userAuth",
    initialState,
    reducers: {
        setAuthState(state, { payload }) {
            state.userAuth = payload
            state.check_auth_status = asyncStatus.SUCCEEDED
        },
        setIdleStatus(state) {
            state.login_status = asyncStatus.IDLE;
        },
    },
    extraReducers: (builder) => {

        builder.addCase(login_service_auth.pending, (state, action) => {
            state.login_status = asyncStatus.LOADING;
        });

        builder.addCase(login_service_auth.fulfilled, (state, { payload }) => {
            state.authTokens = payload.token;
            state.login_status = asyncStatus.SUCCEEDED;
            state.user = payload.data;
            state.userAuth = true;
            success_toast_message("Login Successfully");
            state.login_error = null;
            localStorage.setItem(
                save_tokens_constant.AUTH,
                payload.token
            );
        });

        builder.addCase(login_service_auth.rejected, (state, action) => {
            state.login_status = asyncStatus.ERROR;
            state.login_error = action.error;
            error_toast_message(action.error.message);

        });

        // check auth ========================>

        builder.addCase(check_auth.pending, (state, action) => {
            state.check_auth_status = asyncStatus.LOADING;
        });

        builder.addCase(check_auth.fulfilled, (state, { payload }) => {
            const { status, user } = payload;
            state.check_auth_status = asyncStatus.SUCCEEDED;
            if (status === "success") {
                state.user = user;
                state.userAuth = true;
            } else {
                state.userAuth = false;
            }
        });

        builder.addCase(check_auth.rejected, (state, action) => {
            state.check_auth_status = asyncStatus.ERROR;
            state.check_auth_error = action.error;
            // error_toast_message(action.error.message);

        });


        builder
            .addCase(fetch_pmid_Article.pending, (state) => {
                state.Pmid_Article_Loading = true;
                state.Pmid_Article_Error = null;
                state.Pmid_Article_Data = [];
            })
            .addCase(fetch_pmid_Article.fulfilled, (state, action) => {
                state.Pmid_Article_Loading = false;
                state.Pmid_Article_Data = action.payload.resultList.result;
            })
            .addCase(fetch_pmid_Article.rejected, (state, action) => {
                state.Pmid_Article_Loading = false;
                state.Pmid_Article_Error = action.payload || 'Failed to fetch article.';
            });



    },
});

export const { setAuthState, setIdleStatus } = user_auth_slice.actions;

export default user_auth_slice.reducer;
