import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setShowLogModal } from '../Store/slices/bulk_upload_log_slice';

const GlobalBulkUploadProgress = () => {
  const { showBulkProgress, bulkProgress } = useSelector(
    (state) => state.bulkUpload
  );
  const dispatch = useDispatch();
  if (!showBulkProgress) return null;
  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      zIndex: 9999,
      background: 'rgba(255,255,255,0.95)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      borderRadius: 12,
      padding: '18px 32px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minWidth: 220
    }}>
      <span style={{ fontWeight: 600, color: '#004c78', marginBottom: 8 }}>Bulk Uploading PDFs...</span>
      <div style={{ width: '100%', background: '#e5e7eb', borderRadius: 8, height: 10, marginBottom: 8 }}>
        <div style={{ width: `${bulkProgress}%`, background: '#22c55e', height: '100%', borderRadius: 8, transition: 'width 0.3s' }} />
      </div>
      <span style={{ fontSize: 13, color: '#555' }}>{bulkProgress < 100 ? `Uploading... (${bulkProgress}%)` : 'Processing...'}</span>
      <button
        style={{
          marginTop: 12,
          padding: '6px 18px',
          background: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          fontWeight: 500,
          cursor: 'pointer',
          fontSize: 14
        }}
        onClick={() => dispatch(setShowLogModal(true))}
      >
        Results
      </button>
    </div>
  );
};

export default GlobalBulkUploadProgress;
