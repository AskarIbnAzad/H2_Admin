// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { colorTheme } from '../../Utils/colortheme';
// import wordFile from "../../assets/questions.docx";

// const PDFUploadComponent = () => {
//     const [pdfFile, setPdfFile] = useState(null);
//     const [responseMessage, setResponseMessage] = useState("");
//     const [taskId, setTaskId] = useState("");
//     const [loading, setLoading] = useState(false);  
//     const [statusMessage, setStatusMessage] = useState(""); 
//     const [taskData, setTaskData] = useState(null); // Store task result

//     useEffect(() => {
//         if (taskId) {
//             const intervalId = setInterval(handleStatusCheck, 5000); // Poll every 5 seconds
//             return () => clearInterval(intervalId); // Clean up the interval on component unmount
//         }
//     }, [taskId]);

//     const handleFileChange = (event) => {
//         const file = event.target.files[0];
//         if (file && file.type === "application/pdf") {
//             setPdfFile(file);
//         } else {
//             alert("Please upload a valid PDF file.");
//         }
//     };

//     const handleDrop = (event) => {
//         event.preventDefault();
//         const file = event.dataTransfer.files[0];
//         if (file && file.type === "application/pdf") {
//             setPdfFile(file);
//         } else {
//             alert("Please upload a valid PDF file.");
//         }
//     };

//     const handleDragOver = (event) => {
//         event.preventDefault();
//     };

//     const handleStatusCheck = async () => {
//         if (!taskId) return;

//         try {
//             const statusResponse = await axios.get(`https://mhi-lt-01bcf447b017.herokuapp.com/status/${taskId}`);
//             const { status, result } = statusResponse.data;

//             if (status === 'processing') {
//                 setStatusMessage('Processing... Please wait.');
//             } else if (status === 'completed') {
//                 setStatusMessage('Successfully Uploaded');
//                 setTaskData(result); // Store result data
//                 setTaskId(""); // Stop polling
//             } else {
//                 setStatusMessage('Upload Failed');
//             }
//         } catch (error) {
//             console.error('Error checking status:', error);
//             setStatusMessage('Error checking status');
//         }
//     };

//     const handleUpload = async () => {
//         if (pdfFile) {
//             setLoading(true);  // Set loading to true
//             const formData = new FormData();
//             formData.append('pdf', pdfFile);

//             // Convert word file to blob before appending
//             const wordResponse = await fetch(wordFile);
//             const wordBlob = await wordResponse.blob();
//             const wordFileObj = new File([wordBlob], "questions.docx", { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });

//             formData.append('word', wordFileObj);

//             try {
//                 const response = await axios.post(
//                     'https://mhi-lt-01bcf447b017.herokuapp.com/upload_files',
//                     formData,
//                     {
//                         headers: {
//                             'Content-Type': 'multipart/form-data',
//                         },
//                         timeout: 60000,
//                     }
//                 );

//                 // Handle success response
//                 setResponseMessage("Task started in the background! Please wait while we process the file.");
//                 setTaskId(response.data.task_id); // Set taskId for polling
//                 setPdfFile(null); // Clear file input after upload
//             } catch (error) {
//                 console.error('Error uploading files:', error);
//                 alert('Failed to upload the files.');
//             } finally {
//                 setLoading(false);  // Stop loading after request
//             }
//         } else {
//             alert("No PDF file selected.");
//         }
//     };

//     return (
// <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg mt-6 text-center">
//     <h2 className="text-2xl font-bold mb-6">Upload PDF</h2>

//     {!taskId && !taskData && (
//         <div>
//             <div
//                 className={`border-2 border-dashed border-blue-800 p-6 mb-4"`}
//                 onDrop={handleDrop}
//                 onDragOver={handleDragOver}
//             >
//                 {pdfFile ? (
//                     <p>{pdfFile.name}</p>
//                 ) : (
//                     <p>Drag & Drop or <span className="cursor-pointer" style={{ color: colorTheme.primary }}>Choose file</span> to upload</p>
//                 )}
//                 <input
//                     type="file"
//                     accept="application/pdf"
//                     className="hidden"
//                     id="pdfInput"
//                     onChange={handleFileChange}
//                 />
//             </div>
//             <div className="mt-4">
//                 <label
//                     htmlFor="pdfInput"
//                     className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer hover:bg-blue-700 mr-2"
//                 >
//                     Choose File
//                 </label>
//                 <button
//                     onClick={handleUpload}
//                     className="text-white py-2 px-4 rounded hover:bg-green-700"
//                     style={{ backgroundColor: colorTheme.primary }}
//                     disabled={loading}  // Disable button while loading
//                 >
//                     {loading ? 'Uploading...' : 'Upload'}
//                 </button>
//             </div>
//         </div>
//     )}

