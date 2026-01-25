import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setShowLogModal, clearLog } from '../Store/slices/bulk_upload_log_slice';

const BulkUploadLogModal = () => {
  const dispatch = useDispatch();
  const show = useSelector(state => state.bulkUploadLog.showLogModal);
  const log = useSelector(state => state.bulkUploadLog.log);
  const uploading = useSelector(state => state.bulkUpload.showBulkProgress);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none">
      <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl border-l border-gray-200 flex flex-col p-0 transition-transform duration-300 pointer-events-auto animate-slideIn">
        <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b">
          <h2 className="text-2xl font-bold">Bulk Upload Results</h2>
          <button
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            onClick={() => dispatch(setShowLogModal(false))}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-4 w-full">
          {uploading && log.length === 0 && (
            <div className="flex flex-col items-center justify-center w-full h-full py-12">
              <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              <div className="text-lg font-medium text-blue-700">Uploading in progress...</div>
              <div className="text-sm text-gray-500 mt-2">Please wait until the upload is complete.</div>
            </div>
          )}
          {uploading && log.length > 0 && (
            <>
              <table className="w-full text-sm mb-4 ">
                <thead className="bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th className="text-left py-2 px-3">File Name</th>
                    <th className="text-left py-2 px-3">Status</th>
                    <th className="text-left py-2 px-3">Already Exists</th>
                    <th className="text-left py-2 px-3">PDF URL</th>
                    <th className="text-left py-2 px-3">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {log.map((entry, idx) => (
                    <tr key={idx} className="border-b last:border-b-0">
                      <td className="py-2 px-3">{entry.fileName}</td>
                      <td className={`py-2 px-3 font-semibold ${entry.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>{entry.status}</td>
                      <td className="py-2 px-3">{entry.exists === true ? 'Yes' : entry.exists === false ? 'No' : '-'}</td>
                      <td className="py-2 px-3">
                        {entry.pdf_url ? (
                          <a href={entry.pdf_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">PDF Link</a>
                        ) : '-'}
                      </td>
                      <td className="py-2 px-3">{entry.error || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex flex-col items-center justify-center w-full py-4">
                <svg className="animate-spin h-8 w-8 text-blue-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                <div className="text-base font-medium text-blue-700">Uploading in progress...</div>
              </div>
            </>
          )}
          {!uploading && log.length === 0 && (
            <div className="flex flex-col items-center justify-center w-full h-full py-12">
              <svg className="h-10 w-10 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-lg font-medium text-gray-700">No results found</div>
              <div className="text-sm text-gray-500 mt-2">No upload log to display yet.</div>
            </div>
          )}
          {!uploading && log.length > 0 && (
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="text-left py-2 px-3">File Name</th>
                  <th className="text-left py-2 px-3">Status</th>
                  <th className="text-left py-2 px-3">Already Exists</th>
                  <th className="text-left py-2 px-3">PDF URL</th>
                  <th className="text-left py-2 px-3">Error</th>
                </tr>
              </thead>
              <tbody>
                {log.map((entry, idx) => (
                  <tr key={idx} className="border-b last:border-b-0">
                    <td className="py-2 px-3">{entry.fileName}</td>
                    <td className={`py-2 px-3 font-semibold ${entry.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>{entry.status}</td>
                    <td className="py-2 px-3">{entry.exists === true ? 'Yes' : entry.exists === false ? 'No' : '-'}</td>
                    <td className="py-2 px-3">
                      {entry.pdf_url ? (
                        <a href={entry.pdf_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">PDF Link</a>
                      ) : '-'}
                    </td>
                    <td className="py-2 px-3">{entry.error || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="flex justify-end w-full gap-3 px-8 pb-8">
          {/* Download CSV button, only show when not uploading and log has entries */}
          {!uploading && log.length > 0 && (
            <button
              className="px-5 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700"
              onClick={() => {
                // Prepare CSV content
                const headers = ['File Name', 'Status', 'Already Exists', 'Error', 'PDF URL'];
                const rows = log.map(entry => [
                  entry.fileName,
                  entry.status,
                  entry.exists === true ? 'Yes' : entry.exists === false ? 'No' : '-',
                  (entry.error || '-').replace(/\n|\r|\t|,/g, ' '),
                  entry.pdf_url || '-'
                ]);
                const csvContent = [
                  headers.join(','),
                  ...rows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
                ].join('\r\n');
                // Create blob and download
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'bulk_upload_log.csv';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
            >
              Download CSV
            </button>
          )}
          <button
            className={`px-5 py-2 bg-gray-200 rounded font-medium ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
            onClick={() => !uploading && dispatch(clearLog())}
            disabled={uploading}
          >
            Clear Log
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadLogModal;
