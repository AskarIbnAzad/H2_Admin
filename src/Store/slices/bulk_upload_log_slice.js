import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  log: [], // { fileName, status: 'success' | 'failed', error?: string }
  showLogModal: false,
};

const bulkUploadLogSlice = createSlice({
  name: 'bulkUploadLog',
  initialState,
  reducers: {
    addLogEntry: (state, action) => {
      state.log.push(action.payload);
    },
    clearLog: (state) => {
      state.log = [];
    },
    setShowLogModal: (state, action) => {
      state.showLogModal = action.payload;
    },
  },
});

export const { addLogEntry, clearLog, setShowLogModal } = bulkUploadLogSlice.actions;
export default bulkUploadLogSlice.reducer;
