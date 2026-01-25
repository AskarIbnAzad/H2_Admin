// import React, { useEffect, useState } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import "react-pdf/dist/Page/AnnotationLayer.css";
// import "react-pdf/dist/Page/TextLayer.css";
// import { useLocation, useNavigate } from "react-router-dom";

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// export const PdfViewer = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [pdfUrl, setPdfUrl] = useState("");
//     const [numPages, setNumPages] = useState(null);
//     const [scale, setScale] = useState(1.0); // 🔍 Default zoom level

//     useEffect(() => {
//         if (location.state?.pdfUrl) {
//             setPdfUrl(location.state.pdfUrl);
//         } 
//     }, [location, navigate]);

//     const onDocumentLoadSuccess = ({ numPages }) => {
//         setNumPages(numPages);
//     };

//     // 🔍 Zoom Controls
//     const handleZoomIn = () => setScale(prevScale => Math.min(prevScale + 0.2, 3.0));
//     const handleZoomOut = () => setScale(prevScale => Math.max(prevScale - 0.2, 0.5));

//     return (
//         <div className="flex flex-col items-center justify-center h-full bg-gray-100">
//             <div className="border shadow-lg p-4 bg-white rounded-lg w-full max-w-4xl">
//                 <h2 className="text-center text-lg font-bold mb-4">PDF Viewer</h2>

//                 {/* 🔍 Zoom Controls */}
//                 <div className="flex justify-center mb-4 space-x-4">
//                     <button 
//                         onClick={handleZoomOut} 
//                         className="bg-gray-300 text-black px-3 py-2 rounded hover:bg-gray-400"
//                     >
//                         ➖ Zoom Out
//                     </button>
//                     <span className="text-lg font-semibold">{Math.round(scale * 100)}%</span>
//                     <button 
//                         onClick={handleZoomIn} 
//                         className="bg-gray-300 text-black px-3 py-2 rounded hover:bg-gray-400"
//                     >
//                         ➕ Zoom In
//                     </button>
//                 </div>

//                 {pdfUrl ? (
//                     <div className="overflow-auto max-h-[80vh] border">
//                         <Document 
//                             file={pdfUrl} 
//                             onLoadSuccess={onDocumentLoadSuccess}
//                         >
//                             {Array.from(new Array(numPages), (_, index) => (
//                                 <Page key={index} pageNumber={index + 1} scale={scale} />
//                             ))}
//                         </Document>
//                     </div>
//                 ) : (
//                     <p className="text-red-500 text-center">No PDF available.</p>
//                 )}
//             </div>
//         </div>
//     );
// };



import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


export const PdfViewer = () => {
    const location = useLocation();
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    // First try from router state
    if (location.state?.pdfUrl) {
      setPdfUrl(location.state.pdfUrl);
      return;
    }

    // Otherwise try query params
    const queryParams = new URLSearchParams(location.search);
    const pdfFromQuery = queryParams.get("pdfUrl");

    if (pdfFromQuery) {
      setPdfUrl(pdfFromQuery);
    }
  }, [location]);

  console.log("pdfUrl", pdfUrl);
    


    return (
        <div style={{ height: "90vh", padding: "1rem" }}>
             <button
                onClick={() => navigate(-1)}
                className="flex items-center mb-2 text-blue-500 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg px-4 py-2 transition duration-300 ease-in-out"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l-7-7 7-7" />
                </svg>
                Back
            </button>
            <iframe
                src={pdfUrl}
                style={{ width: "100%", height: "100%", border: "none" }}
                title="PDF Viewer"
            />
        </div>

    );
};