//     {/* Display the status message */}
//     {responseMessage && (
//         <div className="mt-4">
//             <p className="text-lg text-blue-700 font-semibold">{responseMessage}</p>
//         </div>
//     )}

//     {statusMessage && (
//         <div className="mt-4">
//             <p className="text-lg text-green-600 font-semibold">{statusMessage}</p>
//         </div>
//     )}

//     {/* Render task result */}
// {taskData && (
//     <div className="mt-6 text-left">
//         <h3 className="text-xl font-bold mb-4">Task Result</h3>
//         {taskData.map((item, index) => (
//             <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg">
//                 <strong>{item.Question}:</strong>
//                 <p>{Array.isArray(item.Answer) ? item.Answer.join(', ') : item.Answer}</p>
//             </div>
//         ))}
//     </div>
// )}
// </div>
//     );
// };

// export default PDFUploadComponent;




import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { colorTheme } from '../../Utils/colortheme';
import wordFile from "../../assets/questions.docx";
import { Stack, Grid } from "@mui/material"
const PDFUploadComponent = () => {
    const [pdfFile, setPdfFile] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");
    const [taskId, setTaskId] = useState("");
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [taskData, setTaskData] = useState(null);

    const [formData, setFormData] = useState({
        title: '', authors: '', year: '', country: '', pmid: '', doi: '', abstract: '',
        journal: '', journalURL: '', volume: '', pages: '', impactFactor: '', sciMAGO: '',
        outcome: '', studyType: '', species: [], researchtopic: [], diseaseModel: '', system: [],
        organ: '', ph: '', isERW: '', methodOfAdmin: '', drugComparison: '', pharmacokinetics: '',
        doseComparison: '', methodsComparison: '', h2Duration: '', inhalationConcentration: '',
        cellCultureConcentration: '', bothConcentration: '', h2DoseBoth: '', relativeDoseBoth: '',
        geneExpression: ''
    });

    useEffect(() => {
        if (taskId) {
            const intervalId = setInterval(handleStatusCheck, 5000);
            return () => clearInterval(intervalId);
        }
    }, [taskId]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
            setPdfFile(file);
        } else {
            alert("Please upload a valid PDF file.");
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && file.type === "application/pdf") {
            setPdfFile(file);
        } else {
            alert("Please upload a valid PDF file.");
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleStatusCheck = async () => {
        if (!taskId) return;

        try {
            const statusResponse = await axios.get(`https://mhi-lt-01bcf447b017.herokuapp.com/status/${taskId}`);
            const { status, result } = statusResponse.data;

            if (status === 'processing') {
                // setStatusMessage('Processing... Please wait.');
                setStatusMessage('Processing... Please wait. This will take approximately 1 to 2 minutes.');

            } else if (status === 'completed') {
                setStatusMessage('Successfully Uploaded');
                mapTaskDataToForm(result);
                setTaskData(result);
                setTaskId("");
            } else {
                setStatusMessage('Upload Failed');
            }
        } catch (error) {
            console.error('Error checking status:', error);
            setStatusMessage('Error checking status');
        }
    };

    const handleUpload = async () => {
        if (pdfFile) {
            setLoading(true);
            const formData = new FormData();
            formData.append('pdf', pdfFile);

            const wordResponse = await fetch(wordFile);
            const wordBlob = await wordResponse.blob();
            const wordFileObj = new File([wordBlob], "questions.docx", { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });

            formData.append('word', wordFileObj);

            try {
                const response = await axios.post(
                    'https://mhi-lt-01bcf447b017.herokuapp.com/upload_files',
                    formData,
                    { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 }
                );

                setResponseMessage("Task started in the background! Please wait while we process the file.");
                setTaskId(response.data.task_id);
                setPdfFile(null);
            } catch (error) {
                console.error('Error uploading files:', error);
                alert('Failed to upload the files.');
            } finally {
                setLoading(false);
            }
        } else {
            alert("No PDF file selected.");
        }
    };

    // Map task data to form fields based on question number (e.g., "Question #1")
    const mapTaskDataToForm = (data) => {
        data.forEach(item => {
            const questionNumber = item.Question.split(":")[0].trim();

            switch (questionNumber) {
                case "Question #1":
                    setFormData(prevData => ({ ...prevData, title: item.Answer }));
                    break;
                case "Question #2":
                    setFormData(prevData => ({ ...prevData, authors: item.Answer }));
                    break;
                case "Question #3":
                    setFormData(prevData => ({ ...prevData, year: item.Answer }));
                    break;
                case "Question #4":
                    setFormData(prevData => ({ ...prevData, country: item.Answer }));
                    break;
                case "Question #6":
                    setFormData(prevData => ({ ...prevData, pmid: item.Answer }));
                    break;
                case "Question #7":
                    setFormData(prevData => ({ ...prevData, doi: item.Answer }));
                    break;
                case "Question #8":
                    setFormData(prevData => ({ ...prevData, abstract: item.Answer }));
                    break;
                case "Question #9":
                    setFormData(prevData => ({ ...prevData, journal: item.Answer }));
                    break;
                case "Question #10":
                    setFormData(prevData => ({ ...prevData, journalURL: item.Answer }));
                    break;
                case "Question #11":
                    setFormData(prevData => ({ ...prevData, volume: item.Answer }));
                    break;
                case "Question #12":
                    setFormData(prevData => ({ ...prevData, pages: item.Answer }));
                    break;
                case "Question #13":
                    setFormData(prevData => ({ ...prevData, impactFactor: item.Answer }));
                    break;
                case "Question #14":
                    setFormData(prevData => ({ ...prevData, sciMAGO: item.Answer }));
                    break;
                case "Question #15":
                    setFormData(prevData => ({ ...prevData, outcome: item.Answer }));
                    break;
                case "Question #16":
                    setFormData(prevData => ({ ...prevData, studyType: item.Answer }));
                    break;
                case "Question #17":
                    setFormData(prevData => ({ ...prevData, species: item.Answer }));
                    break;
                case "Question #18":
                    setFormData(prevData => ({ ...prevData, researchtopic: item.Answer }));
                    break;
                case "Question #19":
                    setFormData(prevData => ({ ...prevData, diseaseModel: item.Answer }));
                    break;
                case "Question #20":
                    setFormData(prevData => ({ ...prevData, system: item.Answer }));
                    break;
                case "Question #21":
                    setFormData(prevData => ({ ...prevData, organ: item.Answer }));
                    break;
                case "Question #22":
                    setFormData(prevData => ({ ...prevData, ph: item.Answer }));
                    break;
                case "Question #23":
                    setFormData(prevData => ({ ...prevData, isERW: item.Answer }));
                    break;
                case "Question #24":
                    setFormData(prevData => ({ ...prevData, methodOfAdmin: item.Answer }));
                    break;
                case "Question #25":
                    setFormData(prevData => ({ ...prevData, drugComparison: item.Answer }));
                    break;
                case "Question #26":
                    setFormData(prevData => ({ ...prevData, pharmacokinetics: item.Answer }));
                    break;
                case "Question #27":
                    setFormData(prevData => ({ ...prevData, doseComparison: item.Answer }));
                    break;
                case "Question #28":
                    setFormData(prevData => ({ ...prevData, methodsComparison: item.Answer }));
                    break;
                case "Question #30":
                    setFormData(prevData => ({ ...prevData, h2Duration: item.Answer }));
                    break;
                case "Question #31":
                    setFormData(prevData => ({ ...prevData, inhalationConcentration: item.Answer }));
                    break;
                case "Question #32":
                    setFormData(prevData => ({ ...prevData, cellCultureConcentration: item.Answer }));
                    break;
                case "Question #33":
                case "Question #34":
                    setFormData(prevData => ({ ...prevData, bothConcentration: item.Answer }));
                    break;
                case "Question #35":
                case "Question #36":
                    setFormData(prevData => ({ ...prevData, h2DoseBoth: item.Answer }));
                    break;
                case "Question #37":
                case "Question #38":
                    setFormData(prevData => ({ ...prevData, relativeDoseBoth: item.Answer }));
                    break;
                case "Question #40":
                    setFormData(prevData => ({ ...prevData, geneExpression: item.Answer }));
                    break;
                default:
                    break;
            }
        });
    };

    const handleSubmit = () => {
        console.log(formData);
    };

    return (
        <div className={`mx-auto bg-white p-8 rounded-lg shadow-lg mt-6 text-center`}>
            <h2 className="text-2xl font-bold mb-6">Upload PDF</h2>

            {!taskId && !taskData && (
            <div style={{display:'flex',justifyContent:'center',}}>
                <div className={`max-w-${!taskId && "lg"}  `}>
                    <div
                        className={`border-2 border-dashed border-blue-800 p-6 mb-4"`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}>
                        {pdfFile ? <p>{pdfFile.name}</p> : <p>Drag & Drop or <span className="cursor-pointer" style={{ color: colorTheme.primary }}>Choose file</span> to upload</p>}
                        <input
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            id="pdfInput"
                            onChange={handleFileChange} />
                    </div>
                    <div className="mt-4">
                        <label
                            htmlFor="pdfInput"
                            className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer hover:bg-blue-700 mr-2">
                            Choose File
                        </label>
                        <button
                            onClick={handleUpload}
                            className="text-white py-2 px-4 rounded hover:bg-green-700"
                            style={{ backgroundColor: colorTheme.primary }}
                            disabled={loading}>
                            {loading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                </div>
            </div>
            )}

            {responseMessage && (
                <div className="mt-4">
                    <p className="text-lg text-blue-700 font-semibold">{responseMessage}</p>
                </div>
            )}

            {statusMessage && (
                <div className="mt-4">
                    <p className="text-lg text-green-600 font-semibold">{statusMessage}</p>
                </div>
            )}

            {taskData && <Grid container spacing={5} >
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >



                    <div className="mt-6 text-left">
                        <h3 className="text-xl font-bold mb-4">Filtered Result</h3>
                        <ul>
                            <li><strong>Title:</strong> {formData.title}</li>
                            <li><strong>Authors:</strong> {formData.authors}</li>
                            <li><strong>Year:</strong> {formData.year}</li>
                            <li><strong>Country:</strong> {formData.country}</li>
                            <li><strong>PMID:</strong> {formData.pmid}</li>
                            <li><strong>DOI:</strong> {formData.doi}</li>
                            <li><strong>Abstract:</strong> {formData.abstract}</li>
                            <li><strong>Journal:</strong> {formData.journal}</li>
                            <li><strong>Journal URL:</strong> {formData.journalURL}</li>
                            <li><strong>Volume:</strong> {formData.volume}</li>
                            <li><strong>Pages:</strong> {formData.pages}</li>
                            <li><strong>Impact Factor:</strong> {formData.impactFactor}</li>
                            <li><strong>SciMAGO:</strong> {formData.sciMAGO}</li>
                            <li><strong>Outcome:</strong> {formData.outcome}</li>
                            <li><strong>Study Type:</strong> {formData.studyType}</li>
                            {/* <li><strong>Species:</strong> {formData.species.join(', ')}</li> */}
                            <li><strong>Species:</strong> {Array.isArray(formData.species) ? formData.species.join(', ') : formData.species}</li>
                            <li><strong>Research Topic:</strong> {Array.isArray(formData.researchtopic) ? formData.researchtopic.join(', ') : formData.researchtopic}</li>
                            <li><strong>System:</strong> {Array.isArray(formData.system) ? formData.system.join(', ') : formData.system}</li>

                            {/* <li><strong>Research Topic:</strong> {formData.researchtopic.join(', ')}</li> */}
                            <li><strong>Disease Model:</strong> {formData.diseaseModel}</li>
                            {/* <li><strong>System:</strong> {formData.system.join(', ')}</li> */}
                            <li><strong>Organ:</strong> {formData.organ}</li>
                            <li><strong>pH:</strong> {formData.ph}</li>
                            <li><strong>Is ERW:</strong> {formData.isERW}</li>
                            <li><strong>Method of Admin:</strong> {formData.methodOfAdmin}</li>
                            <li><strong>Drug Comparison:</strong> {formData.drugComparison}</li>
                            <li><strong>Pharmacokinetics:</strong> {formData.pharmacokinetics}</li>
                            <li><strong>Dose Comparison:</strong> {formData.doseComparison}</li>
                            <li><strong>Methods Comparison:</strong> {formData.methodsComparison}</li>
                            <li><strong>H2 Duration:</strong> {formData.h2Duration}</li>
                            <li><strong>Inhalation Concentration:</strong> {formData.inhalationConcentration}</li>
                            <li><strong>Cell Culture Concentration:</strong> {formData.cellCultureConcentration}</li>
                            <li><strong>Both Concentration:</strong> {formData.bothConcentration}</li>
                            <li><strong>H2 Dose Both:</strong> {formData.h2DoseBoth}</li>
                            <li><strong>Relative Dose Both:</strong> {formData.relativeDoseBoth}</li>
                            <li><strong>Gene Expression:</strong> {formData.geneExpression}</li>
                        </ul>
                        {/* <button
                                onClick={handleSubmit}
                                className="bg-green-500 text-white py-2 px-4 mt-4 rounded hover:bg-green-700">
                                Submit
                            </button> */}
                    </div>

                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >

                    <div className="mt-6 text-left">
                        <h3 className="text-xl font-bold mb-4">Ai Model Result</h3>
                        {taskData.map((item, index) => (
                            <div key={index} className="mb-4">
                                <strong>{item.Question}:</strong>
                                <p>{Array.isArray(item.Answer) ? item.Answer.join(', ') : item.Answer}</p>
                            </div>
                        ))}
                    </div>

                </Grid>
            </Grid>}
        </div>
    );
};

export default PDFUploadComponent;
