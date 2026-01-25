

import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Stepper from "../../Stepper/Stepper";
import PublicDataForm from "../PublicDataForm/PublicDataForm";
import ResearcherForm from "../ResearcherForm/ResearcherForm";
import BioMarkerForm from "../BioMarkerForm/BioMarkerForm";
import { useDispatch, useSelector } from "react-redux";
import { asyncStatus } from "../../../Utils/asyncStatus";
import { setArticleIdleStatus } from "../../../Store/slices/Article_slice";
import { add_article_service_auth } from "../../../Services/ArticleService";
import ArticleGeneralData from "../ArticleGeneralData/ArticleGeneralData";
import {
  error_toast_message,
  success_toast_message,
} from "../../../Utils/toast_message";
import {
  setNonExperimentalStatus,
  setShowCellCultureTissuesStatus,
  setShowConcernReportStatus,
  setShowIngestionStatus,
  setShowInhalationConcentrationFields,
  setShowInhalationStatus,
  setShowTopicalApplicationsStatus,
} from "../../../Store/slices/Study_type_slice";
import { apiHandle } from "../../../Config/ApiHandle/apiHandle";
import { Modal, Button } from "antd";

const MainForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const articleIdRef = useRef(null);

  const { add_article_status, add_article_data } = useSelector(
    (state) => state.article
  );
  
  // Get current user from auth state
  const { user } = useSelector((state) => state.userAuth);

  const { articleToEdit, isSpecialAction } = location.state || {};

  console.log("articleToEdit", articleToEdit);
  console.log("isSpecialAction", isSpecialAction);
  
  
  // Check if current user is a researcher and if they own the article
  const isResearcher = user?.role === "Researcher";
  const isArticleOwner = articleToEdit?.researcher_id === user?.id || 
                        articleToEdit?.created_by === user?.id || 
                        articleToEdit?.addedBy === user?.id;
  
  // Function to check if researcher owns the article by calling researcher-articles API
  const checkArticleOwnership = async (articleId) => {
    if (!isResearcher || !articleId) return false;
    
    try {
      const response = await apiHandle.post("researcher-articles", {
        per_page: 100, // Get enough articles to check
        page: 1,
      });
      
      const ownArticles = response.data?.articles || [];
      return ownArticles.some(article => article.id === articleId);
    } catch (error) {
      console.error("Error checking article ownership:", error);
      return false;
    }
  };
  
  // If researcher is trying to edit an article they don't own, redirect to public view
  useEffect(() => {
    if (isResearcher && articleToEdit && !isSpecialAction) {
      // First check immediate ownership fields
      if (!isArticleOwner) {
        // Double-check ownership via API
        checkArticleOwnership(articleToEdit.id).then((ownsArticle) => {
          if (!ownsArticle) {
            error_toast_message("You can only edit articles you created. Redirecting to public view...");
            setTimeout(() => {
              window.open(`https://h2research.org/ArticleDetails/${articleToEdit.mhid}`, "_blank");
              navigate(-1); // Go back to previous page
            }, 2000);
          }
        });
      }
    }
  }, [isResearcher, articleToEdit, isArticleOwner, isSpecialAction, navigate]);

  const [entryToEdit, setEntryToEdit] = useState(() => {
    // Ensure we always return an object, never just an ID
    const article = location.state?.articleToEdit || articleToEdit;
    if (article && typeof article === 'object') {
      return article;
    }
    return {};
  });
  // Track whether we're in edit mode
  const [isEditAvailble, setIsEditAvailble] = useState(
    !!(entryToEdit?.id || articleIdRef.current)
  );

  // Article existence check modal state
  const [showExistingArticleModal, setShowExistingArticleModal] =
    useState(false);
  const [existingArticle, setExistingArticle] = useState(null);
  const [pendingSubmitData, setPendingSubmitData] = useState(null);
  const [checkedTitles, setCheckedTitles] = useState(new Set());
  const [continueAnywayApproved, setContinueAnywayApproved] = useState(false);

  console.log("add_article_data", add_article_data?.article);

  const [activeStep, setActiveStep] = useState(0);
  const [publicData, setPublicData] = useState(entryToEdit.publicData || {});
  const [articleGeneralData, setArticleGeneralData] = useState(
    entryToEdit.articleGeneralData || {}
  );
  const [researcherData, setResearcherData] = useState(
    entryToEdit.researcherData || {}
  );
  const [bioMarkerData, setBioMarkerData] = useState(
    entryToEdit.biomaker || []
  );
  const [speciesType, setSpeciesType] = useState([]);
  const [skipSections, setSkipSections] = useState(false);
  const [ShowDefault, setShowDefaultState] = useState(false);

  // Function to sync weight data from ArticleGeneralData to ResearcherForm
  const syncWeightToResearcher = (species, weightData) => {
    if (!species || !weightData) return;

    setResearcherData(prev => {
      const updated = { ...prev };
      
      // Update bodyWeight in ResearcherForm with the value from ArticleGeneralData
      updated.bodyWeight = {
        name: weightData.averageWeight || '',
        unit: (weightData.weightUnit || 'kg').toLowerCase(),
        status: 'Unverified'
      };

      // Also update species-specific weight if speciesData exists
      if (updated.speciesData && updated.speciesData[species]) {
        updated.speciesData[species].weight = {
          name: weightData.averageWeight || '',
          unit: (weightData.weightUnit || 'kg').toLowerCase(),
          status: 'Unverified'
        };
      }

      return updated;
    });
  };

  // Function to sync weight data from ResearcherForm back to ArticleGeneralData
  const syncWeightToArticleGeneral = (species, weightData) => {
    if (!species || !weightData) return;

    setArticleGeneralData(prev => {
      const updated = { ...prev };
      
      if (!updated.speciesDetails) {
        updated.speciesDetails = {};
      }

      if (!updated.speciesDetails[species]) {
        updated.speciesDetails[species] = {};
      }

      // Update the averageWeight in ArticleGeneralData
      updated.speciesDetails[species] = {
        ...updated.speciesDetails[species],
        averageWeight: weightData.name || weightData.value || '',
        weightUnit: (weightData.unit || 'kg')
      };

      return updated;
    });
  };

  //  Initialize the articleIdRef from entryToEdit
  useEffect(() => {
    if (entryToEdit?.id) {
      articleIdRef.current = entryToEdit.id;
      setIsEditAvailble(true);
    }
  }, [entryToEdit]);

  // Update articleIdRef when add_article_data changes
  useEffect(() => {
    if (
      add_article_status === asyncStatus.SUCCEEDED &&
      add_article_data?.article?.id
    ) {
      articleIdRef.current = add_article_data.article.id;
      setIsEditAvailble(true);
    }
  }, [add_article_status, add_article_data]);

  useEffect(() => {
    if (location.state) {
      setEntryToEdit(articleToEdit);
    }
  }, [location]);

  useEffect(() => {
    if (isEditAvailble && Object.keys(entryToEdit).length > 0) {
      setPublicData(entryToEdit.publicData || {});
      setArticleGeneralData(entryToEdit.articleGeneralData || {});
      setResearcherData(entryToEdit.researcherData || {});
      setBioMarkerData(entryToEdit.biomaker || {});
    }
  }, [entryToEdit, isEditAvailble]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Function to check if article exists
  const checkIfArticleExists = async (data) => {
    try {
      const response = await apiHandle.post("/check-article", {
        pmid: (data.pmid?.name || "")?.trim(),
        title: (data.title?.name || "")?.trim(),
        doi: (data.doi?.name || "")?.trim(),
      });
      return response.data?.article;
    } catch (error) {
      console.error("Error checking article existence:", error);
      return false;
    }
  };

  // Function to check article existence on title blur/change
  const checkArticleOnTitleChange = async (titleData) => {
    // Only check if we have a title and we're not in edit mode
    if (!titleData?.name?.trim() || isEditAvailble) return;
    
    const titleToCheck = titleData.name.trim().toLowerCase();
    
    // Don't check if we've already checked this title
    if (checkedTitles.has(titleToCheck)) return;
    
    try {
      const articleExists = await checkIfArticleExists({ title: titleData });
      
      if (articleExists) {
        // Add this title to checked titles set
        setCheckedTitles(prev => new Set([...prev, titleToCheck]));
        
        setExistingArticle(articleExists);
        setPendingSubmitData(null); // Clear any pending biomarker data since this is just title check
        setShowExistingArticleModal(true);
        
        // Update publicData with current title to show in modal
        setPublicData(prev => ({
          ...prev,
          title: titleData
        }));
      }
    } catch (error) {
      console.error("Error checking for existing article:", error);
      // Silently fail for title checks to avoid interrupting user flow
    }
  };

  // Function to reset checked titles when title changes
  const handleTitleChange = async (titleData) => {
    const newTitle = titleData?.name?.trim().toLowerCase();
    const currentTitle = publicData?.title?.name?.trim().toLowerCase();
    
    // If title actually changed, clear the checked titles set and reset continue anyway approval
    if (newTitle !== currentTitle) {
      setCheckedTitles(new Set());
      setContinueAnywayApproved(false);
    }
    
    // Then proceed with normal title checking
    await checkArticleOnTitleChange(titleData);
  };

  const handleArticleExists = (existingArticle) => {
    setEntryToEdit(existingArticle);
    if (existingArticle?.id) {
      articleIdRef.current = existingArticle.id;
      setIsEditAvailble(true);
    }
  };

  // Handle data submissions for adding new data
  const handlePublicDataSubmit = (data) => {
    setPublicData(data);
    handleNextStep();
  };

  const handleDraftPublicDataSubmit = (data) => {
    const articleId = articleIdRef.current;
   
    const finalData = articleId
      ? {
          publicData: { ...data },
          articleGeneralData:
            articleGeneralData || entryToEdit.articleGeneralData, // Preserve existing data
          researcherData: researcherData || entryToEdit.researcherData, // Preserve existing data
          biomaker:
            bioMarkerData && Object.keys(bioMarkerData).length > 0
              ? bioMarkerData
              : entryToEdit.biomaker, // Preserve existing data if biomarker is empty
          article_id: articleId,
        // status: "Draft",
        }
      : {
          publicData: { ...data },
          status: "Draft",
        };

    dispatch(add_article_service_auth(finalData));
  };

  const handleDraftGeneralDataSubmit = (data) => {
    const articleId = articleIdRef.current;
    const finalData = articleId
      ? {
          publicData: publicData || entryToEdit.publicData, // Preserve existing data
          articleGeneralData: data,
          researcherData: researcherData || entryToEdit.researcherData, // Preserve existing data
          biomaker:
            bioMarkerData && Object.keys(bioMarkerData).length > 0
              ? bioMarkerData
              : entryToEdit.biomaker, // Preserve biomarker data if empty
          article_id: articleId,
          // status: "Draft",
        }
      : {
          publicData,
          articleGeneralData: data,
          status: "Draft",
        };

    dispatch(add_article_service_auth(finalData));
  };

  const handleArticleGeneralDataSubmit = (data, skip, speciesInfo) => {
    setArticleGeneralData(data);
    setSkipSections(skip);
    setSpeciesType(speciesInfo);
    handleNextStep();
  };

  const setShowDefault = (lelem) => {
    if (lelem) {
      setShowDefaultState(false);
    }
  };

  const handleDraftResearcherDataSubmit = (data) => {
    const articleId = articleIdRef.current;
    const finalData = articleId
      ? {
          publicData: publicData || entryToEdit.publicData, // Preserve if exists
          articleGeneralData:
            articleGeneralData || entryToEdit.articleGeneralData, // Preserve existing
          researcherData: data,
          biomaker:
            bioMarkerData && Object.keys(bioMarkerData).length > 0
              ? bioMarkerData
              : entryToEdit.biomaker, // Keep biomarker if unchanged
          article_id: articleId,
          // status: "Draft",
        }
      : {
          publicData,
          articleGeneralData,
          researcherData: data,
          status: "Draft",
        };

    dispatch(add_article_service_auth(finalData));
  };

  const handleResearcherDataSubmit = (data) => {
    setResearcherData(data);
    handleNextStep();
  };

  // Function to handle selection in the modal
  const handleModalSelection = async (useExisting) => {
    if (useExisting && existingArticle) {
      // Check if researcher is trying to update an article they don't own
      const ownsArticle = existingArticle.researcher_id === user?.id || 
                         existingArticle.created_by === user?.id || 
                         existingArticle.addedBy === user?.id;
      
      if (isResearcher && !ownsArticle) {
        // Double-check ownership via API
        const ownsViaAPI = await checkArticleOwnership(existingArticle.id);
        
        if (!ownsViaAPI) {
          error_toast_message("You can only update articles you created. Redirecting to public view...");
          setTimeout(() => {
            window.open(`https://h2research.org/ArticleDetails/${existingArticle.mhid}`, "_blank");
            navigate(-1);
          }, 2000);
          setShowExistingArticleModal(false);
          return;
        }
      }
      
      // Use the existing article ID for submission
      // Determine status - preserve existing status unless it was a draft
      const currentStatus = existingArticle.status;
      let status = "Unverified"; // Default
      
      if (currentStatus === "Draft") {
        status = "Unverified"; // Draft becomes Unverified when submitted
      } else if (currentStatus) {
        status = currentStatus; // Preserve existing status (Verified, In Review, etc.)
      }
      
      const finalData = {
        publicData,
        articleGeneralData,
        researcherData,
        biomaker: pendingSubmitData,
        article_id: existingArticle.id,
        status: status,
      };

      dispatch(add_article_service_auth(finalData));
    } else {
      // Continue with new submission
      const finalData = {
        publicData,
        articleGeneralData,
        researcherData,
        biomaker: pendingSubmitData,
        status: "Unverified",
      };

      dispatch(add_article_service_auth(finalData));
    }

    // Close the modal
    setShowExistingArticleModal(false);
    setPendingSubmitData(null);
    setExistingArticle(null);
  };

  const handleBioMarkerDataSubmit = async (data) => {
    setBioMarkerData(data);

    // Check if article exists before submitting, but only if user hasn't already approved "continue anyway"
    const articleExists = await checkIfArticleExists(publicData);

    if (articleExists && !isEditAvailble && !continueAnywayApproved) {
      // If article exists and we're not in edit mode and user hasn't approved continue anyway, show modal
      setExistingArticle(articleExists);
      setPendingSubmitData(data);
      setShowExistingArticleModal(true);
    } else {
      // If article doesn't exist OR we're in edit mode OR user has approved continue anyway, proceed with submission
      const articleId = articleIdRef.current;

      // Determine status based on context
      let status = "Unverified"; // Default for new articles
      
      if (articleId && entryToEdit) {
        // If editing existing article, preserve status unless it was a draft
        const currentStatus = entryToEdit.status || add_article_data?.article?.status;
        if (currentStatus === "Draft") {
          status = "Unverified"; // Draft becomes Unverified when submitted
        } else if (currentStatus) {
          status = currentStatus; // Preserve existing status (Verified, In Review, etc.)
        }
      }

      const finalData = articleId
        ? {
            publicData,
            articleGeneralData,
            researcherData,
            biomaker: data,
            article_id: articleId,
            status: status,
          }
        : {
            publicData,
            articleGeneralData,
            researcherData,
            biomaker: data,
            status: "Unverified", // New articles always start as Unverified
          };

      console.log("Final Form Data:", finalData);
      dispatch(add_article_service_auth(finalData));
    }
  };

  // Handle data updates
  const handlePublicDataUpdate = (data) => {
    setPublicData(data);
    console.log("Updated Public Data:", data);
    handleNextStep();
  };

  const handleBioMarkerDataUpdate = (data) => {
    setBioMarkerData(data);
    
    // Determine status - preserve existing status unless it was a draft
    const currentStatus = entryToEdit?.status;
    let status = "Unverified"; // Default
    
    if (currentStatus === "Draft") {
      status = "Unverified"; // Draft becomes Unverified when submitted
    } else if (currentStatus) {
      status = currentStatus; // Preserve existing status (Verified, In Review, etc.)
    }
    
    const finalData = {
      publicData,
      articleGeneralData,
      researcherData,
      biomaker: data,
      article_id: entryToEdit?.id,
      status: status,
    };
    dispatch(add_article_service_auth(finalData));
    console.log("Updated Final Data:", finalData);
  };

  const handleFetchedData = async (data) => {
    if (data.publicData) {
      setPublicData(data.publicData);
      
      // Check for existing article if title was extracted from any bot
      if (data.publicData.title) {
        await handleTitleChange(data.publicData.title);
      }
    }
    if (data.articleGeneralData) setArticleGeneralData(data.articleGeneralData);
    if (data.researcherData) setResearcherData(data.researcherData);
    if (data.bioMarkerData) setBioMarkerData(data.bioMarkerData);
  };

  // Step navigation
  const handleNextStep = () => {
    if (activeStep < 3) {
      // Update to 3 because there are now 4 steps
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBackStep = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  // Handler for going back from ResearcherForm - saves data before going back
  const handleResearcherBackStep = (data) => {
    if (data) {
      setResearcherData(data);
    }
    handleBackStep();
  };

  const handlePdfBotData = async (data) => {
    console.log("Received PDF Bot data:", data);

    try {
      // Determine where the data is located
      const dataSource = data.data ? data.data : data;

      // Extract properties safely using optional chaining
      const publicData = dataSource?.publicData;
      const articleGeneralData = dataSource?.articleGeneralData;
      const researcherData = dataSource?.researcherData;
      const biomaker = dataSource?.biomaker;

      console.log("check biomaker 1", biomaker);
      console.log("check biomaker 2 spread", ...biomaker);

      // Update states with the extracted data
      if (publicData) {
        setPublicData((prevData) => ({
          ...prevData,
          ...publicData,
        }));
        
        // Check for existing article if title was extracted
        if (publicData.title) {
          await handleTitleChange(publicData.title);
        }
      }

      if (articleGeneralData) {
        setArticleGeneralData((prevData) => ({
          ...prevData,
          ...articleGeneralData,
        }));
      }

      if (researcherData) {
        setResearcherData((prevData) => ({
          ...prevData,
          ...researcherData,
        }));
      }

      if (biomaker) {
        setBioMarkerData(biomaker);
      }

      success_toast_message("Article data extracted successfully");
    } catch (error) {
      console.error("Error processing PDF Bot data:", error);
      error_toast_message("Failed to process extracted data");
    }
  };

  console.log("bioMarkerData", bioMarkerData);

  useEffect(() => {
    if (add_article_status === asyncStatus.SUCCEEDED) {
      // Reset entryToEdit properly using setter function
      setEntryToEdit({});

      dispatch(setArticleIdleStatus());
      dispatch(setShowConcernReportStatus(false));
      dispatch(setShowInhalationStatus(false));
      dispatch(setShowIngestionStatus(false));
      dispatch(setShowCellCultureTissuesStatus(false));
      dispatch(setShowTopicalApplicationsStatus(false));
      dispatch(setNonExperimentalStatus(false));
      dispatch(setShowInhalationConcentrationFields(false));

      if (
        add_article_data?.article?.status === "Unverified" ||
        add_article_data?.article?.status === "In Review"
      ) {
        articleIdRef.current = null;
        navigate(-1);
      }
    }
  }, [add_article_status, navigate]);

  const renderForm = () => {
    const webpageLinkRequired = !publicData.doi;
    switch (activeStep) {
      case 0:
        return (
          <PublicDataForm
            isSpecialAction={isSpecialAction}
            onArticleExists={handleArticleExists}
            isEditAvailble={isEditAvailble}
            onSubmit={handlePublicDataSubmit}
            onDraftSubmit={handleDraftPublicDataSubmit}
            onBack={handleBackStep}
            initialData={publicData} // Pass `publicData` as initialData
            onFetchData={handleFetchedData}
            onPdfBotData={handlePdfBotData}
            onTitleChange={handleTitleChange}
          />
        );
      case 1:
        return (
          <ArticleGeneralData
            isSpecialAction={isSpecialAction}
            onSubmit={handleArticleGeneralDataSubmit}
            onDraftSubmit={handleDraftGeneralDataSubmit}
            onBack={handleBackStep}
            initialData={articleGeneralData}
            setShowDefault={setShowDefault}
            onWeightChange={syncWeightToResearcher}
          />
        );
      case 2:
        return (
          <ResearcherForm
            isSpecialAction={isSpecialAction}
            onSubmit={handleResearcherDataSubmit}
            onDraftSubmit={handleDraftResearcherDataSubmit}
            onBack={handleResearcherBackStep}
            speciesTypeGetting={speciesType}
            ShowDefault={ShowDefault}
            initialData={researcherData} // Pass `researcherData` as initialData
            WebpageLinkRequired={webpageLinkRequired} // Pass as prop
            onWeightChange={syncWeightToArticleGeneral}
            articleGeneralData={articleGeneralData}
          />
        );
      case 3:
        return (
          <BioMarkerForm
          isSpecialAction={isSpecialAction}
            onSubmit={handleBioMarkerDataSubmit}
            onUpdate={handleBioMarkerDataUpdate}
            onBack={handleBackStep}
            initialData={bioMarkerData} // Pass `bioMarkerData` as initialData
          />
        );
      default:
        return (
          <PublicDataForm
            isSpecialAction={isSpecialAction}
            onSubmit={handlePublicDataSubmit}
            onUpdate={handlePublicDataUpdate}
            initialData={publicData} // Pass `publicData` as initialData
            isEditAvailble={isEditAvailble}
          />
        );
    }
  };

  return (
    <div className="p-8">
      <Stepper activeStep={activeStep} setActiveStep={setActiveStep} />
      {renderForm()}

      {/* Modal for existing article */}
      {/* Modal for existing article */}
{showExistingArticleModal && (
  <div className="fixed inset-0 flex items-center justify-center z-[9999]">
    {/* Overlay */}
    <div className="fixed inset-0 bg-black bg-opacity-50" />

    {/* Modal Content */}
    <div className="bg-white rounded-lg shadow-2xl w-full max-w-xl mx-4 md:mx-0 animate-fadeIn overflow-hidden relative z-[10000] max-h-[90vh] flex flex-col">
      {/* Header */}
      <div className="bg-[#004c78] text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <svg
            className="h-5 w-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="text-lg font-medium">Article Already Exists</h2>
        </div>
        
        {/* Close button */}
        <button 
          onClick={() => setShowExistingArticleModal(false)}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Content Area - with scrolling */}
      <div className="overflow-y-auto p-5 flex-grow">
        {/* Existing Article Details */}
        <div className="mb-5">
          <div className="flex items-center mb-2">
            <svg
              className="h-5 w-5 text-[#004c78] mr-2 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            <h3 className="text-base font-medium text-[#004c78]">
              Existing Article Details
            </h3>
          </div>

          <div className="bg-blue-50 rounded p-4 border border-blue-100">
            <div className="text-xs text-gray-500 uppercase font-medium mb-1">TITLE</div>
            <div className="text-gray-800 mb-3">
              {existingArticle?.publicData?.title?.name || "N/A"}
            </div>
            
            <div className="text-xs text-gray-500 uppercase font-medium mb-1">DOI</div>
            <div className="text-gray-800 mb-3 break-all font-mono text-sm">
              {existingArticle?.publicData?.doi?.name
                ? `https://doi.org/${existingArticle.publicData.doi.name}`
                : "N/A"}
            </div>
            
            <div className="text-xs text-gray-500 uppercase font-medium mb-1">PMID</div>
            <div className="text-gray-800 font-mono">
              {existingArticle?.publicData?.pmid?.name || "N/A"}
            </div>
          </div>
        </div>

        {/* Current Form Data */}
        <div className="mb-5">
          <div className="flex items-center mb-2">
            <svg
              className="h-5 w-5 text-[#004c78] mr-2 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-base font-medium text-[#004c78]">
              Current Form Data
            </h3>
          </div>

          <div className="bg-gray-50 rounded p-4 border border-gray-200">
            <div className="text-xs text-gray-500 uppercase font-medium mb-1">TITLE</div>
            <div className="text-gray-800 mb-3">
              {publicData?.title?.name || "N/A"}
            </div>
            
            <div className="text-xs text-gray-500 uppercase font-medium mb-1">DOI</div>
            <div className="text-gray-800 mb-3 break-all font-mono text-sm">
              {publicData?.doi?.name
                ? `https://doi.org/${publicData.doi.name}`
                : "N/A"}
            </div>
            
            <div className="text-xs text-gray-500 uppercase font-medium mb-1">PMID</div>
            <div className="text-gray-800 font-mono">
              {publicData?.pmid?.name || "N/A"}
            </div>
          </div>
        </div>

        {/* Question box */}
        <div className="bg-amber-50 border-l-4 border-amber-400 p-3 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-amber-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-amber-700">
                Would you like to use the existing article or update it with your current data?
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - fixed at bottom */}
      <div className="bg-gray-50 px-5 py-3 flex justify-end space-x-3 border-t">
       
        {isResearcher && existingArticle && (existingArticle.researcher_id !== user?.id && existingArticle.created_by !== user?.id && existingArticle.addedBy !== user?.id) ? (
          // If researcher doesn't own the article, show different options
          <>
            <button
              onClick={() => {
                window.open(`https://h2research.org/ArticleDetails/${existingArticle.mhid}`, "_blank");
                setShowExistingArticleModal(false);
              }}
              className="bg-[#004c78] hover:bg-[#003b5c] text-white font-medium py-2 px-4 rounded transition-all"
            >
              View on Public Site
            </button>
            <button
              onClick={() => {
                // Continue anyway - just close modal and let user continue with form
                setContinueAnywayApproved(true);
                setShowExistingArticleModal(false);
                setExistingArticle(null);
                setPendingSubmitData(null);
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded transition-all"
            >
              Continue Anyway
            </button>
          </>
        ) : (
          // Standard options for article owners or non-researchers
          <>
           <button
          onClick={() => {
            // Bring old article - load existing article data into form
            setEntryToEdit(existingArticle);
            if (existingArticle?.id) {
              articleIdRef.current = existingArticle.id;
              setIsEditAvailble(true);
            }
            setShowExistingArticleModal(false);
            setExistingArticle(null);
            setPendingSubmitData(null);
          }}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-all"
        >
          Bring Old Article
        </button>
          <button
            onClick={() => handleModalSelection(true)}
            className="bg-[#004c78] hover:bg-[#003b5c] text-white font-medium py-2 px-4 rounded transition-all"
          >
            Update Existing Article
          </button>
          <button
            onClick={() => {
              // Continue anyway - just close modal and let user continue with form
              setContinueAnywayApproved(true);
              setShowExistingArticleModal(false);
              setExistingArticle(null);
              setPendingSubmitData(null);
            }}
            className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded transition-all"
          >
            Continue Anyway
          </button>
          </>
        )}
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default MainForm;
