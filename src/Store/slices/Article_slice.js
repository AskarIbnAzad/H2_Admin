import { createSlice } from "@reduxjs/toolkit";
import { asyncStatus } from "../../Utils/asyncStatus";
import { error_toast_message, success_toast_message } from "../../Utils/toast_message";
import { add_article_service_auth, delete_article_service_auth, get_article_service_auth, get_dashboard_data_service_auth, update_article_status_service_auth } from "../../Services/ArticleService";


const initialState = {
    // status
    add_article_status: asyncStatus.IDLE,
    get_article_status: asyncStatus.IDLE,
    get_dashboard_data_status: asyncStatus.IDLE,
    delete_article_status: asyncStatus.IDLE,
    update_article_status_status: asyncStatus.IDLE,

    // data
    add_article_data: null,
    get_article_data: null,
    get_dashboard_data_data: null,
    delete_article_data: null,
    update_article_status_data: null,

    // error
    add_article_error: null,
    get_article_error: null,
    get_dashboard_data_error: null,
    delete_article_error: null,
    update_article_status_error: null,
};

const Article_slice = createSlice({
    name: "article",
    initialState,
    reducers: {
        setArticleIdleStatus(state) {
            state.add_article_status = asyncStatus.IDLE;
        },
        resetAddArticleData(state) {
            state.add_article_data = null;
        },
    },
    extraReducers: (builder) => {

        // Add Article
        builder.addCase(add_article_service_auth.pending, (state, action) => {
            state.add_article_status = asyncStatus.LOADING;
        });

        builder.addCase(add_article_service_auth.fulfilled, (state, { payload }) => {
            state.add_article_status = asyncStatus.SUCCEEDED;
            state.add_article_data = payload;


            success_toast_message(payload.message);
            state.add_article_error = null;
        });

        builder.addCase(add_article_service_auth.rejected, (state, action) => {
            state.add_article_status = asyncStatus.ERROR;
            state.add_article_error = action.error;
            error_toast_message(action.error.message);

        });

        // // Get Article
        builder.addCase(get_article_service_auth.pending, (state, action) => {
            state.get_article_status = asyncStatus.LOADING;
        });

        builder.addCase(get_article_service_auth.fulfilled, (state, { payload }) => {
            state.get_article_status = asyncStatus.SUCCEEDED;
            state.get_article_data = payload;
            state.get_article_error = null;
        });

        builder.addCase(get_article_service_auth.rejected, (state, action) => {
            state.get_article_status = asyncStatus.ERROR;
            state.get_article_error = action.error;
            error_toast_message(action.error.message);


        });

        // // Delete Article
        builder.addCase(delete_article_service_auth.pending, (state, action) => {
            state.delete_article_status = asyncStatus.LOADING;
        });

        builder.addCase(delete_article_service_auth.fulfilled, (state, { payload }) => {
            state.delete_article_status = asyncStatus.SUCCEEDED;
            state.delete_article_data = payload;
            state.delete_article_error = null;
            success_toast_message(payload.message);
        });

        builder.addCase(delete_article_service_auth.rejected, (state, action) => {
            state.delete_article_status = asyncStatus.ERROR;
            state.delete_article_error = action.error;
            error_toast_message(action.error.message);


        });


        // // Update Article
        builder.addCase(update_article_status_service_auth.pending, (state, action) => {
            state.update_article_status_status = asyncStatus.LOADING;
        });

        builder.addCase(update_article_status_service_auth.fulfilled, (state, { payload }) => {
            state.update_article_status_status = asyncStatus.SUCCEEDED;
            state.update_article_status_data = payload;
            state.update_article_status_error = null;
            success_toast_message(payload.message);
        });

        builder.addCase(update_article_status_service_auth.rejected, (state, action) => {
            state.update_article_status_status = asyncStatus.ERROR;
            state.update_article_status_error = action.error;
            error_toast_message(action.error.message);


        });


        // // Get Dashboard Data
        builder.addCase(get_dashboard_data_service_auth.pending, (state, action) => {
            state.get_dashboard_data_status = asyncStatus.LOADING;
        });

        builder.addCase(get_dashboard_data_service_auth.fulfilled, (state, { payload }) => {
            state.get_dashboard_data_status = asyncStatus.SUCCEEDED;
            state.get_dashboard_data_data = payload;
            state.get_dashboard_data_error = null;
        });

        builder.addCase(get_dashboard_data_service_auth.rejected, (state, action) => {
            state.get_dashboard_data_status = asyncStatus.ERROR;
            state.get_dashboard_data_error = action.error;
            error_toast_message(action.error.message);

        });



    },
});

export const { setArticleIdleStatus, resetAddArticleData } = Article_slice.actions;

export default Article_slice.reducer;
