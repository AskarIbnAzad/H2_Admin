// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import Stepper from '../../Stepper/Stepper';
// import PublicDataForm from '../PublicDataForm/PublicDataForm';
// import ResearcherForm from '../ResearcherForm/ResearcherForm';
// import BioMarkerForm from '../BioMarkerForm/BioMarkerForm';
// import { useDispatch, useSelector } from 'react-redux';
// import { asyncStatus } from '../../../Utils/asyncStatus';
// import { setArticleIdleStatus } from '../../../Store/slices/Article_slice';
// import { add_article_service_auth } from '../../../Services/ArticleService';
// import ArticleGeneralData from '../ArticleGeneralData/ArticleGeneralData';
// import { success_toast_message } from '../../../Utils/toast_message';
// import { setNonExperimentalStatus, setShowCellCultureTissuesStatus, setShowConcernReportStatus, setShowIngestionStatus, setShowInhalationStatus, setShowTopicalApplicationsStatus } from '../../../Store/slices/Study_type_slice';

// const MainForm = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     const { add_article_status, add_article_data } = useSelector((state) => state.article);
//     const entryToEdit = location.state?.articleToEdit || {}; // If there's data to edit


//     const [activeStep, setActiveStep] = useState(0);
//     const [publicData, setPublicData] = useState(entryToEdit.publicData || {});
//     const [articleGeneralData, setArticleGeneralData] = useState(entryToEdit.articleGeneralData || {});
//     const [researcherData, setResearcherData] = useState(entryToEdit.researcherData || {});
//     const [bioMarkerData, setBioMarkerData] = useState(entryToEdit.biomaker || {});
//     const [speciesType, setSpeciesType] = useState([]);
//     const [skipSections, setSkipSections] = useState(false);
//     const [ShowDefault, setShowDefaultState] = useState(false);

//     useEffect(() => {
//         window.scrollTo(0, 0);
//     }, []);

//     // Handle data submissions for adding new data
//     const handlePublicDataSubmit = (data,) => {
//         setPublicData(data);

//         handleNextStep();
//     };

//     const handleDraftPublicDataSubmit = (data,) => {
//         const finalData = entryToEdit?.id
//             ? {
//                 publicData: {
//                     ...data,
//                 },
//                 articleGeneralData,
//                 researcherData,
//                 bioMarkerData,
//                 article_id: entryToEdit?.id,
//                 status: "Draft"
//             }
//             : {
//                 publicData: {
//                     ...data,
//                 },
//                 status: "Draft"
//             };

//         // console.log("public data", finalData);
//         dispatch(add_article_service_auth({ ...finalData }))
//     };

//     const handleDraftGeneralDataSubmit = (data) => {
//         const finalData = entryToEdit?.id
//             ? {
//                 publicData,
//                 articleGeneralData: data,
//                 researcherData,
//                 bioMarkerData,
//                 article_id: entryToEdit?.id,
//                 status: "Draft"
//             }
//             : {
//                 publicData,
//                 articleGeneralData: data,
//                 status: "Draft"
//             };
//         // console.log("General data", finalData);
//         dispatch(add_article_service_auth(finalData))
//     }

//     const handleArticleGeneralDataSubmit = (data, skip, speciesInfo) => {
//         setArticleGeneralData(data);
//         setSkipSections(skip);
//         setSpeciesType(speciesInfo);

//         if (skip) {
//             const confirmSubmit = window.confirm("Ready to submit?");
//             if (confirmSubmit) {
//                 const finalData = {
//                     publicData,
//                     articleGeneralData,
//                     researcherData: null,
//                     biomaker: null,
//                     status: "Unverified"
//                 };
//                 dispatch(add_article_service_auth(finalData))
//                 dispatch(setNonExperimentalStatus(false))
//                 // success_toast_message("Article Submitted!");
//                 // navigate(-1);
//                 // dispatch(setNonExperimentalStatus(false))
//             }
//         } else {
//             handleNextStep();
//         }

//     };



//     const setShowDefault = (lelem) => {
//         if (lelem) {
//             setShowDefaultState(false)
//         }
//     }

//     const handleDraftResearcherDataSubmit = (data) => {
//         const finalData = entryToEdit?.id
//             ? {
//                 publicData,
//                 articleGeneralData,
//                 researcherData: data,
//                 bioMarkerData,
//                 article_id: entryToEdit?.id,
//                 status: "Draft"
//             }
//             : {
//                 publicData,
//                 articleGeneralData,
//                 researcherData: data,
//                 status: "Draft"
//             };
//         // console.log("research data", finalData);
//         dispatch(add_article_service_auth(finalData))
//     }

