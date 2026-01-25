import React, { useState, useEffect, useRef } from "react";
import { Input } from "../../Input/Input";
import { CustomCreatableSelect } from "../../CustomSelect/CustomSelect";
import { colorTheme } from "../../../Utils/colortheme";
import axios from "axios";
import {
  FaCheck,
  FaFilePdf,
  FaInfoCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { Accordion } from "../../Accordian/Accordian";
import { apiHandle } from "../../../Config/ApiHandle/apiHandle";
import ModalCom from "../../Modal/Modal";
import {
  error_toast_message,
  success_toast_message,
} from "../../../Utils/toast_message";
import AuthorsComponent from "../../AuthorsComponent/AuthorsComponent";
import { asyncStatus } from "../../../Utils/asyncStatus";
import { useDispatch, useSelector } from "react-redux";
import {
  add_country_service_auth,
  get_countries_service_auth,
} from "../../../Services/SpecieService";
import { message, notification } from "antd";
import { useNavigate } from "react-router-dom";
import SearchByURL from "../../SearchByURL/SearchByURL";
import { Oval } from "react-loader-spinner";
import { Editor } from "primereact/editor";

const DoiInput = ({
  value = "",
  onChange,
  InfoTooltip,
  error,
  isSpecialAction,
  status,
  onStatusChange,
}) => {
  const doiPrefix = "https://doi.org/";

  const handleChange = (doiValue) => {
    if (!doiValue.startsWith(doiPrefix)) {
      onChange("", "doi");
      onChange(
        "Invalid DOI: Input must start with 'https://doi.org/'",
        "doiError"
      );
      return;
    }

    const doiSuffix = doiValue.slice(doiPrefix.length);

    if (doiSuffix.includes("http://") || doiSuffix.includes("https://")) {
      onChange("", "doi");
      onChange(
        "Invalid DOI: Only 'https://doi.org/' prefix is allowed, with no additional URLs",
        "doiError"
      );
      return;
    }

    onChange(doiSuffix, "doi");
    onChange("", "doiError");
  };

  const isValidDoi = value && value.trim().length > 0; // Check if DOI suffix is valid

  return (
    <div className="relative mb-4">
      {/* Input Field */}
      <Input
        InfoTooltip={InfoTooltip}
        name="doi"
        label="DOI"
        type="text"
        value={`${doiPrefix}${value}`} // Combine prefix and suffix for display
        onChange={handleChange}
        placeholder="Enter DOI"
        error={error}
        isCheck={false}
        style={{
          border: error
            ? "2px solid red" // Red border for errors
            : isValidDoi
            ? "2px solid gray" // Gray border for valid value
            : "1px solid #ccc", // Default border
          transition: "border-color 0.2s ease", // Smooth border transition
        }}
        isSpecialAction={isSpecialAction}
        status={status}
        onStatusChange={onStatusChange}
      />
    </div>
  );
};

// const PdfActionModal = ({ onClose, onUploadOnly, onScrapeAndUpload }) => {
//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-50">
//       <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 mx-4 md:mx-0">
//         <h2 className="text-xl font-semibold text-gray-800 mb-3">
//           PDF Upload Options
//         </h2>
//         <p className="text-gray-600 mb-6">
//           Would you like to just upload the PDF or also extract information from
//           it?
//         </p>
//         <div className="flex justify-end space-x-3">
//           <button
//             onClick={onUploadOnly}
//             className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-150"
//           >
//             Upload Only
//           </button>
//           <button
//             onClick={onScrapeAndUpload}
//             className="bg-[#004c78] hover:bg-[#004c78] text-white font-medium py-2 px-4 rounded-md transition duration-150"
//           >
//             Extract & Upload
//           </button>
//           <button
//             onClick={onClose}
//             className="border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-150"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

const PdfActionModal = ({ onClose, onUploadOnly, onScrapeAndUpload }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 mx-4 md:mx-0 animate-fadeIn">
        {/* Header with PDF icon */}
        <div className="flex items-center mb-4 border-b pb-3">
          <svg className="h-6 w-6 text-[#004c78] mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800">
            PDF Upload Options
          </h2>
        </div>
        
        {/* Content */}
        <div className="mb-6">
          <div className="bg-blue-50 border-l-4 border-[#004c78] p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-[#004c78]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  Would you like to just upload the PDF or also extract information from it?
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="flex flex-col space-y-3">
              <button
                onClick={onScrapeAndUpload}
                className="flex items-center justify-center bg-[#004c78] hover:bg-[#003b5c] text-white font-medium py-3 px-4 rounded-md transition-all"
              >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11h4m-2-2v4" />
                </svg>
                Extract & Upload
              </button>
              
              <button
                onClick={onUploadOnly}
                className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-md transition-all"
              >
                <svg className="h-5 w-5 mr-2 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                Upload Only
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-end border-t pt-4">
          <button
            onClick={onClose}
            className="flex items-center text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};



const PublicDataForm = ({
  onSubmit,
  initialData,
  onDraftSubmit,
  onFetchData,
  isEditAvailble,
  onArticleExists,
  isSpecialAction,
  onPdfBotData,
  onTitleChange,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const hydrogenKeywords = [
  //   "hydrogen",
  //   "molecular hydrogen",
  //   "molecular hydrogen therapy",
  //   "dihydrogen",
  //   "dihydrogen therapy",
  //   "hydrogen gas",
  //   "H2 gas",
  //   "H2 inhalation",
  //   "hydrogen inhalation",
  //   "hydrogen therapy",
  //   "H2 therapy",
  // ];

  const { add_article_status } = useSelector((state) => state.article);
  const { get_country_data, add_country_status } = useSelector(
    (state) => state.species
  );
  const { user } = useSelector((state) => state.userAuth);
  const [primaryKeywords, setPrimaryKeywords] = useState([]);
  const [keywordsLoading, setKeywordsLoading] = useState(false);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [showPdfActionModal, setShowPdfActionModal] = useState(false);
  const [processedFiles, setProcessedFiles] = useState(new Set()); // Track processed files

  console.log("initialData", initialData);
  const [actionType, setActionType] = useState(null); // 'draft' or 'submit'
  const [showKeywordWarningModal, setShowKeywordWarningModal] = useState(false);
  const [formData, setFormData] = useState(
    initialData || {
      title: { name: "", status: "Unverified" },
      authors: [],
      year: { name: "", status: "Unverified" },
      country: [],
      grantCountry: { name: "", status: "Unverified" },
      researchCountry: [],
      pmid: { name: "", status: "Unverified" },
      doi: { name: "", status: "Unverified" },
      abstract: { name: "", status: "Unverified" },
      publisher: { name: "", status: "Unverified" },
      journal: { name: "", status: "Unverified" },
      journalURL: { name: "", status: "Unverified" },
      volume: { name: "", status: "Unverified" },
      pages: { name: "", status: "Unverified" },
      impactFactor: { name: "", status: "Unverified" },
      HIndex: { name: "", status: "Unverified" },
      sciMAGO: { name: "", status: "Unverified" },
      pdf_url: [],
      journalAbbreviation: { name: "", status: "Unverified" },
      issn: { name: "", status: "Unverified" },
      publicationType: { name: "", status: "Unverified" },
      citedByCount: { name: "", status: "Unverified" },
      keywords: { name: "", status: "Unverified" },
      affiliations: { name: "", status: "Unverified" },
      issue: { name: "", status: "Unverified" },
      authorIdList: [],
      grantList: [],
      publicationStatus: { name: "", status: "Unverified" },
      PublicationDate: { name: "", status: "Unverified" },
      meshHeadingList: { name: "", status: "Unverified" },
    }
  );

  useEffect(() => {
    fetchPrimaryKeywords();
  }, []);

  // Function to fetch primary keywords from API
  const fetchPrimaryKeywords = async () => {
    setKeywordsLoading(true);
    try {
      const response = await apiHandle.get("get-keywords");
      if (response?.data?.data) {
        // Filter only Primary keywords and extract their keyword text
        const primaryOnly = response?.data?.data
          ?.filter((item) => item?.type === "Primary")
          ?.map((item) => item.keyword.toLowerCase());

        setPrimaryKeywords(primaryOnly);
      }
    } catch (error) {
      console.error("Error fetching keywords:", error);
    } finally {
      setKeywordsLoading(false);
    }
  };
  const checkHydrogenKeywords = () => {
    // If keywords haven't loaded yet, default to true to avoid blocking submission
    if (keywordsLoading || primaryKeywords?.length === 0) {
      return true;
    }

    // Get the title and abstract text
    const title = formData.title?.name || "";
    // For abstract, handle both text and HTML content scenarios
    let abstractText = formData.abstract?.name || "";

    // If abstract is HTML (from Editor component), strip HTML tags
    if (abstractText.includes("<") && abstractText.includes(">")) {
      // Simple HTML stripping - create a div, set innerHTML, then get textContent
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = abstractText;
      abstractText = tempDiv.textContent || tempDiv.innerText || "";
    }

    // Combine title and abstract for searching
    const combinedText = (title + " " + abstractText).toLowerCase();

    // Check if any primary keywords are present in the combined text
    const foundKeyword = primaryKeywords?.some((keyword) =>
      combinedText.includes(keyword.toLowerCase())
    );

    return foundKeyword;
  };
  // const checkHydrogenKeywords = () => {
  //   // Get the title and abstract text
  //   const title = formData.title?.name || "";
  //   // For abstract, handle both text and HTML content scenarios
  //   let abstractText = formData.abstract?.name || "";

  //   // If abstract is HTML (from Editor component), strip HTML tags
  //   if (abstractText.includes("<") && abstractText.includes(">")) {
  //     // Simple HTML stripping - create a div, set innerHTML, then get textContent
  //     const tempDiv = document.createElement("div");
  //     tempDiv.innerHTML = abstractText;
  //     abstractText = tempDiv.textContent || tempDiv.innerText || "";
  //   }

  //   // Combine title and abstract for searching
  //   const combinedText = (title + " " + abstractText).toLowerCase();

  //   // Check if any hydrogen keywords are present
  //   const foundKeyword = hydrogenKeywords.some((keyword) =>
  //     combinedText.includes(keyword.toLowerCase())
  //   );

  //   return foundKeyword;
  // };
  const [searchPMID, setSearchPMID] = useState("");
  const [searchMHID, setSearchMHID] = useState("");
  const [loadingMHID, setLoadingMHID] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorPMID, setErrorPMID] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [file, setFile] = useState(null);
  const [errorPdf, setErrorPdf] = useState("");
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [isDraft, setIsDraft] = useState(false);
  const [fileQueue, setFileQueue] = useState([]); // Queue for files to process
  const [isProcessingFile, setIsProcessingFile] = useState(false); // Flag to check if a file is being processed
  const [articleLoading, setArticleLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(get_countries_service_auth());
  }, []);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
    }
  }, [initialData]);

  // 29499084
  const handleSearch = async () => {
    if (!searchPMID.trim()) return;

    setLoadingMHID(true);
    setArticleLoading(true);
    setErrorPMID("");

    try {
      // First check if the PMID already exists
      const firstCheckResponse = await apiHandle.post(
        `check-pmid/${searchPMID}`
      );

      console.log("firstCheckResponse.data", firstCheckResponse?.data);

      const { status, pmid, article } = firstCheckResponse?.data;

      if (status && pmid) {
        onPdfBotData(article);
        setIsArticleInfoOpen(true);
        
        // Check for existing article if title exists
        if (article?.publicData?.title && onTitleChange) {
          await onTitleChange(article.publicData.title);
        }
        
        // setErrorPMID("This PMID already exists in the database.");
        setLoadingMHID(false);
        return; // Exit if PMID exists
      }

      // Fetch authors from the library (get-authors API)
      const authorsLibraryResponse = await apiHandle.get("get-authors");
      const authorsLibrary = authorsLibraryResponse?.data?.authors;

      // If PMID doesn't exist, fetch data from the Europe PMC API
      const response = await axios.get(
        `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:${searchPMID}&resultType=core&format=json`
      );
      const data = response?.data?.resultList?.result[0];

      setIsArticleInfoOpen(true);

      // Split the authorString into an array of authors
      const authorsArray = data.authorString
        ? data.authorString.split(",").map((author, index) => {
            const trimmedAuthorName = author.trim(); // Trim spaces for clean data

            // Check if the author exists in the library
            const matchedAuthor = authorsLibrary.find(
              (libraryAuthor) =>
                libraryAuthor.name.toLowerCase() ===
                trimmedAuthorName.toLowerCase()
            );

            return {
              affiliation: index === 0 ? data?.affiliation : "",
              name: trimmedAuthorName,
              parent_id: matchedAuthor ? matchedAuthor.id : 1, // Use matched author's ID or default to 1
            };
          })
        : []; // If no authors, default to an empty array

      // Function to clean HTML
      // const sanitizeHTMLWithDOMParser = (html) => {
      //     const parser = new DOMParser();
      //     const doc = parser.parseFromString(html, "text/html");

      //     return doc.body.innerText || "";
      // };
      const sanitizeHTMLWithDOMParser = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // turn <br> into single line-breaks
        doc.querySelectorAll("br").forEach((br) => br.replaceWith("\n"));

        // turn each paragraph into its text + two line-breaks
        doc.querySelectorAll("p").forEach((p) => {
          const text = p.textContent.trim();
          p.replaceWith(text + "\n\n");
        });

        // now grab the cleaned text
        return doc.body.textContent.trim();
      };

      const rawAbstract = data.abstractText || "";
      const sanitizedAbstract = sanitizeHTMLWithDOMParser(rawAbstract);

      // ✅ Update `formData` to match the structure
      setFormData({
        title: { name: data.title || "", status: "Unverified" },
        authors: authorsArray,
        year: {
          name: data.pubYear ? parseInt(data.pubYear, 10) : "",
          status: "Unverified",
        },
        country: [],
        grantCountry: { name: "", status: "Unverified" },
        researchCountry: [],
        pmid: { name: data.pmid || "", status: "Unverified" },
        doi: { name: data.doi || "", status: "Unverified" },
        abstract: { name: sanitizedAbstract, status: "Unverified" },
        publisher: { name: data?.publisher || "", status: "Unverified" },
        journal: {
          name: data.journalInfo ? data.journalInfo?.journal?.title : "",
          status: "Unverified",
        },
        journalURL: {
          name: data.fullTextUrlList ? data.fullTextUrlList[0]?.url : "",
          status: "Unverified",
        },
        volume: {
          name: data.journalInfo ? data.journalInfo.volume : "",
          status: "Unverified",
        },
        pages: { name: data.pageInfo || "", status: "Unverified" },
        impactFactor: { name: "", status: "Unverified" },
        HIndex: { name: "", status: "Unverified" },
        sciMAGO: { name: "", status: "Unverified" },
        pdf_url: [],
        journalAbbreviation: {
          name: data.journalInfo?.journal?.medlineAbbreviation || "",
          status: "Unverified",
        },
        issn: {
          name: data.journalInfo?.journal?.issn || "",
          status: "Unverified",
        },
        publicationType: {
          name: data.pubTypeList?.pubType?.join(", ") || "",
          status: "Unverified",
        },
        citedByCount: { name: data.citedByCount || 0, status: "Unverified" },
        keywords: {
          name: data?.keywordList?.keyword?.join(", ") || "",
          status: "Unverified",
        },
        // affiliations: { name: data?.affiliation || '', status: 'Unverified' },
        issue: { name: data?.journalInfo?.issue, status: "Unverified" },
        authorIdList: data?.authorIdList?.authorId,
        grantList: data?.grantsList?.grant,
        publicationStatus: {
          name: data?.publicationStatus,
          status: "Unverified",
        },
        PublicationDate: {
          name: data.journalInfo?.printPublicationDate,
          status: "Unverified",
        },
        meshHeadingList: {
          name: data.meshHeadingList?.meshHeading,
          status: "Unverified",
        },
      });
    } catch (err) {
      setErrorPMID("Failed to fetch data. Please try again.");
    } finally {
      setLoadingMHID(false);
      setArticleLoading(false);
    }
  };

  const [errorState, setErrorState] = useState("");

  const handleChange = async (value, name) => {
    if (name === "doiError") {
      setValidationErrors({ ...validationErrors, doi: value });
    } else {
      setErrorState("");
      setValidationErrors({ ...validationErrors, doi: "" });

      const newFieldData = Array.isArray(value)
        ? value.map((item) =>
            typeof item === "string"
              ? { name: item, status: "Unverified" }
              : item
          ) // Ensure array values are objects
        : { name: value, status: "Unverified" }; // Ensure single values are objects

      setFormData((prevState) => ({
        ...prevState,
        [name]: newFieldData,
      }));

      // Check for existing article when title changes
      if (name === "title" && onTitleChange && value?.trim() && !isEditAvailble) {
        await onTitleChange(newFieldData);
      }
    }
  };

  const handleAuthorsChange = (updatedAuthors) => {
    setFormData({ ...formData, authors: updatedAuthors });
  };

  console.log("formData", formData);

  const validateForm = () => {
    const requiredFields = ["title", "pmid", "doi"];
    let errors = {};

    // Check if at least one of the required fields is filled
    const isAnyRequiredFieldFilled = requiredFields.some(
      (field) => formData[field]
    );

    if (!isAnyRequiredFieldFilled) {
      // If none of the required fields are filled, add an error message for all of them
      requiredFields.forEach((field) => {
        errors[field] = setErrorState(
          "At least one of Title, PMID, or DOI is required"
        );
        // errors[field] = `${field} is required`;
        // errorCheck
      });
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const hasError = (fields) => fields.some((field) => validationErrors[field]);

  const isArticleInfoInvalid = hasError(["title", "pmid", "doi"]);
  const isCountryInfoInvalid = hasError([]);
  const [isArticleInfoOpen, setIsArticleInfoOpen] =
    useState(isArticleInfoInvalid);
  const [isCountryInfoOpen, setIsCountryInfoOpen] =
    useState(isCountryInfoInvalid);
  const [isJournalInfoOpen, setIsJournalInfoOpen] = useState();
  const [isOther, setIsOther] = useState();

  useEffect(() => {
    if (isArticleInfoInvalid && !isArticleInfoOpen) {
      setIsArticleInfoOpen(true);
    }
    if (isCountryInfoInvalid && !isCountryInfoOpen) {
      setIsCountryInfoOpen(true);
    }
  }, [isArticleInfoInvalid, isCountryInfoInvalid, validationErrors]);

  // const handleFileChange = (e) => {
  //   const selectedFiles = Array.from(e.target.files); // Convert FileList to an array
  //   if (selectedFiles.length) {
  //     setFileQueue((prevQueue) => [...prevQueue, ...selectedFiles]); // Add files to the queue
  //   }
  // };

  // useEffect(() => {
  //   if (!isProcessingFile && fileQueue.length > 0) {
  //     const nextFile = fileQueue[0]; // Get the first file in the queue
  //     setPendingFile(nextFile); // Set the file for processing
  //     setShowModal(true); // Show the modal
  //   }
  // }, [fileQueue, isProcessingFile]);

  // const handleFileChange = (e) => {
  //   const selectedFiles = Array.from(e.target.files).filter((file) => {
  //     // Only add files that haven't been processed yet
  //     return !processedFiles.has(file.name + file.size + file.lastModified);
  //   });

  //   if (selectedFiles.length) {
  //     setFileQueue((prevQueue) => [...prevQueue, ...selectedFiles]);
  //     // Clear any existing PDF error when adding new files
  //     setErrorPdf("");
  //   }
  // };

  // Remove the processed files tracking completely
  // const [processedFiles, setProcessedFiles] = useState(new Set());

  // Simplify handleFileChange to not use the tracking system
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length) {
      setFileQueue((prevQueue) => [...prevQueue, ...selectedFiles]);
      // Clear any existing PDF error when adding new files
      setErrorPdf("");
    }
  };

  // Update the error handling to clear the file input
  try {
    // Your upload code...
  } catch (error) {
    console.error("Error processing file:", error);
    setErrorPdf("Failed to analyze PDF: " + error.message);
    error_toast_message("Failed to process PDF");

    // Clear the file input to allow reselection
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Move to next file in queue
    setFileQueue((prev) => prev.slice(1));
    setPendingFile(null);
    setIsProcessingFile(false);
  }

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadOnly = async () => {
    setShowPdfActionModal(false);
    if (!pendingFile) return;

    try {
      setIsProcessingFile(true);

      // Skip PDF analysis, only upload to Cloudinary
      const uploadResult = await uploadToCloudinary(pendingFile);

      // Show paywall modal after upload
      setShowModal(true);
    } catch (error) {
      console.error("Error uploading file:", error);
      setErrorPdf("File upload failed: " + error.message);

      // Mark file as processed even if it failed
      const fileIdentifier =
        pendingFile.name + pendingFile.size + pendingFile.lastModified;
      setProcessedFiles((prev) => new Set([...prev, fileIdentifier]));

      // Move to next file in queue
      setFileQueue((prev) => prev.slice(1));
      setPendingFile(null);
      setIsProcessingFile(false);
    }
  };

  const handleScrapeAndUpload = async () => {
    setShowPdfActionModal(false);
    if (!pendingFile) return;

    try {
      setIsProcessingFile(true);

      // First analyze the PDF with the PDF Bot
      setIsPdfAnalyzing(true);
      await uploadToPdfBot(pendingFile);

      // Then show paywall modal
      setShowModal(true);
    } catch (error) {
      console.error("Error processing file:", error);
      setErrorPdf("Failed to analyze PDF: " + error.message);
      error_toast_message("Failed to process PDF");

      // Mark file as processed even if it failed
      const fileIdentifier =
        pendingFile.name + pendingFile.size + pendingFile.lastModified;
      setProcessedFiles((prev) => new Set([...prev, fileIdentifier]));

      // Move to next file in queue
      setFileQueue((prev) => prev.slice(1));
      setPendingFile(null);
      setIsProcessingFile(false);
    }
  };

  // 3. Update useEffect for fileQueue to show the PDF action modal first
  useEffect(() => {
    if (!isProcessingFile && fileQueue.length > 0) {
      const nextFile = fileQueue[0];
      setPendingFile(nextFile);
      setShowPdfActionModal(true); // Show the PDF action choice modal first
    }
  }, [fileQueue, isProcessingFile]);

  // Add these state variables to the PublicDataForm component
  const [isPdfAnalyzing, setIsPdfAnalyzing] = useState(false);

  const uploadToPdfBot = async (fileToUpload) => {
    setIsPdfAnalyzing(true);
    const formData = new FormData();
    formData.append("file", fileToUpload);

    try {
      // Create an abort controller for timeout handling
      const controller = new AbortController();
      // const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 minutes timeout

      const response = await apiHandle.post("pdf-bot-scrapper", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        // signal:controller.signal
      });

      // Clear the timeout since request completed
      // clearTimeout(timeoutId);

      // Process the response data directly since apiHandle likely returns the data
      // If apiHandle doesn't automatically parse JSON, adjust accordingly
      const data = response.data || response;

      console.log("data", data);

      if (data?.status) {
        // Process response and notify parent component
        onPdfBotData(data);
        setIsArticleInfoOpen(true);
        return { success: true, message: "PDF analyzed successfully" };
      } else {
        throw new Error(data.message || "Failed to analyze PDF");
      }
    } catch (error) {
      // Handle AbortController timeout specifically
      if (error.name === "AbortError") {
        console.error("Request timed out after 3 minutes");
        throw new Error(
          "PDF analysis is taking longer than expected. Please try again or use a smaller file."
        );
      } else {
        console.error("PDF Bot upload error:", error);
        throw error;
      }
    } finally {
      setIsPdfAnalyzing(false);
    }
  };

  // const handleModalResponse = async (isPaywall) => {
  //   setShowModal(false);
  //   if (!pendingFile) return;

  //   try {
  //     setIsProcessingFile(true);

  //     // First, analyze the PDF with the PDF Bot
  //     setIsPdfAnalyzing(true);
  //     await uploadToPdfBot(pendingFile);

  //     // Only upload to Cloudinary after successful analysis
  //     const uploadResult = await uploadToCloudinary(pendingFile);

  //     const newPdf = {
  //       name: uploadResult.url,
  //       status: "Unverified",
  //       isPaywall: isPaywall,
  //     };

  //     setFormData((prev) => ({
  //       ...prev,
  //       pdf_url: [...(prev.pdf_url || []), newPdf],
  //     }));
  //   } catch (error) {
  //     console.error("Error processing file:", error);
  //     setErrorPdf("File processing failed: " + error.message);
  //     error_toast_message("Failed to process PDF");
  //   } finally {
  //     setFileQueue((prev) => prev.slice(1));
  //     setPendingFile(null);
  //     setIsProcessingFile(false);
  //   }
  // };

  const handleModalResponse = async (isPaywall) => {
    setShowModal(false);
    if (!pendingFile) return;

    try {
      // If we reached this point, we need to upload to Cloudinary (if not already done)
      let uploadResult;
      if (!showPdfActionModal) {
        // Check if we came from the scrape flow
        uploadResult = await uploadToCloudinary(pendingFile);
      }

      const newPdf = {
        name: uploadResult.url,
        status: "Unverified",
        isPaywall: isPaywall,
      };

      setFormData((prev) => ({
        ...prev,
        pdf_url: [...(prev.pdf_url || []), newPdf],
      }));

      // Mark file as successfully processed
      const fileIdentifier =
        pendingFile.name + pendingFile.size + pendingFile.lastModified;
      setProcessedFiles((prev) => new Set([...prev, fileIdentifier]));
    } catch (error) {
      console.error("Error finalizing file upload:", error);
      setErrorPdf("File upload failed: " + error.message);
    } finally {
      setFileQueue((prev) => prev.slice(1));
      setPendingFile(null);
      setIsProcessingFile(false);
      setIsPdfAnalyzing(false);
    }
  };

  const uploadToCloudinary = async (fileToUpload) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("article", fileToUpload);

    try {
      const response = await apiHandle.post("upload-article-pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response.data?.article_url) {
        throw new Error("Invalid response format");
      }

      return { url: response.data.article_url };
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error("Upload failed: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePaywallChange = (index, isPaywall) => {
    setFormData((prev) => {
      const updatedPdfs = [...prev.pdf_url];
      updatedPdfs[index] = {
        ...updatedPdfs[index],
        isPaywall: isPaywall,
      };
      return {
        ...prev,
        pdf_url: updatedPdfs,
      };
    });
  };

  
  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      // Check if file was already processed
      const fileIdentifier =
        droppedFile.name + droppedFile.size + droppedFile.lastModified;
      if (!processedFiles.has(fileIdentifier)) {
        setPendingFile(droppedFile);
        setShowPdfActionModal(true); // Show PDF action choice modal
        setErrorPdf(""); // Clear any existing errors
      }
    } else {
      setFile(null);
      setErrorPdf("Please drop a valid PDF file.");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const removeFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      pdf_url: prev.pdf_url.filter((_, i) => i !== index),
    }));
  };

  // const checkIfArticleExists = async (data) => {
  //   try {
  //     const response = await apiHandle.post("/check-article", {
  //       pmid: data.pmid?.name || "",
  //       title: data.title?.name || "",
  //       doi: data.doi?.name || "",
  //     });
  //     // console.log("response".response);

  //     return response.data?.article;
  //   } catch (error) {
  //     // console.error("Error checking article existence:", error);
  //     return false; // Default to false if API fails
  //   }
  // };

  const handleDraftSave = async (e) => {
    e.preventDefault();

    // Skip checking if initialData exists
    if (isEditAvailble) {
      setIsDraft(true);
      onDraftSubmit(formData);
      return;
    }

    // Check if title, DOI, or PMID exists
    if (!formData.title && !formData.doi && !formData.pmid) {
      message.error("At least one of Title, DOI, or PMID is required.");
      return;
    }

    // const articleExists = await checkIfArticleExists(formData);
    // if (articleExists) {
    //   onArticleExists(articleExists);
    //   message.error("This article already exists in the database.");
    //   return;
    // } else {
    const hasHydrogenKeyword = checkHydrogenKeywords();

    if (!hasHydrogenKeyword) {
      // Set action type to 'draft' so we know which flow to follow after modal
      setActionType("draft");
      // Show the hydrogen keywords warning modal
      setShowKeywordWarningModal(true);
      return;
    }

    setIsDraft(true); // Mark action as draft
    onDraftSubmit(formData);
    // }
  };

  // console.log("isEditAvailble", isEditAvailble);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If "Save as Draft" is clicked
    if (isDraft) {
      setIsDraft(false);
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Skip checking if initialData exists
    // if (!isEditAvailble) {
    //   const articleExists = await checkIfArticleExists(formData);
    //   if (articleExists) {
    //     onArticleExists(articleExists);
    //     message.error("This article already exists in the database.");
    //     return;
    //   }
    // }

    const hasHydrogenKeyword = checkHydrogenKeywords();

    if (!hasHydrogenKeyword) {
      // Set action type to 'submit' so we know which flow to follow after modal
      setActionType("submit");
      // Show the hydrogen keywords warning modal
      setShowKeywordWarningModal(true);
      return;
    }

    const optionalFields = [
      "title",
      "authors",
      "year",
      "country",
      "doi",
      "abstract",
      "journal",
      "volume",
      "pages",
    ];

    const missing = optionalFields.filter((field) => !formData[field]);

    if (missing.length > 0) {
      setMissingFields(missing);
      setIsConfirmationModalVisible(true);
    } else {
      onSubmit(formData);
      // console.log("formData", formData);
    }
  };

  const confirmSubmit = async (e) => {
    e.preventDefault();

    // Skip checking if initialData exists
    // if (!isEditAvailble) {
    //   const articleExists = await checkIfArticleExists(formData);
    //   if (articleExists) {
    //     onArticleExists(articleExists);
    //     message.error("This article already exists in the database.");
    //     return;
    //   }
    // }

    onSubmit(formData);

    setIsConfirmationModalVisible(false);
  };

  const continueSubmitFlow = () => {
    const optionalFields = [
      "title",
      "authors",
      "year",
      "country",
      "doi",
      "abstract",
      "journal",
      "volume",
      "pages",
    ];

    const missing = optionalFields.filter((field) => !formData[field]);

    if (missing.length > 0) {
      setMissingFields(missing);
      setIsConfirmationModalVisible(true);
    } else {
      onSubmit(formData);
    }
  };

  const InfoTooltip = ({ message, width }) => (
    <div className="relative group">
      <FaInfoCircle
        className="ml-2 cursor-pointer"
        color={colorTheme.primary}
      />
      <div
        style={{
          width: width || "300px",
          whiteSpace: "pre-wrap",
          backgroundColor: "#333", // Softer dark gray for better contrast
          color: "#e0e0e0", // Light gray for text for improved readability
          fontWeight: "normal", // Softer text weight for clarity
          border: "1px solid #555", // Border for subtle contrast
          padding: "10px", // More padding for readability
          borderRadius: "5px", // Rounded corners for visual comfort
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Softer shadow for subtle lift,
          fontSize: "14px",
        }}
        className="absolute bottom-full mb-2 hidden group-hover:block"
      >
        {message}
      </div>
    </div>
  );

  const fieldNameMappings = {
    title: "Title",
    authors: "Authors",
    year: "Year of Publication",
    country: "Country",
    doi: "DOI",
    abstract: "Abstract",
    journal: "Journal",
    volume: "Volume",
    pages: "Pages",
  };

  const currentYear = new Date().getFullYear();
  const startYear = 1950;
  const yearsPast = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => currentYear - i
  );

  useEffect(() => {
    if (errorState) {
      window.scrollTo(0, 0);
    }
  }, [errorState]);

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "title":
        if (!value.trim()) {
          error = "Title is required.";
        }
        break;
      case "authors":
        if (!value.trim()) {
          error = "Authors are required.";
        }
        break;
      case "year":
        if (!value) {
          error = "Year is required.";
        }
        break;
      case "doi":
        if (!value.trim()) {
          error = "DOI is required.";
        }
        break;
      case "abstract":
        if (!value.trim()) {
          error = "Abstract is required.";
        }
        break;
      case "journal":
        if (!value.trim()) {
          error = "Journal is required.";
        }
        break;
      case "volume":
        if (!value.trim()) {
          error = "Volume is required.";
        }
        break;
      case "pages":
        if (!value.trim()) {
          error = "Pages are required.";
        }
        break;
      default:
        break;
    }

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleAddCountry = (newCountry) => {
    const obj = { name: newCountry, status: "Pending" };

    dispatch(add_country_service_auth(obj))
      .then(() => {
        notification.success({ message: "Country added successfully!" });

        // Add the newly created country with Pending status to the form
        const newCountryObj = { name: newCountry, status: "Pending" };

        setFormData((prev) => ({
          ...prev,
          country: [...(prev.country || []), newCountryObj],
        }));

        // notification.info({
        //     message: "Country under verification",
        //     description: "Available after admin approval"
        // });

        dispatch(get_countries_service_auth());
      })
      .catch((error) => {
        console.error("Error adding country:", error);
        notification.error({ message: "Country add failed" });
      });
  };

  // Updated handleAddGrantCountry function
  const handleAddGrantCountry = (newCountry) => {
    const obj = { name: newCountry, status: "Pending" };

    dispatch(add_country_service_auth(obj))
      .then(() => {
        notification.success({ message: "Country added successfully!" });

        // Set the newly created country with Pending status
        const newCountryObj = {
          name: newCountry,
          status: "Pending",
        };

        setFormData((prev) => ({
          ...prev,
          grantCountry: newCountryObj,
        }));

        // notification.info({
        //     message: "Country under verification",
        //     description: "Available after admin approval"
        // });

        dispatch(get_countries_service_auth());
      })
      .catch((error) => {
        console.error("Error adding country:", error);
        notification.error({ message: "Country add failed" });
      });
  };

  // Updated handleAddResearchCountry function
  const handleAddResearchCountry = (newCountry) => {
    const obj = { name: newCountry, status: "Pending" };

    dispatch(add_country_service_auth(obj))
      .then(() => {
        notification.success({ message: "Country added successfully!" });

        // Add the newly created country with Pending status to the form
        const newCountryObj = { name: newCountry, status: "Pending" };

        setFormData((prev) => ({
          ...prev,
          researchCountry: [...(prev.researchCountry || []), newCountryObj],
        }));

        // notification.info({
        //     message: "Country under verification",
        //     description: "Available after admin approval"
        // });

        dispatch(get_countries_service_auth());
      })
      .catch((error) => {
        console.error("Error adding research country:", error);
        notification.error({ message: "Country add failed" });
      });
  };

