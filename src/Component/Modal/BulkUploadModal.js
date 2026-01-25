import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { FaTimes, FaTrashAlt } from "react-icons/fa";

const BulkUploadModal = ({ open, onClose, bulkFiles, bulkError, bulkUploading, onFileChange, onRemoveFile, onUpload }) => (

    
    <Modal open={open} onClose={onClose}>
        <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 520,
            bgcolor: '#f8fafc',
            borderRadius: 3,
            boxShadow: 24,
            p: 0,
        }}>
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-[#004c78] rounded-t-lg">
                <h2 className="text-lg font-bold text-white">Bulk PDF Upload</h2>
                <button onClick={onClose} className="text-white hover:text-gray-200 text-xl"><FaTimes /></button>
            </div>
            <div className="px-6 py-6">
                <label className="block mb-4">
                    <span className="block text-sm text-gray-700 mb-1">You can upload up to 20 PDF files at a time.</span>
                    <span className="block text-sm font-medium text-gray-700 mb-2">Select PDF files</span>
                    <input 
                        type="file"
                        accept="application/pdf"
                        multiple
                        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#004c78] file:text-white hover:file:bg-blue-900"
                        onChange={onFileChange}
                    />
                </label>
                {bulkFiles.length > 0 && (
                    <div className="mt-2 rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden" style={{maxHeight: '260px', overflowY: 'auto'}}>
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 text-left font-semibold text-gray-700">File Name</th>
                                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Size (KB)</th>
                                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bulkFiles.map((file, idx) => (
                                    <tr key={idx} className="border-t hover:bg-blue-50 transition-colors">
                                        <td className="px-4 py-2 font-medium text-gray-900">{file.name}</td>
                                        <td className="px-4 py-2 text-gray-600">{Math.round(file.size / 1024)}</td>
                                        <td className="px-4 py-2 text-center">
                                            <button
                                                className="text-red-600 hover:text-red-800 p-1 rounded-full border border-transparent hover:border-red-200 transition"
                                                onClick={() => onRemoveFile(idx)}
                                                title="Remove file"
                                                type="button"
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {bulkError && <div className="text-red-600 mt-2">{bulkError}</div>}
                <div className="flex justify-end gap-2 mt-6">
                    <button
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold"
                        onClick={onClose}
                        disabled={bulkUploading}
                    >Cancel</button>
                    <button
                        className="px-4 py-2 rounded bg-[#004c78] text-white hover:bg-blue-900 font-semibold disabled:opacity-50"
                        onClick={onUpload}
                        disabled={bulkUploading || !bulkFiles.length}
                    >{bulkUploading ? 'Uploading...' : 'Extract & Upload PDFs'}</button>
                </div>
            </div>
        </Box>
    </Modal>
);

export default BulkUploadModal;