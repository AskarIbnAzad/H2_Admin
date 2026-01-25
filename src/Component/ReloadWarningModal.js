import React from 'react';

const ReloadWarningModal = ({ open, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full flex flex-col items-center">
        <div className="text-2xl font-bold mb-2 text-red-600">Are you sure?</div>
        <div className="text-gray-700 mb-6 text-center">
          You have a bulk upload in progress. If you reload, your progress will be lost.
        </div>
        <div className="flex gap-4 w-full justify-center">
          <button
            className="px-6 py-2 bg-gray-200 rounded font-medium hover:bg-gray-300"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700"
            onClick={onConfirm}
          >
            Reload Anyway
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReloadWarningModal;