//     const handleResearcherDataSubmit = (data) => {
//         setResearcherData(data);
//         handleNextStep();
//     };


//     const handleBioMarkerDataSubmit = (data) => {
//         setBioMarkerData(data);

//         const finalData = entryToEdit?.id
//             ? {
//                 publicData,
//                 articleGeneralData,
//                 researcherData,
//                 biomaker: data,
//                 article_id: entryToEdit?.id,
//                 status: "Unverified"
//             }
//             : {
//                 publicData,
//                 articleGeneralData,
//                 researcherData,
//                 biomaker: data,
//                 status: "Unverified"
//             };

//         console.log("Final Form Data:", finalData);

//         // Dispatch the action to save or submit the data
//         dispatch(add_article_service_auth(finalData));
//         // Here you can submit `finalData` to an API or further processing
//     };


//     // Handle data updates
//     const handlePublicDataUpdate = (data) => {
//         setPublicData(data);
//         console.log("Updated Public Data:", data);
//         handleNextStep();
//     };


//     const handleResearcherDataUpdate = (data) => {
//         setResearcherData(data);
//         console.log("Updated Researcher Data:", data);
//         handleNextStep();
//     };

//     const handleBioMarkerDataUpdate = (data) => {
//         setBioMarkerData(data);
//         const finalData = {
//             publicData,
//             articleGeneralData,
//             researcherData,
//             biomaker: data,
//             article_id: entryToEdit?.id,
//             status: "Unverified"
//         };
//         dispatch(add_article_service_auth(finalData))
//         console.log("Updated Final Data:", finalData);
//     };

//     // Step navigation
//     const handleNextStep = () => {
//         if (activeStep < 3) { // Update to 3 because there are now 4 steps
//             setActiveStep((prevStep) => prevStep + 1);
//         }
//     };

//     const handleBackStep = () => {
//         if (activeStep > 0) {
//             setActiveStep((prevStep) => prevStep - 1);
//         }
//     };

//     useEffect(() => {


//         if (add_article_status === asyncStatus.SUCCEEDED) {
//             console.log("add_article_data", add_article_data);

//             // navigate(-1);
//             // dispatch(setArticleIdleStatus());
//             // dispatch(setShowConcernReportStatus(false));
//             // dispatch(setShowInhalationStatus(false));
//             // dispatch(setShowIngestionStatus(false));
//             // dispatch(setShowCellCultureTissuesStatus(false));
//             // dispatch(setShowTopicalApplicationsStatus(false));
//             // dispatch(setNonExperimentalStatus(false))
//         }
//     }, [add_article_status]);

//     const renderForm = () => {
//         const webpageLinkRequired = !publicData.doi;
//         switch (activeStep) {
//             case 0:
//                 return (
//                     <PublicDataForm
//                         onSubmit={handlePublicDataSubmit}
//                         onDraftSubmit={handleDraftPublicDataSubmit}
//                         onBack={handleBackStep}
//                         initialData={publicData}  // Pass `publicData` as initialData
//                     />
//                 );
//             case 1:
//                 return (
//                     <ArticleGeneralData
//                         onSubmit={handleArticleGeneralDataSubmit}
//                         onDraftSubmit={handleDraftGeneralDataSubmit}
//                         onBack={handleBackStep}
//                         initialData={articleGeneralData}
//                         setShowDefault={setShowDefault}
//                     />
//                 );
//             case 2:
//                 return (
//                     <ResearcherForm
//                         onSubmit={handleResearcherDataSubmit}
//                         onDraftSubmit={handleDraftResearcherDataSubmit}
//                         onBack={handleBackStep}
//                         speciesTypeGetting={speciesType}
//                         ShowDefault={ShowDefault}
//                         initialData={researcherData}  // Pass `researcherData` as initialData
//                         WebpageLinkRequired={webpageLinkRequired} // Pass as prop
//                     />
//                 );
//             case 3:
//                 return (
//                     <BioMarkerForm
//                         onSubmit={handleBioMarkerDataSubmit}
//                         onUpdate={handleBioMarkerDataUpdate}
//                         onBack={handleBackStep}
//                         initialData={bioMarkerData}  // Pass `bioMarkerData` as initialData
//                     />
//                 );
//             default:
//                 return (
//                     <PublicDataForm
//                         onSubmit={handlePublicDataSubmit}
//                         onUpdate={handlePublicDataUpdate}
//                         initialData={publicData}  // Pass `publicData` as initialData
//                     />
//                 );
//         }
//     };

//     return (
//         <div className="p-8">
//             <Stepper activeStep={activeStep} setActiveStep={setActiveStep} />
//             {renderForm()}
//         </div>
//     );
// };

// export default MainForm;