const approvedCountries = get_country_data?.countries || [];

const options = approvedCountries
  .filter(
    (country) =>
      country !== null &&
      typeof country === 'object' &&
      typeof country.name === 'string' &&
      country.name.trim().toLowerCase() !== 'null' && // filters out "null" string too
      country.name.trim() !== ''
  )
  .map((country) => country.name.trim())
  .sort((a, b) => a.localeCompare(b));


  console.log("options",options);

  const researchCountryOptions = [...options, "Same as Author Country"];

  const handleStatusChange = (fieldName, newStatus) => {
    console.log(`Status changed for ${fieldName}: ${newStatus}`); // Log status change
    setFormData((prev) => ({
      ...prev,
      [fieldName]: Array.isArray(prev[fieldName])
        ? prev[fieldName].map((item) => ({ ...item, status: newStatus }))
        : { ...prev[fieldName], status: newStatus },
    }));
  };

  const handleStatusChangeAbs = (fieldName, newStatus) => {
    console.log(`Status changed for ${fieldName}: ${newStatus}`); // Log status change

    setFormData((prev) => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName], // Preserve existing values
        status: newStatus, // Update status only
      },
    }));
  };

  const handleStatusChangeAur = (updatedAuthors) => {
    setFormData((prev) => ({
      ...prev,
      authors: updatedAuthors,
    }));
  };

  const handlePdfStatusChange = (index, newStatus) => {
    setFormData((prev) => ({
      ...prev,
      pdf_url: prev.pdf_url.map((pdf, i) =>
        i === index ? { ...pdf, status: newStatus } : pdf
      ),
    }));
  };

  const yearForSelect =
    formData.year && formData.year.name
      ? {
          ...formData.year,
          // Convert name to match the type in options array (likely numbers)
          name:
            typeof yearsPast[0] === "number" &&
            typeof formData.year.name === "string"
              ? parseInt(formData.year.name, 10)
              : formData.year.name,
        }
      : formData.year;

  return (
    <div className="relative">
      {" "}
      {/* Parent ko relative banaya hai */}
      {/* {articleLoading ||
        (isPdfAnalyzing && (
          <div className="absolute max-w-4xl mx-auto inset-0 bg-black/70 z-50 flex flex-col items-center justify-center rounded-lg">
            <Oval
              height={40}
              width={40}
              color={colorTheme.primary}
              wrapperClass=""
              visible={true}
              ariaLabel="oval-loading"
              // secondaryColor="lightblue"
              secondaryColor="#93c5fd"
              strokeWidth={6}
              strokeWidthSecondary={6}
            />
            <p className="mt-3 text-white">Fetching details please wait...</p>
          </div>
        ))} */}
      {(articleLoading || isPdfAnalyzing) && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/75">
          {/* This div covers the ENTIRE viewport, including sidebar and top bar */}
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
            {/* Progress bar at the top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
              <div
                className="h-full bg-[#004c78] animate-pulse"
                style={{ width: "100%" }}
              ></div>
            </div>

            <div className="flex flex-col items-center text-center">
              <Oval
                height={60}
                width={60}
                color={colorTheme.primary}
                wrapperClass="mb-4"
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#93c5fd"
                strokeWidth={4}
                strokeWidthSecondary={4}
              />

              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {isPdfAnalyzing ? "Analyzing PDF" : "Fetching Details"}
              </h3>

              <p className="text-gray-600 mb-4">
                {isPdfAnalyzing
                  ? "Extracting data from your PDF. This process may take 2-3 minutes depending on the file size."
                  : "Retrieving article information. This should only take a moment."}
              </p>

              {isPdfAnalyzing && (
                <div className="bg-blue-50 border-l-4 border-[#004c78] p-4 w-full text-sm text-[#004c78]">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-[#004c78]"
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
                      <p className="text-sm text-[#004c78]">
                        Please don't close or refresh this page while
                        processing.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-6">
        <>
          <h1 className="text-2xl font-bold mb-6">Autopopulate Article Data</h1>
          {(user?.role_id === 1 || user?.role_id === 2) && (
            <>
             {/* Upload PDF */}
              <div className="mb-6 relative">
                <label className="block text-gray-700 font-semibold mb-2">
                  Upload PDF
                </label>
                <div>
                  {/* Render existing PDFs if available */}
                  {formData?.pdf_url?.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {formData.pdf_url.map((pdf, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between border-2 border-gray-300 rounded-md p-4 bg-gray-50"
                        >
                          {/* PDF Preview and Link */}
                          <div className="text-gray-700 flex items-center">
                            <FaFilePdf className="text-[#004c78] mr-2" />
                            <button
                              onClick={() =>
                              window.open(`/admin/pdf-viewer?pdfUrl=${encodeURIComponent(pdf.name)}`, "_blank")
                              }
                              className="text-[#004c78] font-semibold underline"
                            >
                              {`PDF ${index + 1}`}
                            </button>
                          </div>

                          {/* Paywall Radio Buttons */}
                          <div className="ml-4 flex items-center space-x-2">
                            <span className="text-sm text-gray-500">
                              Paywalled:
                            </span>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name={`pdf-paywall-${index}`}
                                value="true"
                                checked={pdf.isPaywall === true}
                                onChange={(e) =>
                                  handlePaywallChange(
                                    index,
                                    e.target.value === "true"
                                  )
                                }
                                className="mr-1"
                              />
                              <span className="text-sm">Yes</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name={`pdf-paywall-${index}`}
                                value="false"
                                checked={pdf.isPaywall === false}
                                onChange={(e) =>
                                  handlePaywallChange(
                                    index,
                                    e.target.value === "true"
                                  )
                                }
                                className="mr-1"
                              />
                              <span className="text-sm">No</span>
                            </label>
                          </div>

                          {/* Status Selection (Verified / Unverified) */}
                          {isSpecialAction && (
                            <div className="flex items-center space-x-2 ml-4">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name={`pdf-status-${index}`}
                                  value="Verified"
                                  checked={pdf.status === "Verified"}
                                  onChange={() =>
                                    handlePdfStatusChange(index, "Verified")
                                  }
                                  className="mr-1"
                                />
                                <span>Verified</span>
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name={`pdf-status-${index}`}
                                  value="Unverified"
                                  checked={pdf.status === "Unverified"}
                                  onChange={() =>
                                    handlePdfStatusChange(index, "Unverified")
                                  }
                                  className="mr-1"
                                />
                                <span>Unverified</span>
                              </label>
                            </div>
                          )}

                          {/* Remove Button */}
                          <FaTimesCircle
                            onClick={() => removeFile(index)}
                            className="text-red-500 cursor-pointer ml-2"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* File upload input */}
                  <div
                    className="border-2 border-dashed border-[#004c78] rounded-md p-4 text-center cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    {isUploading ? (
                      "Uploading..."
                    ) : (
                      <>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          id="fileInput"
                          multiple
                        />
                        <label
                          htmlFor="fileInput"
                          className="text-[#004c78] cursor-pointer"
                        >
                          Drag & Drop or Choose files to upload
                        </label>
                      </>
                    )}
                  </div>
                </div>
                {errorPdf && (
                  <p className="text-red-500 mt-2">Failed to analyze PDF</p>
                )}

                {/* Modal Logic */}
                {showModal && (
                  <ModalCom
                    question="Will this be behind a paywall?"
                    onClose={() => handleModalResponse(false)} // No Button
                    onConfirm={() => handleModalResponse(true)} // Yes Button
                  />
                )}
              </div>
              {/* Search by PMID */}
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">
                  Search by PMID
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={searchPMID}
                    onChange={(e) => setSearchPMID(e.target.value)}
                    className="border px-4 py-2 rounded w-full mr-4"
                    placeholder="Enter PMID..."
                  />
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="text-white py-2 px-4 rounded"
                    style={{ backgroundColor: colorTheme.primary }}
                  >
                    {/* {loadingMHID ? 'Searching...' : 'Search'} */}
                    {articleLoading ? (
                      <div className="flex items-center">
                        <span className="mr-2">Searching...</span>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      </div>
                    ) : (
                      "Search"
                    )}
                  </button>
                </div>
                {errorPMID && <p className="text-red-500 mt-2">{errorPMID}</p>}
              </div>
              <SearchByURL
                setArticleLoading={setArticleLoading}
                setFormData={setFormData}
                setIsArticleInfoOpen={setIsArticleInfoOpen}
                colorTheme={{ primary: colorTheme.primary }}
                onTitleChange={onTitleChange}
              />

              <h1 className="text-2xl font-bold mb-6">Input Article Data</h1>

             
            </>
          )}

          {/* Form Fields */}
          <form>
            {errorState && (
              <div
                style={{ color: "red", fontSize: "14px", fontWeight: "bold" }}
              >
                {errorState}
              </div>
            )}
            {/* Article Citation Information (Heading II) */}

            <Accordion
              title="Article Citation Information"
              isOpen={isArticleInfoOpen}
              onToggle={() => setIsArticleInfoOpen((prev) => !prev)}
            >
              {/* Title */}
              <Input
                label="Title"
                value={formData.title?.name}
                onChange={handleChange}
                name="title"
                InfoTooltip={
                  <InfoTooltip message="Enter title exactly as shown in article" />
                }
                error={validationErrors.title}
                onBlur={async (e) => {
                  validateField(e.target.name, e.target.value);
                  // Check for existing article when title field loses focus
                  if (onTitleChange && e.target.value?.trim()) {
                    await onTitleChange({ name: e.target.value.trim(), status: "Unverified" });
                  }
                }}
                isSpecialAction={isSpecialAction} // Pass isSpecialAction
                status={formData.title?.status} // Pass status
                onStatusChange={handleStatusChange} // Pass status change handler
              />

              {/* PMID */}
              <Input
                label="PMID"
                value={formData.pmid?.name}
                onChange={handleChange}
                name="pmid"
                InfoTooltip={
                  <InfoTooltip message="Enter the PMID as found on PubMed if available." />
                }
                isSpecialAction={isSpecialAction} // Pass isSpecialAction
                status={formData.pmid?.status} // Pass status
                onStatusChange={handleStatusChange} // Pass status change handler
              />

              {/* doi */}
              <DoiInput
                value={formData?.doi?.name}
                onChange={handleChange}
                InfoTooltip={
                  <InfoTooltip message="Enter the unique DOI of the article." />
                }
                error={validationErrors.doi}
                isSpecialAction={isSpecialAction} // Pass isSpecialAction
                status={formData.doi?.status} // Pass status
                onStatusChange={handleStatusChange} // Pass status change handler
              />

              <AuthorsComponent
                label={"Authors"}
                value={formData?.authors?.map((author) => ({
                  ...author,
                  status: author.status || "Unverified", // Ensure status exists
                }))}
                onChange={handleAuthorsChange}
                isSpecialAction={isSpecialAction}
                status={
                  formData?.authors?.length === 0 ||
                  formData?.authors?.every(
                    (author) => !author.status || author.status === "Unverified"
                  )
                    ? "Unverified"
                    : "Verified"
                }
                onStatusChange={handleStatusChangeAur}
                name={"authors"}
              />

              {/* Abstract */}
              <div className="mb-4 relative">
                <div className="text-gray-700 font-semibold mb-2 flex justify-between items-center w-full">
                  {/* Left Section: Label & Tooltip */}
                  <div className="flex items-center">
                    <span>Abstract</span>
                    <span>
                      <InfoTooltip message="Copy and Paste the complete abstract of the article. " />
                    </span>
                  </div>

                  {/* Right Section: Radio Buttons */}
                  {isSpecialAction && formData.abstract && (
                    <div className="ml-4 flex items-center space-x-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="abstract-status"
                          value="Verified"
                          checked={formData.abstract?.status === "Verified"}
                          onChange={() =>
                            handleStatusChangeAbs("abstract", "Verified")
                          }
                          className="mr-1"
                        />
                        <span>Verified</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="abstract-status"
                          value="Unverified"
                          checked={formData.abstract?.status === "Unverified"}
                          onChange={() =>
                            handleStatusChangeAbs("abstract", "Unverified")
                          }
                          className="mr-1"
                        />
                        <span>Unverified</span>
                      </label>
                    </div>
                  )}
                </div>
                <Editor
                  value={formData.abstract?.name || ""}
                  onTextChange={(e) => handleChange(e.htmlValue, "abstract")}
                  style={{
                    height: "320px",
                    border: validationErrors.abstract
                      ? "2px solid red" // Red border for validation errors
                      : formData.abstract &&
                        formData.abstract?.name &&
                        formData.abstract?.name?.trim?.() !== ""
                      ? "2px solid gray" // Gray border when valid
                      : "1px solid #ccc", // Default light gray border
                  }}
                  placeholder="Enter abstract"
                  onBlur={() => {
                    if (formData.abstract && formData.abstract.name) {
                      validateField("abstract", formData.abstract.name);
                    }
                  }}
                />
                {validationErrors.abstract && (
                  <div
                    style={{
                      color: "red",
                      fontSize: 14,
                      marginTop: 2,
                      marginLeft: 2,
                    }}
                  >
                    {validationErrors.abstract}
                  </div>
                )}
              </div>

              {/* Year */}
              <CustomCreatableSelect
                isCreate={false}
                label="Year"
                options={[...yearsPast]}
                value={yearForSelect}
                onChange={handleChange}
                name="year"
                InfoTooltip={
                  <InfoTooltip message="Enter year article was published" />
                }
                error={validationErrors.year && "Please select Year"}
                onBlur={(e) => validateField(e.target.name, e.target.value)}
                isSpecialAction={isSpecialAction} // Pass isSpecialAction
                status={formData.year?.status} // Pass status
                onStatusChange={handleStatusChange} // Pass status change handler
              />

              {/* Publication Date */}
              <div className="hidden">
                <Input
                  label="Publication Date"
                  value={formData.PublicationDate?.name}
                  onChange={handleChange}
                  name="PublicationDate"
                  type="date"
                  isSpecialAction={isSpecialAction} // Pass isSpecialAction
                  status={formData.PublicationDate?.status} // Pass status
                  onStatusChange={handleStatusChange} // Pass status change handler
                />
              </div>
            </Accordion>

            {/* Journal Information */}
            <Accordion
              title="Journal Information"
              isOpen={isJournalInfoOpen}
              onToggle={() => setIsJournalInfoOpen((prev) => !prev)}
            >
              {/* Journal */}
              <Input
                label="Journal / Book Information"
                value={formData.journal?.name}
                onChange={handleChange}
                name="journal"
                InfoTooltip={
                  <InfoTooltip message="Enter the name of the Journal the article was published in." />
                }
                error={validationErrors.journal}
                onBlur={(e) => validateField(e.target.name, e.target.value)}
                isSpecialAction={isSpecialAction} // Pass isSpecialAction
                status={formData.journal?.status} // Pass status
                onStatusChange={handleStatusChange} // Pass status change handler
              />

              {/* Journal Abbreviation */}
              <div className="hidden">
                <Input
                  label="Journal Abbreviation"
                  value={formData.journalAbbreviation?.name}
                  onChange={handleChange}
                  name="journalAbbreviation"
                  isSpecialAction={isSpecialAction} // Pass isSpecialAction
                  status={formData.journalAbbreviation?.status} // Pass status
                  onStatusChange={handleStatusChange} // Pass status change handler
                />
              </div>

              {/* Journal URL */}
              <div className="hidden">
                <Input
                  label="Journal URL"
                  value={formData.journalURL?.name}
                  onChange={handleChange}
                  name="journalURL"
                  InfoTooltip={
                    <InfoTooltip message="Enter the URL of the Journal." />
                  }
                  isSpecialAction={isSpecialAction} // Pass isSpecialAction
                  status={formData.journalURL?.status} // Pass status
                  onStatusChange={handleStatusChange} // Pass status change handler
                />
              </div>

              {/* Journal Publisher */}
              <Input
                label="Journal Publisher"
                value={formData.publisher?.name}
                onChange={handleChange}
                name="publisher"
                InfoTooltip={
                  <InfoTooltip message="Enter the name of the organization or company that published the article. This is typically found on the first or last page of the article, or in the citation details. Common examples include academic publishers like Elsevier, Springer, Wiley, or university presses." />
                }
                isSpecialAction={isSpecialAction} // Pass isSpecialAction
                status={formData.publisher?.status} // Pass status
                onStatusChange={handleStatusChange} // Pass status change handler
              />

              {/* Impact Factor */}
              <Input
                label="Impact Factor"
                value={formData.impactFactor?.name}
                onChange={handleChange}
                name="impactFactor"
                InfoTooltip={
                  <InfoTooltip message="Enter the Impact Factor of the Journal, preferably the 5-year Impact Factor if available. (This can be found by searching the internet via a search engine)" />
                }
                isSpecialAction={isSpecialAction} // Pass isSpecialAction
                status={formData.impactFactor?.status} // Pass status
                onStatusChange={handleStatusChange} // Pass status change handler
              />

              {/* H-Index */}
              <Input
                label="H-Index"
                value={formData.HIndex?.name}
                onChange={handleChange}
                name="HIndex"
                InfoTooltip={
                  <InfoTooltip message="You can find the H-Index by looking up the researcher or journal on platforms like SCImago, Scopus, or Web of Science. These databases provide the H-Index based on citation data." />
                }
                isSpecialAction={isSpecialAction} // Pass isSpecialAction
                status={formData.HIndex?.status} // Pass status
                onStatusChange={handleStatusChange} // Pass status change handler
              />

              {/* SCImago */}
              <Input
                label="SCImago"
                value={formData.sciMAGO?.name}
                onChange={handleChange}
                name="sciMAGO"
                InfoTooltip={
                  <InfoTooltip message="Enter the SCImago rating from the SCImago website." />
                }
                isSpecialAction={isSpecialAction} // Pass isSpecialAction
                status={formData.sciMAGO?.status} // Pass status
                onStatusChange={handleStatusChange} // Pass status change handler
              />

              {/* Volume */}
              <Input
                label="Volume"
                value={formData.volume?.name}
                onChange={handleChange}
                name="volume"
                InfoTooltip={
                  <InfoTooltip message="Enter the volume of the Journal the article was published in." />
                }
                error={validationErrors.volume}
                onBlur={(e) => validateField(e.target.name, e.target.value)}
                isSpecialAction={isSpecialAction} // Pass isSpecialAction
                status={formData.volume?.status} // Pass status
                onStatusChange={handleStatusChange} // Pass status change handler
              />

              {/* Issue */}
              <Input
                label="Issue"
                value={formData.issue?.name}
                onChange={handleChange}
                name="issue"
                type="number"
                isSpecialAction={isSpecialAction} // Pass isSpecialAction
                status={formData.issue?.status} // Pass status
                onStatusChange={handleStatusChange} // Pass status change handler
                InfoTooltip={
                  <InfoTooltip message="Enter the issue, if applicable, of the journal the article was published in." />
                }
              />

              {/* Pages */}
              <Input
                label="Pages"
                value={formData.pages?.name}
                onChange={handleChange}
                name="pages"
                InfoTooltip={
                  <InfoTooltip message="Enter the pages of the journal the article was published in." />
                }
                error={validationErrors.pages}
                onBlur={(e) => validateField(e.target.name, e.target.value)}
                isSpecialAction={isSpecialAction} // Pass isSpecialAction
                status={formData.pages?.status} // Pass status
                onStatusChange={handleStatusChange} // Pass status change handler
              />

              {/* Publication Type */}
              <div className="hidden">
                <Input
                  label="Publication Type"
                  value={formData.publicationType?.name}
                  onChange={handleChange}
                  name="publicationType"
                  isSpecialAction={isSpecialAction} // Pass isSpecialAction
                  status={formData.publicationType?.status} // Pass status
                  onStatusChange={handleStatusChange} // Pass status change handler
                />
              </div>
            </Accordion>

            {/* Others */}
            <Accordion
              title="Other"
              isOpen={isOther}
              onToggle={() => setIsOther((prev) => !prev)}
            >
              {/* Countries Involved in the Study (Heading II) */}
              <div className="border border-gray-300 rounded-lg shadow-sm mb-4">
                <button
                  type="button"
                  onClick={() => setIsCountryInfoOpen((prev) => !prev)}
                  className="w-full text-left px-4 py-2 flex justify-between items-center bg-blue-100 rounded-t-lg hover:bg-blue-200 focus:outline-none"
                  style={{ color: colorTheme.primary, fontWeight: "bold" }}
                >
                  <span>{"Countries Involved in the Study"}</span>
                  <span>{isCountryInfoOpen ? "-" : "+"}</span>
                </button>

                {isCountryInfoOpen && (
                  <div className=" px-4 py-2">
                    {/* Author Country */}
                    <CustomCreatableSelect
                      isMulti
                      isCreate={true}
                      label="Author Country"
                      // options={get_country_data?.countries?.map(type => type.name) || []}
                      options={options}
                      value={formData.country}
                      // value={formData.country?.map(item => ({ label: item.name, value: item.name }))}
                      onChange={handleChange}
                      handleAddSpecies={handleAddCountry}
                      name="country"
                      InfoTooltip={
                        <InfoTooltip message="List the countries of the author affiliations. May be more than one." />
                      }
                      error={
                        validationErrors.country &&
                        "Please Select Author Country."
                      }
                      isSpecialAction={isSpecialAction} // Pass isSpecialAction
                      // status={formData?.country[0]?.status} // Pass status
                      status={
                        Array.isArray(formData?.country) &&
                        formData.country.length > 0
                          ? formData.country[0].status
                          : undefined
                      }
                      onStatusChange={handleStatusChange} // Pass status change handler
                    />

                    {/* Grant Country */}
                    <CustomCreatableSelect
                      isCreate={true}
                      label="Grant Country"
                      // options={get_country_data?.countries?.map(type => type.name) || []}
                      options={options}
                      value={formData.grantCountry}
                      onChange={handleChange}
                      handleAddSpecies={handleAddGrantCountry}
                      name="grantCountry"
                      InfoTooltip={
                        <InfoTooltip message="List the country that awarded the grant if available. " />
                      }
                      isSpecialAction={isSpecialAction} // Pass isSpecialAction
                      status={formData.grantCountry?.status} // Pass status
                      onStatusChange={handleStatusChange} // Pass status change handler
                    />

                    {/* Research Country */}
                    <CustomCreatableSelect
                      isMulti
                      isCreate={true}
                      label="Research Country"
                      options={researchCountryOptions}
                      value={formData.researchCountry}
                      onChange={handleChange}
                      handleAddSpecies={handleAddResearchCountry}
                      name="researchCountry"
                      InfoTooltip={
                        <InfoTooltip message="List the country where the research/study was conducted as described in the methods section. Only in the case of non-research articles, such as reviews, list the countries of the author affiliations. " />
                      }
                      isSpecialAction={isSpecialAction}
                      status={
                        Array.isArray(formData?.researchCountry) &&
                        formData.researchCountry.length > 0
                          ? formData.researchCountry[0].status
                          : undefined
                      }
                      onStatusChange={handleStatusChange} // Pass status change handler
                    />
                  </div>
                )}
              </div>

              {/* Keywords */}
              <Input
                label="Keywords (optional)"
                value={formData?.keywords?.name}
                onChange={handleChange}
                name="keywords"
                isSpecialAction={isSpecialAction} // Pass isSpecialAction
                status={formData.keywords?.status} // Pass status
                onStatusChange={handleStatusChange} // Pass status change handler
              />

              {/* ISSN */}
              <div className="hidden">
                <Input
                  label="ISSN"
                  value={formData.issn?.name}
                  onChange={handleChange}
                  name="issn"
                  isSpecialAction={isSpecialAction} // Pass isSpecialAction
                  status={formData.issn?.status} // Pass status
                  onStatusChange={handleStatusChange} // Pass status change handler
                />
              </div>

              {/* Cited By Count */}
              <div className="hidden">
                <Input
                  label="Cited By Count"
                  value={formData.citedByCount?.name}
                  onChange={handleChange}
                  name="citedByCount"
                  type="number"
                  isSpecialAction={isSpecialAction} // Pass isSpecialAction
                  status={formData.citedByCount?.status} // Pass status
                  onStatusChange={handleStatusChange} // Pass status change handler
                />
              </div>
            </Accordion>

            {/* Confirmation Modal */}
            {isConfirmationModalVisible && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
                <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 mx-4 md:mx-0 animate-fadeIn">
                  {/* Header with warning icon */}
                  <div className="flex items-center mb-4 border-b pb-3">
                    <svg
                      className="h-6 w-6 text-[#004c78] mr-2"
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
                    <h2 className="text-xl font-semibold text-gray-800">
                      Incomplete Information
                    </h2>
                  </div>

                  {/* Main content */}
                  <div className="mb-6">
                    <div className="bg-blue-50 border-l-4 border-[#004c78] p-4 mb-4">
                      <p className="text-sm text-gray-700">
                        Some fields are missing. Are you sure you want to
                        proceed without filling them?
                      </p>
                    </div>

                    {/* List Missing Fields */}
                    {missingFields.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                          Missing fields:
                        </h3>
                        <div className="bg-gray-50 rounded-md p-3 max-h-40 overflow-y-auto">
                          <ul className="space-y-1">
                            {missingFields.map((field, index) => (
                              <li
                                key={index}
                                className="flex items-center text-gray-600 text-sm"
                              >
                                <svg
                              className="h-4 w-4 text-[#004c78] mr-2 mt-0.5 flex-shrink-0"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                                <span>
                                  {field === "HIndex"
                                    ? "H-Index"
                                    : fieldNameMappings[field] ||
                                      field.replace(/([A-Z])/g, " $1")}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end space-x-3 mt-6 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => setIsConfirmationModalVisible(false)}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-all font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmSubmit}
                      className="bg-[#004c78] hover:bg-[#003b5c] text-white px-4 py-2 rounded-md transition-all font-medium"
                    >
                      Yes, Proceed
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Add this animation to your global CSS if not already added */}
            <style jsx>{`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: scale(0.95);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
              .animate-fadeIn {
                animation: fadeIn 0.2s ease-out forwards;
              }
            `}</style>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleDraftSave}
                style={{ backgroundColor: colorTheme.primary }}
                className="text-white py-2 px-4 rounded hover:bg-[#004c78]"
              >
                {add_article_status === asyncStatus.LOADING
                  ? "Loading..."
                  : "Save as Draft"}
              </button>
              <button
                onClick={handleSubmit}
                // type="submit"
                style={{ backgroundColor: colorTheme.primary }}
                className="text-white py-2 px-4 rounded hover:bg-[#004c78]"
              >
                Next
              </button>
            </div>
          </form>
        </>
      </div>
      {/* {showKeywordWarningModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-50">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 mx-4 md:mx-0">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Missing Molecular Hydrogen Keywords
            </h2>
            <p className="text-gray-600 mb-4">
              This article doesn't appear to contain any Hydrogen Molecular
              Therapy keywords in the title or abstract. Please verify that this
              article is related to molecular hydrogen research.
            </p>
            <p className="text-gray-600 mb-6">
              Expected keywords: hydrogen, molecular hydrogen, H2 therapy, etc.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowKeywordWarningModal(false);

                  // Handle differently based on which action triggered the modal
                  if (actionType === "draft") {
                    // For draft, proceed with draft submission
                    setIsDraft(true);
                    onDraftSubmit(formData);
                  } else if (actionType === "submit") {
                    // For regular submit, continue with the normal validation flow
                    continueSubmitFlow();
                  }

                  // Reset the action type
                  setActionType(null);
                }}
                className="bg-[#004c78] hover:bg-[#004c78] text-white font-medium py-2 px-4 rounded-md transition duration-150"
              >
                Proceed Anyway
              </button>
              <button
                onClick={() => {
                  setShowKeywordWarningModal(false);
                  setActionType(null); // Reset action type if user cancels
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-150"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )} */}
      {showKeywordWarningModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 mx-4 md:mx-0 animate-fadeIn">
            {/* Header with warning icon */}
            <div className="flex items-center mb-4 border-b pb-3">
              <svg
                className="h-6 w-6 text-amber-500 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-800">
                Missing Molecular Hydrogen Keywords
              </h2>
            </div>

            {/* Main content */}
            <div className="mb-6">
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
                <p className="text-sm text-amber-700">
                  This article doesn't appear to contain any Hydrogen Molecular
                  Therapy keywords in the title or abstract. Please verify that
                  this article is related to molecular hydrogen research.
                </p>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Expected keywords:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {primaryKeywords && primaryKeywords.length > 0 ? (
                    primaryKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))
                  ) : (
                    <>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        hydrogen
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        molecular hydrogen
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        H2 therapy
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        hydrogen gas
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 mt-6 pt-3 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowKeywordWarningModal(false);
                  setActionType(null); // Reset action type if user cancels
                }}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-all font-medium"
              >
                Go Back
              </button>
              <button
                onClick={() => {
                  setShowKeywordWarningModal(false);

                  // Handle differently based on which action triggered the modal
                  if (actionType === "draft") {
                    // For draft, proceed with draft submission
                    setIsDraft(true);
                    onDraftSubmit(formData);
                  } else if (actionType === "submit") {
                    // For regular submit, continue with the normal validation flow
                    continueSubmitFlow();
                  }

                  // Reset the action type
                  setActionType(null);
                }}
                className="bg-[#004c78] text-white px-4 py-2 rounded-md hover:bg-[#004c78] transition-all font-medium"
              >
                Proceed Anyway
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add this animation to your global CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
      {showPdfActionModal && (
        <PdfActionModal
          onClose={() => {
            setShowPdfActionModal(false);
            // Remove the file from the queue
            setFileQueue((prev) => prev.slice(1));
            setPendingFile(null);
          }}
          onUploadOnly={handleUploadOnly}
          onScrapeAndUpload={handleScrapeAndUpload}
        />
      )}
    </div>
  );
};

export default PublicDataForm;
