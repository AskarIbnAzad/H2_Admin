
import { createAsyncThunk } from '@reduxjs/toolkit';
import { setBulkProgress, resetBulkProgress } from './bulk_upload_slice';
import { addLogEntry } from './bulk_upload_log_slice';
import { apiHandle } from '../../Config/ApiHandle/apiHandle';

// Utility to extract error info
function parseUploadError(err) {
  let errorMsg = err?.message || 'Upload failed';
  let exists = undefined;
  let pdf_url = err?.response?.data?.pdf_url || null;
  const data = err?.response?.data;
  const status = err?.response?.status;

  if (status === 409 && data?.message?.includes('DOI, PMID, or Title')) {
    errorMsg = 'Duplicate article: An article with the same DOI, PMID, or Title already exists.';
    exists = data?.exists === true;
  } else if (typeof data?.message === 'string' && data?.message.includes('<!doctype html>')) {
    errorMsg = 'Server error: Failed to process PDF. Please check your file or contact support.';
  } else if (status === 500 && data) {
    errorMsg = data?.message || data?.error || 'Server error: Failed to process PDF.';
    pdf_url = data?.pdf_url || pdf_url;
  }
  return { errorMsg, exists, pdf_url };
}

// Thunk for bulk uploading files and updating progress
export const bulkUploadFilesThunk = createAsyncThunk(
  'bulkUpload/bulkUploadFiles',
  async ({ files, onError, onComplete }, { dispatch }) => {
    let successCount = 0;
    let failedCount = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await apiHandle.post('process-and-submit', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        successCount++;
        // Save pdf_url if present
        const pdf_url = response?.data?.pdf_url;
        dispatch(addLogEntry({ fileName: file.name, status: 'success', pdf_url }));
      } catch (err) {
        failedCount++;
        const { errorMsg, exists, pdf_url } = parseUploadError(err);
        dispatch(addLogEntry({ fileName: file.name, status: 'failed', error: errorMsg, exists, pdf_url }));
        if (onError) onError('Some files failed to upload.');
      }
      // Update progress after each file
      const percent = Math.round(((i + 1) / files.length) * 100);
      dispatch(setBulkProgress(percent));
    }
    if (onComplete) onComplete();
    return { successCount, failedCount };
  }
);
