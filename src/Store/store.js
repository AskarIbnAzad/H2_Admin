import {
  applyMiddleware,
  combineReducers,
  compose,
  configureStore,
} from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";

import user_auth_slice from "./slices/user_auth_slice";
import bio_marker_slice from "./slices/bio_marker_slice";
import Specie_slice from "./slices/Specie_slice";
import Study_Type_slice from "./slices/Study_type_slice";
import Research_type_slice from "./slices/Research_type_slice";
import Organs_slice from "./slices/Organs_slice";
import Systems_slice from "./slices/Systems_slice";
import Methods_slice from "./slices/Methods_slice";
import Article_slice from "./slices/Article_slice";
import userAuthSlice from "./slices/user_management_slice";
import bulkUploadSlice from "./slices/bulk_upload_slice";
import bulkUploadLogReducer from "./slices/bulk_upload_log_slice";
import Disease_slice from "./slices/Disease_slice";
import Tutorial_slice from "./slices/Tutorial_slice";

let reducers = combineReducers({
  userAuth: user_auth_slice,
  biomarker: bio_marker_slice,
  species: Specie_slice,
  StudyType: Study_Type_slice,
  ResearchType: Research_type_slice,
  organs: Organs_slice,
  systems: Systems_slice,
  method: Methods_slice,
  article: Article_slice,
  user: userAuthSlice,
  bulkUpload: bulkUploadSlice,
  bulkUploadLog: bulkUploadLogReducer,
  diseases: Disease_slice,
  tutorial: Tutorial_slice,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = configureStore(
  { reducer: reducers },
  composeEnhancers(applyMiddleware(thunk))
);
export default store;
