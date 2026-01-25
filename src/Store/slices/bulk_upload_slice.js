import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showBulkProgress: false,
  bulkProgress: 0,
};

const bulkUploadSlice = createSlice({
  name: 'bulkUpload',
  initialState,
  reducers: {
    setShowBulkProgress(state, action) {
      state.showBulkProgress = action.payload;
    },
    setBulkProgress(state, action) {
      state.bulkProgress = action.payload;
    },
    resetBulkProgress(state) {
      state.showBulkProgress = false;
      state.bulkProgress = 0;
    },
  },
});

export const { setShowBulkProgress, setBulkProgress, resetBulkProgress } = bulkUploadSlice.actions;
export default bulkUploadSlice.reducer;
