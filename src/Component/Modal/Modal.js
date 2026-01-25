// import React from "react";

// const ModalCom = ({ question, onClose, onConfirm }) => {
//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg shadow-2xl p-6 w-96 relative">
//                 {/* Modal Header */}
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-lg font-bold text-gray-800">Confirmation</h2>
//                     <button
//                         className="text-gray-500 hover:text-gray-800"
//                         onClick={onClose}
//                         aria-label="Close modal"
//                     >
//                         ✕
//                     </button>
//                 </div>

//                 {/* Modal Body */}
//                 <p className="text-gray-700 mb-6">{question}</p>

//                 {/* Modal Footer */}
//                 <div className="flex justify-end space-x-4">
//                     <button
//                         className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-all"
//                         onClick={onClose}
//                     >
//                         No
//                     </button>
//                     <button
//                         className="bg-[#004c78] text-white px-4 py-2 rounded-md hover:bg-[#004c78] transition-all"
//                         onClick={onConfirm}
//                     >
//                         Yes
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ModalCom;


import React from "react";

const ModalCom = ({ question, onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-96 max-w-[90%] relative animate-fadeIn">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-lg font-bold text-gray-800">Confirmation</h2>
                    <button
                        className="text-gray-500 hover:text-gray-800 transition-colors"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="bg-blue-50 border-l-4 border-[#004c78] p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-[#004c78]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-[#004c78]">
                                {question}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end space-x-4">
                    <button
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-all font-medium"
                        onClick={onClose}
                    >
                        No
                    </button>
                    <button
                        className="bg-[#004c78] text-white px-4 py-2 rounded-md hover:bg-[#004c78] transition-all font-medium"
                        onClick={onConfirm}
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
};

// Add this to your global CSS or component styles
const styles = `
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out forwards;
}
`;

export default ModalCom;