import BulkUploadModal from "../Modal/BulkUploadModal";
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { FaEye, FaEdit, FaTrash, FaFlag, FaFilePdf, FaHistory } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { colorTheme } from '../../Utils/colortheme';
import { Oval } from 'react-loader-spinner';
import { apiHandle } from '../../Config/ApiHandle/apiHandle';
import { useDispatch, useSelector } from 'react-redux';
import { setShowBulkProgress, setBulkProgress, resetBulkProgress } from '../../Store/slices/bulk_upload_slice';
import { bulkUploadFilesThunk } from '../../Store/slices/bulk_upload_thunks';
import { resetAddArticleData, setArticleIdleStatus } from '../../Store/slices/Article_slice';
import { asyncStatus } from '../../Utils/asyncStatus';
import { check_auth } from '../../Services/authentication';
import GlobalBulkUploadProgress from "../GlobalBulkUploadProgress";

import { clearLog, setShowLogModal } from "../../Store/slices/bulk_upload_log_slice";

const ArticlesOverviewTable = () => {
    // Bulk upload modal state
    const [bulkModalOpen, setBulkModalOpen] = useState(false);
    const [bulkFiles, setBulkFiles] = useState([]);
    const [bulkUploading, setBulkUploading] = useState(false);
    // Use Redux for global progress
    const showBulkProgress = useSelector(state => state.bulkUpload.showBulkProgress);
    const bulkProgress = useSelector(state => state.bulkUpload.bulkProgress);
    const bulkProgressInterval = useRef(null);
    const [bulkError, setBulkError] = useState(null);
    
    // Revision history modal state
    const [revisionModalOpen, setRevisionModalOpen] = useState(false);
    const [selectedArticleRevisions, setSelectedArticleRevisions] = useState([]);
    const [selectedRevisionDetail, setSelectedRevisionDetail] = useState(null);
    const [revisionDetailModalOpen, setRevisionDetailModalOpen] = useState(false);
    const handleBulkFileChange = (e) => {
        setBulkError(null);
        let files = Array.from(e.target.files);
        // Only allow PDFs
        const nonPdf = files.find(f => f.type !== 'application/pdf');
        if (nonPdf) {
            setBulkError('Only PDF files are allowed.');
            return;
        }
        // Limit to 20 files
        if (files.length > 20) {
            setBulkError('You can upload a maximum of 20 PDF files at a time.');
            files = files.slice(0, 20);
        }
        setBulkFiles(files);
    };

    // Remove a file from the bulkFiles array
    const handleRemoveBulkFile = (idx) => {
        setBulkFiles((prev) => prev.filter((_, i) => i !== idx));
    };
    // Redux thunk for bulk upload
    // Place this thunk in your bulk_upload_slice.js or a new file, then import it here
    // Example usage below:

    const handleBulkUpload = async () => {
        if (!bulkFiles.length) return;
        setBulkUploading(true);
        setBulkError(null);
        dispatch(clearLog()); // Clear previous logs before uploading
        dispatch(setShowBulkProgress(true));
        dispatch(setBulkProgress(0));
        setBulkModalOpen(false); // Close modal immediately

        // Dispatch the thunk action for bulk upload
        try {
            await dispatch(bulkUploadFilesThunk({
                files: bulkFiles,
                onError: (msg) => setBulkError(msg),
                onComplete: () => {
                    setBulkFiles([]);
                    fetchArticles(currentPage);
                    setBulkUploading(false);
                    setTimeout(() => {
                        dispatch(resetBulkProgress());
                        window.__bulkProgress = 0;
                        dispatch(setShowLogModal(true)); // Show log modal automatically
                    }, 1000);
                }
            }));
        } catch (err) {
            setBulkUploading(false);
            setBulkError('Bulk upload failed.');
        }
    };
    // ...existing code...


    console.log("ArticlesOverviewTable rendered");
    console.log("bulk files", bulkFiles);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { get_article_data, get_article_status, delete_article_status, update_article_status_status, add_article_status, add_article_data } = useSelector((state) => state.article);



    const encodedRole = localStorage.getItem('rl');
    const role = encodedRole ? atob(encodedRole) : null;

    const headers = ['Article Title', 'Authors', 'Country'];
    if (role && role !== 'User') {
        headers.push('Status');
    }
    headers.push('Assigned to');
    headers.push('Actions');



    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalArticles, setTotalArticles] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(25);

    // Load search term from localStorage on initial render
    const [searchTerm, setSearchTerm] = useState(() => {
        const savedSearch = localStorage.getItem('articleSearchTerm');
        return savedSearch || '';
    });

    const [activeTab, setActiveTab] = useState('All');
    const [keywordFilter, setKeywordFilter] = useState('All'); // New state for keyword filtering
    const [trendingFilter, setTrendingFilter] = useState('All'); // Trending filter: 'All', 'Trending', 'Not Trending'
    const [assignmentFilter, setAssignmentFilter] = useState('All'); // New state for assignment filtering

    // Load debounced search term from localStorage as well
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(() => {
        const savedSearch = localStorage.getItem('articleSearchTerm');
        return savedSearch || '';
    });

    // Save search term to localStorage whenever it changes
    useEffect(() => {
        if (debouncedSearchTerm) {
            localStorage.setItem('articleSearchTerm', debouncedSearchTerm);
        } else {
            localStorage.removeItem('articleSearchTerm');
        }
    }, [debouncedSearchTerm]);

    // Fetch articles from API
    const fetchArticles = async (page = 1) => {
        try {
            // Extract author from URL parameters
            const searchParams = new URLSearchParams(location.search);
            const authorFromURL = searchParams.get('author') || '';

            setLoading(true);
            setError(null);
            const combinedSearch = [debouncedSearchTerm, authorFromURL]
                .filter(term => term.trim()) // Remove empty terms
                .join(' '); // Join with space
            
            // Determine API endpoint and request type based on role
            const isResearcher = role === 'Researcher';
            const apiEndpoint = isResearcher ? "get-researcher-articles" : "final-article-list-admin";
            const reqType = isResearcher ? 'researcher' : 'admin';
            
            const requestBody = {
                per_page: entriesPerPage,
                page: page,
                status: activeTab !== 'All' ? activeTab : undefined,
                admin_search: combinedSearch || undefined,
                reqType: reqType,
                genericKeywords: keywordFilter !== 'All' ? keywordFilter === 'With Keywords' : undefined, // Add genericKeywords filter
                trending: trendingFilter === 'All' ? undefined : trendingFilter === 'Trending' ? true : false,
                assignment: assignmentFilter === 'Assigned' ? true : assignmentFilter === 'Unassigned' ? false : undefined, // Send true/false
            };

            const response = await apiHandle.post(apiEndpoint, requestBody);

            if (response.data && response.data.articles) {
                setArticles(response.data.articles);
                setTotalArticles(response.data.total);
                setCurrentPage(response.data.current_page);
            }

        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles(currentPage);
    }, [currentPage, entriesPerPage, activeTab, keywordFilter, trendingFilter, assignmentFilter, debouncedSearchTerm, location.search]);

    // Pagination handlers
    const paginate = (pageNumber) => {
        if (pageNumber !== currentPage) {
            setCurrentPage(pageNumber);
        }
    };

    useEffect(() => {
        if (add_article_status === asyncStatus.SUCCEEDED) {
            dispatch(setArticleIdleStatus());
        }
    }, [add_article_status])

    const handleEntriesPerPageChange = (e) => {
        const value = e.target.value;
        setEntriesPerPage(value === "all" ? 1000000 : Number(value));
        setCurrentPage(1);
    };

    // Action handlers
    const handlePreview = (entry) => {
        // Save current search state before navigating
        if (searchTerm) {
            localStorage.setItem('articleSearchTerm', searchTerm);
        }
        navigate(`/article-preview/${entry.mhid}`);
    };

    const handleEdit = (entry) => {
        // Save current search state before navigating
        if (searchTerm) {
            localStorage.setItem('articleSearchTerm', searchTerm);
        }
        navigate("/main-form", { state: { articleToEdit: entry } });
    };

    const handleSpecialAction = (entry) => {
        // Save current search state before navigating
        if (searchTerm) {
            localStorage.setItem('articleSearchTerm', searchTerm);
        }
        navigate("/main-form", { state: { articleToEdit: entry, isSpecialAction: true } });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this article?")) {
            try {
                await apiHandle.post(`article-delete/${id}`)
                fetchArticles(currentPage); // Refresh data
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            console.log("running");
            await apiHandle.post(`update-status/${id}`, { status: newStatus });
            fetchArticles(currentPage);
        } catch (err) {
            setError(err.message);
        }
    };

    // Handle revision history
    const handleShowRevisions = (article) => {
        setSelectedArticleRevisions(article.revisions || []);
        setRevisionModalOpen(true);
    };

    const handleShowRevisionDetail = (revision) => {
        setSelectedRevisionDetail(revision);
        setRevisionDetailModalOpen(true);
    };

    const formatFieldName = (fieldName) => {
        // Section name mappings
        const sectionMappings = {
            'publicData': 'Article Citation Information',
            'articleGeneralData': 'Article General Data', 
            'researcherData': 'Article Specific Information',
            'biomaker': 'Biomarker Data'
        };

        // Field name mappings for common fields
        const fieldMappings = {
            // Public Data fields
            'title': 'Article Title',
            'authors': 'Authors',
            'doi': 'DOI',
            'pmid': 'PMID',
            'journal': 'Journal',
            'publication_date': 'Publication Date',
            'pdf_url': 'PDF URL',
            'country': 'Country',
            'keywords': 'Keywords',
            'abstract': 'Abstract',
            'year': 'Publication Year',
            'grantCountry': 'Grant Country',
            'researchCountry': 'Research Country',
            
            // Article General Data fields
            'studyType': 'Study Type',
            'speciesDetails': 'Species Details',
            'animalModel': 'Animal Model',
            'cellLine': 'Cell Line',
            'tissueType': 'Tissue Type',
            'exposureMethod': 'Exposure Method',
            'concentrationDetails': 'Concentration Details',
            'durationDetails': 'Duration Details',
            'species': 'Species',
            'researchtopic': 'Research Topic',
            'diseaseModel': 'Disease Model',
            'system': 'System',
            'organ': 'Organ',
            'outcomeType': 'Outcome Type',
            'HighlightArticle': 'Highlight Article',
            'descHighArt': 'Highlight Description',
            
            // Species-specific fields
            'isOpen': 'Is Open',
            'HowManyConcentrations': 'How Many Concentrations',
            'volumes': 'Volumes',
            'concentrations': 'Concentrations',
            'absoluteDoses': 'Absolute Doses',
            'relativeDoses': 'Relative Doses',
            'inhalationConcentrations': 'Inhalation Concentrations',
            'wasOxyhydrogenUsed': 'Was Oxyhydrogen Used',
            'isInhalationOpen': 'Is Inhalation Open',
            'isCellTissueOpen': 'Is Cell Tissue Open',
            'isIngestionOpen': 'Is Ingestion Open',
            'methods': 'Methods',
            'weight': 'Weight',
            'percentPurity': 'Percent Purity',
            'flowRate': 'Flow Rate',
            'estimatedFiH2': 'Estimated FiH2',
            'frequency': 'Frequency',
            'duration': 'Duration',
            'deliveryMethod': 'Delivery Method',
            'numInhalationConcentrations': 'Number of Inhalation Concentrations',
            'value': 'Value',
            'subjects': 'Subjects',
            'health': 'Health Status',
            'gender': 'Gender',
            'averageAge': 'Average Age',
            'averageWeight': 'Average Weight',
            'DescribeSpecies': 'Species Description',
            'concentrationOfHydrogenForMedium': 'Hydrogen Concentration for Medium',
            'FrequencyCellCultureTissues': 'Cell Culture Frequency',
            'DurationFrequencyCellCultureTissues': 'Cell Culture Duration',
            
            // Researcher Data fields
            'researcherName': 'Researcher Name',
            'institution': 'Institution',
            'email': 'Email',
            'contactDetails': 'Contact Details',
            'fundingSource': 'Funding Source',
            'ethicsApproval': 'Ethics Approval',
            'speciesData': 'Species Data',
            'CompMethodAdmin': 'Comparison Method Administration',
            'CompMethodAdminDesc': 'Comparison Method Description',
            'doseComparison': 'Dose Comparison',
            'doseComparisonDesc': 'Dose Comparison Description',
            'drugComparison': 'Drug Comparison',
            'comparisonDetail': 'Comparison Details',
            'pharmacokinetics': 'Pharmacokinetics',
            'pharmacokineticsDescription': 'Pharmacokinetics Description',
            'isERW': 'Is ERW',
            'ph': 'pH',
            'erwCompared': 'ERW Compared',
            'adverseEffects': 'Adverse Effects',
            'adverseEffectsDescription': 'Adverse Effects Description',
            'doseDependentEffect': 'Dose Dependent Effect',
            'safetyProfile': 'Safety Profile',
            'safetyofhydrogen': 'Safety of Hydrogen',
            'sexDifference': 'Sex Difference',
            'responderDifference': 'Responder Difference',
            'pregnantBreastfeeding': 'Pregnant/Breastfeeding',
            'mechanisticInsights': 'Mechanistic Insights',
            'Video_WebpageLink': 'Video/Webpage Link',
            'PasteUrl': 'URL',
            'commercialProduct': 'Commercial Product',
            'brandName': 'Brand Name',
            'geneExpression': 'Gene Expression',
            'geneExpressionDesc': 'Gene Expression Description',
            
            // Biomarker fields
            'biomarkerType': 'Biomarker Type',
            'detectionMethod': 'Detection Method',
            'sampleType': 'Sample Type',
            'analysisMethod': 'Analysis Method',
            'results': 'Results',
            'significance': 'Statistical Significance',
            'marker': 'Marker',
            'category': 'Category',
            'Change': 'Change',
            'Protein': 'Protein',
            'status': 'Status',
            
            // Special nested object fields
            'statusConcentration': 'Status Concentration',
            'name': 'Name',
            'unit': 'Unit'
        };

        // Check if it's a section name first
        if (sectionMappings[fieldName]) {
            return sectionMappings[fieldName];
        }

        // Check if it's a known field name
        if (fieldMappings[fieldName]) {
            return fieldMappings[fieldName];
        }

        // Default formatting: convert camelCase to Title Case
        return fieldName
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    };

    // Global helper function to safely extract display value from nested objects
    const getDisplayValue = (obj) => {
        if (obj === null || obj === undefined) return 'Not specified';
        if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
            return String(obj);
        }
        if (typeof obj === 'object' && !Array.isArray(obj)) {
            // Handle deeply nested structures like { name: { name: "value", status: "Unverified" } } with null safety
            if (obj.hasOwnProperty('name') && typeof obj.name === 'object' && obj.name !== null && obj.name.hasOwnProperty('name')) {
                return String(obj.name.name) || 'Not specified';
            }
            // Handle regular { name: "value", status: "Unverified" } structure
            if (obj.hasOwnProperty('name') && obj.hasOwnProperty('status')) {
                return String(obj.name) || 'Not specified';
            }
            // Handle value/unit structures
            if (obj.hasOwnProperty('value') && obj.hasOwnProperty('unit')) {
                const value = obj.value !== null && obj.value !== undefined ? String(obj.value) : '';
                const unit = obj.unit ? ` ${String(obj.unit)}` : '';
                return value + unit || 'Not specified';
            }
            if (obj.hasOwnProperty('value')) {
                return String(obj.value) || 'Not specified';
            }
            // Handle special cases that might be causing [object Object]
            if (obj.hasOwnProperty('name') && typeof obj.name === 'string') {
                return String(obj.name) || 'Not specified';
            }
            // Fallback to first available property that's not an object
            const keys = Object.keys(obj);
            for (const key of keys) {
                const value = obj[key];
                if (value !== null && value !== undefined && (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')) {
                    return String(value) || 'Not specified';
                }
            }
            // If all values are objects, try to extract from the first one with null safety
            if (keys.length > 0) {
                const firstValue = obj[keys[0]];
                if (typeof firstValue === 'object' && firstValue !== null) {
                    return getDisplayValue(firstValue); // Recursive call for nested objects
                }
                return String(firstValue) || 'Not specified';
            }
        }
        return String(obj);
    };

    // Global helper function to safely extract status from nested objects
    const getStatusValue = (obj) => {
        if (obj === null || obj === undefined) return null;
        if (typeof obj === 'object' && !Array.isArray(obj)) {
            // Handle deeply nested structures like { name: { name: "value", status: "Unverified" } } with null safety
            if (obj.hasOwnProperty('name') && typeof obj.name === 'object' && obj.name !== null && obj.name.hasOwnProperty('status')) {
                return obj.name.status;
            }
            // Handle regular structure { name: "value", status: "Unverified" }
            if (obj.hasOwnProperty('status')) {
                // If status itself is an object like { name: "Unverified", status: "Unverified" } with null safety
                if (typeof obj.status === 'object' && obj.status !== null && obj.status.hasOwnProperty('name')) {
                    return obj.status.name;
                }
                return obj.status;
            }
            // Handle value/unit structures with status
            if (obj.hasOwnProperty('value') && obj.hasOwnProperty('status')) {
                if (typeof obj.status === 'object' && obj.status !== null && obj.status.hasOwnProperty('name')) {
                    return obj.status.name;
                }
                return obj.status;
            }
            // Handle special statusConcentration field
            if (obj.hasOwnProperty('statusConcentration')) {
                return obj.statusConcentration;
            }
        }
        return null;
    };

    // Helper function to create a smart diff for any nested object structure
    const createSmartDiff = (fromValue, toValue) => {
        const changes = {
            added: {},
            removed: {},
            modified: {}
        };

        // Handle null/undefined cases
        if (!fromValue && !toValue) return null;
        
        // Special handling for simple name/status objects being added/removed
        if (!fromValue && toValue) {
            // If toValue is a simple name/status object, treat it as a single unit
            if (typeof toValue === 'object' && toValue !== null && !Array.isArray(toValue) &&
                Object.keys(toValue).length <= 2 && 
                (toValue.hasOwnProperty('name') || toValue.hasOwnProperty('status'))) {
                return { added: { '_singleObject': toValue }, removed: {}, modified: {} };
            }
            return { added: toValue, removed: {}, modified: {} };
        }
        
        if (fromValue && !toValue) {
            // If fromValue is a simple name/status object, treat it as a single unit  
            if (typeof fromValue === 'object' && fromValue !== null && !Array.isArray(fromValue) &&
                Object.keys(fromValue).length <= 2 && 
                (fromValue.hasOwnProperty('name') || fromValue.hasOwnProperty('status'))) {
                return { added: {}, removed: { '_singleObject': fromValue }, modified: {} };
            }
            return { added: {}, removed: fromValue, modified: {} };
        }

        // For non-objects, direct comparison
        if (typeof fromValue !== 'object' || typeof toValue !== 'object') {
            if (JSON.stringify(fromValue) !== JSON.stringify(toValue)) {
                return { added: {}, removed: {}, modified: { value: { from: fromValue, to: toValue } } };
            }
            return null;
        }

        const fromKeys = Object.keys(fromValue || {});
        const toKeys = Object.keys(toValue || {});
        
        // Find added keys (exist in 'to' but not in 'from')
        toKeys.forEach(key => {
            if (!fromKeys.includes(key)) {
                changes.added[key] = toValue[key];
            }
        });

        // Find removed keys (exist in 'from' but not in 'to')
        fromKeys.forEach(key => {
            if (!toKeys.includes(key)) {
                changes.removed[key] = fromValue[key];
            }
        });

        // Find modified keys (exist in both but with different values)
        fromKeys.forEach(key => {
            if (toKeys.includes(key)) {
                const fromVal = fromValue[key];
                const toVal = toValue[key];
                
                // Deep comparison for nested objects
                if (typeof fromVal === 'object' && typeof toVal === 'object' && fromVal !== null && toVal !== null) {
                    const nestedDiff = createSmartDiff(fromVal, toVal);
                    if (nestedDiff && (Object.keys(nestedDiff.added).length > 0 || 
                                     Object.keys(nestedDiff.removed).length > 0 || 
                                     Object.keys(nestedDiff.modified).length > 0)) {
                        changes.modified[key] = nestedDiff;
                    }
                } else if (JSON.stringify(fromVal) !== JSON.stringify(toVal)) {
                    changes.modified[key] = { from: fromVal, to: toVal };
                }
            }
        });

        // Return null if no changes found
        if (Object.keys(changes.added).length === 0 && 
            Object.keys(changes.removed).length === 0 && 
            Object.keys(changes.modified).length === 0) {
            return null;
        }

        return changes;
    };

    // Enhanced render function for smart diff display
    const renderSmartDiff = (diff, isFromValue = true) => {
        if (!diff) return <span className="text-gray-400 italic">No changes</span>;

        const { added, removed, modified } = diff;
        const hasChanges = Object.keys(added).length > 0 || Object.keys(removed).length > 0 || Object.keys(modified).length > 0;
        
        if (!hasChanges) return <span className="text-gray-400 italic">No changes</span>;

        return (
            <div className="space-y-3">
                {/* Show added items (only in "New Value" column) */}
                {!isFromValue && Object.keys(added).length > 0 && (
                    <div className="space-y-2">
                        {Object.entries(added).map(([key, value]) => {
                            // Handle special single object case
                            if (key === '_singleObject') {
                                return (
                                    <div key={`added-single`} className="bg-green-50 border border-green-200 p-3 rounded-lg">
                                        <div className="flex items-center mb-2">
                                            <span className="text-green-600 text-xs font-medium bg-green-100 px-2 py-1 rounded mr-2">ADDED</span>
                                            <span className="font-medium text-green-800">Value</span>
                                        </div>
                                        <div className="ml-4">
                                            {renderChangeValue(value)}
                                        </div>
                                    </div>
                                );
                            }
                            
                            return (
                                <div key={`added-${key}`} className="bg-green-50 border border-green-200 p-3 rounded-lg">
                                    <div className="flex items-center mb-2">
                                        <span className="text-green-600 text-xs font-medium bg-green-100 px-2 py-1 rounded mr-2">ADDED</span>
                                        <span className="font-medium text-green-800">{formatFieldName(key)}</span>
                                    </div>
                                    <div className="ml-4">
                                        {typeof value === 'object' && value !== null && !Array.isArray(value) && 
                                         Object.keys(value).length > 2 && 
                                         Object.values(value).some(v => typeof v === 'object' && v !== null) ? (
                                            // Handle complex nested objects with multiple fields (like Dogs with name, status, DescribeSpecies, subjects)
                                            // Only break apart if it has MORE than 2 keys AND contains nested objects
                                            <div className="space-y-2 bg-white p-3 rounded border">
                                                {Object.entries(value).map(([fieldKey, fieldValue]) => (
                                                    <div key={fieldKey} className="text-sm">
                                                        <div className="font-medium text-gray-700 mb-1">{formatFieldName(fieldKey)}:</div>
                                                        <div className="ml-3 pl-3 border-l-2 border-green-200">
                                                            {renderChangeValue(fieldValue)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            // Handle simple values or simple name/status objects
                                            renderChangeValue(value)
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Show removed items (only in "Previous Value" column) */}
                {isFromValue && Object.keys(removed).length > 0 && (
                    <div className="space-y-2">
                        {Object.entries(removed).map(([key, value]) => {
                            // Special handling for _singleObject case
                            if (key === '_singleObject') {
                                return (
                                    <div key="single-object-removed" className="bg-red-50 border border-red-200 p-3 rounded-lg">
                                        <div className="flex items-center mb-2">
                                            <span className="text-red-600 text-xs font-medium bg-red-100 px-2 py-1 rounded mr-2">REMOVED</span>
                                        </div>
                                        <div className="ml-4">
                                            {renderChangeValue(value)}
                                        </div>
                                    </div>
                                );
                            }
                            
                            return (
                                <div key={`removed-${key}`} className="bg-red-50 border border-red-200 p-3 rounded-lg">
                                    <div className="flex items-center mb-2">
                                        <span className="text-red-600 text-xs font-medium bg-red-100 px-2 py-1 rounded mr-2">REMOVED</span>
                                        <span className="font-medium text-red-800">{formatFieldName(key)}</span>
                                    </div>
                                    <div className="ml-4">
                                    {typeof value === 'object' && value !== null && !Array.isArray(value) && 
                                     Object.keys(value).length > 2 && 
                                     Object.values(value).some(v => typeof v === 'object' && v !== null) ? (
                                        // Handle complex nested objects with multiple fields
                                        // Only break apart if it has MORE than 2 keys AND contains nested objects
                                        <div className="space-y-2 bg-white p-3 rounded border">
                                            {Object.entries(value).map(([fieldKey, fieldValue]) => (
                                                <div key={fieldKey} className="text-sm">
                                                    <div className="font-medium text-gray-700 mb-1">{formatFieldName(fieldKey)}:</div>
                                                    <div className="ml-3 pl-3 border-l-2 border-red-200">
                                                        {renderChangeValue(fieldValue)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        // Handle simple values or simple name/status objects
                                        renderChangeValue(value)
                                    )}
                                </div>
                            </div>
                            );
                        })}
                    </div>
                )}

                {/* Show modified items */}
                {Object.keys(modified).length > 0 && (
                    <div className="space-y-2">
                        {Object.entries(modified).map(([key, changeData]) => (
                            <div key={`modified-${key}`} className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                                <div className="flex items-center mb-2">
                                    <span className="text-blue-600 text-xs font-medium bg-blue-100 px-2 py-1 rounded mr-2">MODIFIED</span>
                                    <span className="font-medium text-blue-800">{formatFieldName(key)}</span>
                                </div>
                                <div className="ml-4">
                                    {changeData.from !== undefined && changeData.to !== undefined ? (
                                        // Simple value change
                                        <div className="space-y-2">
                                            <div className="bg-red-50 p-2 rounded">
                                                <span className="text-xs text-red-600 font-medium">Before: </span>
                                                {renderChangeValue(changeData.from)}
                                            </div>
                                            <div className="bg-green-50 p-2 rounded">
                                                <span className="text-xs text-green-600 font-medium">After: </span>
                                                {renderChangeValue(changeData.to)}
                                            </div>
                                        </div>
                                    ) : (
                                        // Nested object changes
                                        renderSmartDiff(changeData, isFromValue)
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderChangeValue = (value, compareValue = null, isFromValue = false) => {
        if (value === null || value === undefined) {
            return <span className="text-gray-400 italic">Not specified</span>;
        }

        // If we have a compare value, create a smart diff for dynamic object comparison
        if (compareValue !== null && typeof value === 'object' && value !== null && !Array.isArray(value)) {
            // Check if this looks like a complex object structure (any nested object with multiple keys)
            const keys = Object.keys(value);
            const looksLikeComplexObject = keys.length > 0 && keys.some(key => 
                typeof value[key] === 'object' && value[key] !== null
            );
            
            if (looksLikeComplexObject) {
                const diff = createSmartDiff(isFromValue ? value : compareValue, isFromValue ? compareValue : value);
                if (diff) {
                    return renderSmartDiff(diff, isFromValue);
                }
            }
        }
        
        // Handle the specific app structure: { name: "value", status: "Unverified" }
        if (typeof value === 'object' && value !== null && !Array.isArray(value) && value.hasOwnProperty('name') && value.hasOwnProperty('status')) {
            const displayValue = getDisplayValue(value);
            const statusValue = getStatusValue(value);
            
            if (!displayValue || displayValue === 'Empty' || displayValue === '' || displayValue === 'No value') {
                return <span className="text-gray-400 italic">Not specified</span>;
            }
            
            return (
                <div className="flex items-center space-x-2">
                    <span className="break-words">{displayValue}</span>
                    {statusValue && (
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                            statusValue === 'Verified' ? 'bg-green-100 text-green-700' : 
                            statusValue === 'Unverified' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                            {String(statusValue)}
                        </span>
                    )}
                </div>
            );
        }

        // Handle special structures with value and unit (like duration/frequency objects)
        if (typeof value === 'object' && value !== null && !Array.isArray(value) && 
            (value.hasOwnProperty('value') && value.hasOwnProperty('unit')) || 
            (value.hasOwnProperty('value') && value.hasOwnProperty('status'))) {
            const displayValue = value.value !== null && value.value !== undefined ? String(value.value) : 'Not specified';
            const unit = value.unit ? ` ${value.unit}` : '';
            const status = value.status;
            
            return (
                <div className="flex items-center space-x-2">
                    <span className="break-words">{displayValue}{unit}</span>
                    {status && (
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                            status === 'Verified' ? 'bg-green-100 text-green-700' : 
                            status === 'Unverified' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                            {status}
                        </span>
                    )}
                </div>
            );
        }

        // Handle biomarker arrays specially
        if (Array.isArray(value) && value.length > 0 && 
            value.every(item => typeof item === 'object' && item !== null && item.hasOwnProperty('marker'))) {
            return (
                <div className="space-y-2">
                    {value.map((biomarker, index) => (
                        <div key={index} className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                            <div className="font-medium text-blue-800 mb-2">
                                {String(biomarker.marker) || 'Unknown Marker'}
                            </div>
                            {biomarker.category && Array.isArray(biomarker.category) && (
                                <div className="mb-2">
                                    <span className="text-sm text-gray-600">Categories: </span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {biomarker.category.map((cat, catIndex) => (
                                            <span key={catIndex} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                                                {String(cat)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {biomarker.Change && Array.isArray(biomarker.Change) && biomarker.Change.length > 0 && (
                                <div className="mb-2">
                                    <span className="text-sm text-gray-600">Changes: </span>
                                    {biomarker.Change.map(change => String(change)).join(', ')}
                                </div>
                            )}
                            {biomarker.status && (
                                <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                                    biomarker.status === 'Verified' ? 'bg-green-100 text-green-700' : 
                                    biomarker.status === 'Unverified' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
                                }`}>
                                    {String(biomarker.status)}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            );
        }
        
        if (Array.isArray(value)) {
            if (value.length === 0) {
                return <span className="text-gray-400 italic">No items</span>;
            }
            return (
                <div className="space-y-1">
                    {value.map((item, index) => (
                        <div key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                            <div className="break-words">
                                {/* Handle app-specific structure in arrays with null safety */}
                                {typeof item === 'object' && item !== null && item.hasOwnProperty('name') && item.hasOwnProperty('status') ? (
                                    <div className="flex items-center space-x-2">
                                        <span>{getDisplayValue(item)}</span>
                                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                                            getStatusValue(item) === 'Verified' ? 'bg-green-100 text-green-700' : 
                                            getStatusValue(item) === 'Unverified' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {String(getStatusValue(item) || 'No status')}
                                        </span>
                                    </div>
                                ) : typeof item === 'object' && item !== null ? (
                                    // Handle other object types including complex concentration objects
                                    (() => {
                                        if (item.hasOwnProperty('percentPurity') || item.hasOwnProperty('flowRate') || item.hasOwnProperty('frequency')) {
                                            // Handle inhalation concentration objects
                                            const fields = [];
                                            ['percentPurity', 'flowRate', 'estimatedFiH2', 'frequency', 'duration'].forEach(field => {
                                                if (item[field] && typeof item[field] === 'object' && item[field] !== null && item[field].name !== null && item[field].name !== undefined) {
                                                    fields.push(`${formatFieldName(field)}: ${String(item[field].name)}`);
                                                } else if (item[field] && typeof item[field] !== 'object') {
                                                    fields.push(`${formatFieldName(field)}: ${String(item[field])}`);
                                                }
                                            });
                                            return fields.length > 0 ? fields.join(', ') : 'Concentration data';
                                        }
                                        // Handle nested objects with name/status/statusConcentration using global helper
                                        return getDisplayValue(item);
                                    })()
                                ) : (
                                    String(item)
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
        
        if (typeof value === 'object' && value !== null) {
            // Handle complex nested objects (like speciesDetails, speciesData)
            const entries = Object.entries(value).filter(([key, val]) => 
                val !== null && val !== undefined && val !== ''
            );
            
            if (entries.length === 0) {
                return <span className="text-gray-400 italic">No data</span>;
            }
            
            return (
                <div className="space-y-2 bg-gray-50 p-3 rounded border max-w-full">
                    {entries.slice(0, 10).map(([key, val]) => (
                        <div key={key} className="text-sm">
                            <div className="font-medium text-gray-700 mb-1">{formatFieldName(key)}:</div>
                            <div className="ml-3 pl-3 border-l-2 border-gray-200">
                                {/* Handle boolean values at nested level */}
                                {typeof val === 'boolean' ? (
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        val ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {val ? 'Yes' : 'No'}
                                    </span>
                                ) : typeof val === 'object' && val !== null && !Array.isArray(val) && val.hasOwnProperty('name') && val.hasOwnProperty('status') ? (
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-900 break-words">{getDisplayValue(val)}</span>
                                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                                            getStatusValue(val) === 'Verified' ? 'bg-green-100 text-green-700' : 
                                            getStatusValue(val) === 'Unverified' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {String(getStatusValue(val))}
                                        </span>
                                    </div>
                                ) : /* Handle special value/unit/status structures */
                                typeof val === 'object' && val !== null && !Array.isArray(val) && 
                                (val.hasOwnProperty('value') || val.hasOwnProperty('unit')) ? (
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-900 break-words">
                                            {getDisplayValue(val)}
                                        </span>
                                        {getStatusValue(val) && (
                                            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                                                getStatusValue(val) === 'Verified' ? 'bg-green-100 text-green-700' : 
                                                getStatusValue(val) === 'Unverified' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                                {String(getStatusValue(val))}
                                            </span>
                                        )}
                                    </div>
                                ) : typeof val === 'object' && val !== null ? (
                                    // For deeply nested objects, recursively render them
                                    <div className="bg-white p-2 rounded border text-xs max-h-32 overflow-y-auto">
                                        {renderChangeValue(val)}
                                    </div>
                                ) : Array.isArray(val) ? (
                                    // Handle arrays at nested level
                                    val.length === 0 ? (
                                        <span className="text-gray-400 italic text-xs">No items</span>
                                    ) : (
                                        <div className="space-y-1">
                                            {val.slice(0, 5).map((arrItem, arrIndex) => (
                                                <div key={arrIndex} className="flex items-start">
                                                    <span className="w-1.5 h-1.5 bg-blue-300 rounded-full mr-2 mt-1 flex-shrink-0"></span>
                                                    <span className="text-gray-900 break-words text-xs">
                                                        {typeof arrItem === 'string' ? arrItem : 
                                                         typeof arrItem === 'object' && arrItem !== null && arrItem.hasOwnProperty('name') && arrItem.hasOwnProperty('status') ? 
                                                            `${getDisplayValue(arrItem)} (${getStatusValue(arrItem) || 'No status'})` :
                                                         typeof arrItem === 'object' && arrItem !== null ? (
                                                            getDisplayValue(arrItem)
                                                         ) :
                                                            String(arrItem)
                                                        }
                                                    </span>
                                                </div>
                                            ))}
                                            {val.length > 5 && (
                                                <div className="text-xs text-gray-500 italic">
                                                    ... and {val.length - 5} more items
                                                </div>
                                            )}
                                        </div>
                                    )
                                ) : (
                                    <span className="text-gray-900 break-words text-xs">{String(val)}</span>
                                )}
                            </div>
                        </div>
                    ))}
                    {entries.length > 10 && (
                        <div className="text-xs text-gray-500 italic mt-2 pt-2 border-t border-gray-200">
                            ... and {entries.length - 10} more field{entries.length - 10 !== 1 ? 's' : ''}
                        </div>
                    )}
                </div>
            );
        }
        
        // Handle boolean values
        if (typeof value === 'boolean') {
            return (
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                    value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {value ? 'Yes' : 'No'}
                </span>
            );
        }
        
        // Handle strings and numbers
        const stringValue = String(value);
        if (stringValue.length > 150) {
            return (
                <div className="space-y-2">
                    <span className="break-words">{stringValue.substring(0, 150)}...</span>
                    <details className="text-sm">
                        <summary className="text-blue-600 cursor-pointer hover:underline">
                            Show full text
                        </summary>
                        <div className="mt-2 p-2 bg-gray-50 rounded border text-gray-700 break-words">
                            {stringValue}
                        </div>
                    </details>
                </div>
            );
        }
        
        return <span className="break-words">{stringValue}</span>;
    
        
    }

    // Helper function to check if two values are effectively the same
    const areValuesEqual = (value1, value2, fieldName = '') => {
        try {
            // Handle null/undefined cases
            if (value1 === value2) return true;
            if ((value1 === null || value1 === undefined) && (value2 === null || value2 === undefined)) return true;
            if (value1 === null || value1 === undefined || value2 === null || value2 === undefined) return false;
            
            // Dynamic detection of complex nested structures
            const isComplexNestedObject = (obj) => {
                if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return false;
                
                // Check if this object contains multiple keys with complex nested data
                const keys = Object.keys(obj);
                if (keys.length === 0) return false;
                
                // Look for patterns that indicate complex data structures:
                // 1. Multiple keys where values are objects with name/status patterns
                // 2. Objects containing other objects with multiple properties
                let complexValueCount = 0;
                for (const key of keys) {
                    const value = obj[key];
                    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        const valueKeys = Object.keys(value);
                        if (valueKeys.length > 2) { // More than just name/status indicates complexity
                            complexValueCount++;
                        }
                    }
                }
                
                return complexValueCount > 0 || keys.length > 3; // Either has complex nested values or many keys
            };
            
            // Dynamic handling for any complex nested structures (species, biomarkers, etc.)
            if (isComplexNestedObject(value1) || isComplexNestedObject(value2)) {
                // For any complex nested structure, any structural change indicates a real change
                const value1Keys = typeof value1 === 'object' && value1 !== null ? Object.keys(value1) : [];
                const value2Keys = typeof value2 === 'object' && value2 !== null ? Object.keys(value2) : [];
                
                // If different number of entries, it's a change
                if (value1Keys.length !== value2Keys.length) {
                    console.log(`🔄 Dynamic structure change detected in "${fieldName}": Different number of entries (${value1Keys.length} vs ${value2Keys.length})`);
                    return false;
                }
                
                // Check for new entries that were added (exist in value2 but not in value1)
                for (const entryKey of value2Keys) {
                    if (!value1.hasOwnProperty(entryKey)) {
                        console.log(`🔄 Dynamic structure change detected in "${fieldName}": NEW entry "${entryKey}" added`);
                        return false;
                    }
                }
                
                // Check for removed entries (exist in value1 but not in value2)
                for (const entryKey of value1Keys) {
                    if (!value2.hasOwnProperty(entryKey)) {
                        console.log(`🔄 Dynamic structure change detected in "${fieldName}": Entry "${entryKey}" removed`);
                        return false;
                    }
                }
                
                // Check each existing entry for changes
                for (const entryKey of value1Keys) {
                    const entry1 = value1[entryKey];
                    const entry2 = value2[entryKey];
                    
                    // Compare the structure of each entry
                    const entry1Keys = typeof entry1 === 'object' && entry1 !== null ? Object.keys(entry1) : [];
                    const entry2Keys = typeof entry2 === 'object' && entry2 !== null ? Object.keys(entry2) : [];
                    
                    // If different number of fields, it's a change
                    if (entry1Keys.length !== entry2Keys.length) {
                        console.log(`🔄 Dynamic structure change detected in "${fieldName}": Different fields for "${entryKey}" (${entry1Keys.length} vs ${entry2Keys.length})`);
                        return false;
                    }
                    
                    // Compare each field within the entry
                    for (const fieldKey of entry1Keys) {
                        const field1 = entry1[fieldKey];
                        const field2 = entry2[fieldKey];
                        
                        // Use JSON comparison for detailed field comparison
                        if (JSON.stringify(field1) !== JSON.stringify(field2)) {
                            console.log(`🔄 Dynamic structure change detected in "${fieldName}": Field "${fieldKey}" changed in entry "${entryKey}"`);
                            return false;
                        }
                    }
                }
                
                console.log(`🔄 No changes detected in complex structure "${fieldName}"`);
                return true; // All entries and their fields are the same
            }
            
            // Dynamic structure detection for transformation patterns
            const getStructureType = (obj) => {
                if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return 'primitive';
                
                const keys = Object.keys(obj);
                if (keys.length === 0) return 'empty';
                
                // Simple name/status structure
                if (keys.includes('name') && keys.includes('status') && keys.length <= 3) {
                    const nameType = typeof obj.name;
                    const statusType = typeof obj.status;
                    
                    if ((nameType === 'string' || obj.name === null) && typeof statusType === 'string') {
                        return 'simple_name_status';
                    }
                    if (nameType === 'object' && statusType === 'object') {
                        return 'complex_name_status';
                    }
                }
                
                // Complex nested structure with multiple fields
                if (keys.length > 3) return 'complex_nested';
                
                // Check if values are complex objects
                const hasComplexValues = keys.some(key => {
                    const value = obj[key];
                    return typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length > 2;
                });
                
                return hasComplexValues ? 'complex_nested' : 'simple_object';
            };
            
            const struct1Type = getStructureType(value1);
            const struct2Type = getStructureType(value2);
            
            // Handle structure transformation (any type to any other type indicates change)
            if (struct1Type !== struct2Type) {
                console.log(`🔄 Structure transformation detected in "${fieldName}": ${struct1Type} → ${struct2Type}`);
                return false;
            }
            
            // Handle same structure types with deep comparison
            if ((struct1Type === 'complex_name_status' && struct2Type === 'complex_name_status') ||
                (struct1Type === 'complex_nested' && struct2Type === 'complex_nested')) {
                // Compare complex structures - any difference in the nested data is a change
                return JSON.stringify(value1) === JSON.stringify(value2);
            }
            
            // Dynamic handling for nested app structures
            const isDeepNestedStructure = (obj) => {
                return typeof obj === 'object' && obj !== null && !Array.isArray(obj) && 
                       obj.hasOwnProperty('name') && typeof obj.name === 'object' && 
                       obj.name !== null && obj.name.hasOwnProperty('name');
            };
            
            if (isDeepNestedStructure(value1) && isDeepNestedStructure(value2)) {
                // Compare the actual nested values dynamically
                return JSON.stringify(value1.name) === JSON.stringify(value2.name) &&
                       JSON.stringify(value1.status || {}) === JSON.stringify(value2.status || {});
            }
            
            // Dynamic handling for any name/status structure
            const hasNameStatusStructure = (obj) => {
                return typeof obj === 'object' && obj !== null && !Array.isArray(obj) && 
                       obj.hasOwnProperty('name') && obj.hasOwnProperty('status');
            };
            
            if (hasNameStatusStructure(value1) && hasNameStatusStructure(value2)) {
                // Compare both name and status for any name/status structures with null safety
                const name1 = (typeof value1.name === 'object' && value1.name !== null) ? value1.name.name : value1.name;
                const name2 = (typeof value2.name === 'object' && value2.name !== null) ? value2.name.name : value2.name;
                const status1 = (typeof value1.status === 'object' && value1.status !== null) ? value1.status.name : value1.status;
                const status2 = (typeof value2.status === 'object' && value2.status !== null) ? value2.status.name : value2.status;
                return String(name1) === String(name2) && String(status1) === String(status2);
            }
            
            if (hasNameStatusStructure(value1) || hasNameStatusStructure(value2)) {
                // One is name/status structure, one is not - check if they represent the same value
                const structuredValue = hasNameStatusStructure(value1) ? value1 : value2;
                const otherValue = hasNameStatusStructure(value1) ? value2 : value1;
                const extractedName = (typeof structuredValue.name === 'object' && structuredValue.name !== null) ? structuredValue.name.name : structuredValue.name;
                return String(extractedName) === String(otherValue);
            }

            // Dynamic handling for value/unit or value/status structures
            const hasValueWithMetadata = (obj) => {
                return typeof obj === 'object' && obj !== null && !Array.isArray(obj) && 
                       obj.hasOwnProperty('value') && 
                       (obj.hasOwnProperty('unit') || obj.hasOwnProperty('status') || obj.hasOwnProperty('type'));
            };
            
            if (hasValueWithMetadata(value1) && hasValueWithMetadata(value2)) {
                return JSON.stringify(value1) === JSON.stringify(value2);
            }

            // Dynamic handling for array structures with object items
            const isStructuredArray = (arr) => {
                return Array.isArray(arr) && arr.length > 0 && 
                       arr.every(item => typeof item === 'object' && item !== null);
            };

            // Handle any structured arrays (biomarkers, references, etc.)
            if (isStructuredArray(value1) && isStructuredArray(value2)) {
                if (value1.length !== value2.length) return false;
                
                // Check if this looks like a biomarker array or any other structured array
                const hasCommonStructure = value1.length > 0 && value2.length > 0;
                if (hasCommonStructure) {
                    // Get the common keys from the first items to understand the structure
                    const keys1 = Object.keys(value1[0] || {});
                    const keys2 = Object.keys(value2[0] || {});
                    
                    // If structures are similar, do detailed comparison
                    if (keys1.length > 0 && keys2.length > 0) {
                        return value1.every((item1, index) => {
                            const item2 = value2[index];
                            return JSON.stringify(item1) === JSON.stringify(item2);
                        });
                    }
                }
                
                // Fallback to JSON comparison for complex arrays
                return JSON.stringify(value1) === JSON.stringify(value2);
            }
            
            // Convert both to strings for comparison if they're different types
            if (typeof value1 !== typeof value2) {
                return String(value1) === String(value2);
            }
            
            // Handle arrays
            if (Array.isArray(value1) && Array.isArray(value2)) {
                if (value1.length !== value2.length) return false;
                return value1.every((item, index) => areValuesEqual(item, value2[index], fieldName));
            }
            
            // Handle objects
            if (typeof value1 === 'object' && typeof value2 === 'object' && value1 !== null && value2 !== null) {
                const keys1 = Object.keys(value1).sort();
                const keys2 = Object.keys(value2).sort();
                if (keys1.length !== keys2.length) return false;
                if (keys1.join(',') !== keys2.join(',')) return false;
                return keys1.every(key => areValuesEqual(value1[key], value2[key], fieldName));
            }
            
            return false;
        } catch (error) {
            console.warn('Error in areValuesEqual:', error, { value1, value2 });
            return false; // Default to not equal if comparison fails
        }
    };

    // Tabs for filtering
    const tabs = [ 'All', 'Draft', 'Unverified', 'In Review', "Review Complete", "Flagged For Review",  'Verified'];

    // Keyword filter options
    const keywordFilters = [ 'All','With Keywords', 'Without Keywords' ];

    const [sortConfig, setSortConfig] = useState('created_at_desc');

    // Sorting handler
    const handleSortChange = (value) => {
        setSortConfig(value);
    };

    // Sorting logic
    const sortedArticles = useMemo(() => {
        const sortableItems = [...articles];

        // Split sort config correctly
        const lastUnderscoreIndex = sortConfig.lastIndexOf('_');
        const sortKey = sortConfig.slice(0, lastUnderscoreIndex);
        const sortDirection = sortConfig.slice(lastUnderscoreIndex + 1);

        sortableItems.sort((a, b) => {
            // Sort by title
            if (sortKey === 'title') {
                const titleA = a?.publicData?.title?.name?.toLowerCase() || '';
                const titleB = b?.publicData?.title?.name?.toLowerCase() || '';
                return titleA.localeCompare(titleB);
            }

            // Sort by date
            if (sortKey === 'created_at') {
                const dateA = new Date(a.created_at);
                const dateB = new Date(b.created_at);
                return dateA - dateB; // Ascending by default (oldest first)
            }

            return 0;
        });

        // Reverse if descending needed
        if (sortDirection === 'desc') {
            sortableItems.reverse();
        }

        return sortableItems;
    }, [articles, sortConfig]);

    // Function to handle search
    const handleSearch = () => {
        setDebouncedSearchTerm(searchTerm);
    };

    // Enhanced function to clear search
    const clearSearch = () => {
        setSearchTerm('');
        setDebouncedSearchTerm('');
        localStorage.removeItem('articleSearchTerm');
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Oval
                    secondaryColor='lightblue'
                    color={colorTheme.primary}
                    height={50}
                    width={50}
                />
                <p className="mt-4 text-lg font-medium text-gray-600">
                    Loading articles, please wait...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 p-4 text-center">
                Error: {error}
                <button
                    onClick={() => fetchArticles(currentPage)}
                    className="ml-4 px-4 py-2 bg-[#004c78] text-white rounded"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <>
          
            <div className="container mx-auto p-6">
            {/* Bulk Upload Modal */}
            <BulkUploadModal
                open={bulkModalOpen}
                onClose={() => setBulkModalOpen(false)}
                bulkFiles={bulkFiles}
                bulkError={bulkError}
                bulkUploading={bulkUploading || showBulkProgress}
                onFileChange={handleBulkFileChange}
                onRemoveFile={handleRemoveBulkFile}
                onUpload={handleBulkUpload}
            />


           
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">
                    <span className="border-l-4 border-[#004c78] pl-3">Articles Overview</span>
                </h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate("/main-form")}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#004c78] hover:bg-blue-900 text-white rounded-lg transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add New Article
                    </button>
                    {/* Bulk Upload Button */}
                    <button
                        className={`flex items-center gap-2 px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-lg transition-all ${showBulkProgress ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => {
                            if (!showBulkProgress) setBulkModalOpen(true);
                        }}
                        disabled={showBulkProgress}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5zm3 2v2H5v2h2v2h2v-2h2v-2h-2V7H7z" />
                        </svg>
                        Bulk Upload
                    </button>
                </div>
            </div>

            {/* Active Search Indicator - NEW SECTION */}
            {debouncedSearchTerm && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <svg
                            className="h-5 w-5 text-blue-500 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-blue-800">
                            Currently showing search results for: <span className="font-semibold">"{debouncedSearchTerm}"</span>
                        </span>
                    </div>
                    <button
                        onClick={clearSearch}
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                        <svg
                            className="h-4 w-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear Search
                    </button>
                </div>
            )}

            {/* Filter Tabs */}
            <div className="mb-6 flex justify-between items-center flex-wrap">
                {/* Status Filter */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {tabs?.map(tab => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                        ${activeTab === tab
                                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                    : 'text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Keyword Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {keywordFilters?.map(filter => (
                        <button
                            key={filter}
                            onClick={() => { setKeywordFilter(filter); setCurrentPage(1); }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                        ${keywordFilter === filter
                                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                    : 'text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Trending Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {['All', 'Trending', 'Not Trending'].map(option => (
                        <button
                            key={option}
                            onClick={() => { setTrendingFilter(option); setCurrentPage(1); }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                        ${trendingFilter === option
                                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                                    : 'text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                        >
                            {option}
                        </button>
                    ))}
                </div>


                {/* add two more tabs assigned and unassigned */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {['All', 'Assigned', 'Unassigned'].map(option => (
                        <button

                            key={option}
                            onClick={() => { setAssignmentFilter(option); setCurrentPage(1); }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                        ${assignmentFilter === option

                                    ? 'bg-purple-100 text-purple-700 border border-purple-300'
                                    : 'text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {/* Controls Section */}
            <div className="bg-white p-4 rounded-xl shadow-xs border border-gray-100 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">Show</span>
                        <select
                            className="py-2 pl-3 pr-8 border border-gray-200 rounded-lg bg-white text-sm focus:ring-1 focus:ring-[#004c78] focus:border-[#004c78]"
                            onChange={handleEntriesPerPageChange}
                            value={entriesPerPage === 1000000 ? "all" : entriesPerPage}
                        >
                            {[25, 50, 100, 500].map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                            <option value="all">All</option>
                        </select>
                        <span className="text-sm text-gray-600">entries</span>
                    </div>

                    {/* Search and Sort Dropdown */}
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        {/* Sort Dropdown */}
                        <div className="relative w-full md:w-48">
                            <select
                                className="w-full pl-3 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#004c78] focus:border-[#004c78]"
                                onChange={(e) => handleSortChange(e.target.value)}
                                value={sortConfig}
                            >
                                <option value="created_at_desc">Newest First</option>
                                <option value="created_at_asc">Oldest First</option>
                                <option value="title_asc">Title A-Z</option>
                                <option value="title_desc">Title Z-A</option>
                            </select>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-72">
                            <input
                                type="text"
                                placeholder="Search articles..."
                                className="w-full pl-10 pr-24 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#004c78] focus:border-[#004c78]"
                                value={searchTerm}
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    setSearchTerm(newValue);

                                    // Auto-reset when input becomes empty (for backspace/manual clearing)
                                    if (newValue === '') {
                                        setDebouncedSearchTerm('');
                                        localStorage.removeItem('articleSearchTerm');
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        setDebouncedSearchTerm(searchTerm);
                                        localStorage.setItem('articleSearchTerm', searchTerm);
                                    }
                                }}
                            />
                            <svg
                                className="absolute left-3 top-3.5 h-4 w-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>

                            {/* Toggle between Search and Clear button */}
                            {searchTerm && (
                                // Show either search or clear button based on whether a search is active
                                debouncedSearchTerm === searchTerm ? (
                                    // Clear button (shown when search is active)
                                    <button
                                        onClick={clearSearch}
                                        className="absolute right-2 top-1 bg-gray-200 text-gray-700 px-4 py-1.5 rounded-md hover:bg-gray-300 transition-colors text-sm flex items-center"
                                        aria-label="Clear search"
                                    >
                                        <svg
                                            className="h-4 w-4 mr-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Clear
                                    </button>
                                ) : (
                                    // Search button (shown when text is entered but search not yet performed)
                                    <button
                                        onClick={() => {
                                            setDebouncedSearchTerm(searchTerm);
                                            localStorage.setItem('articleSearchTerm', searchTerm);
                                        }}
                                        className="absolute right-2 top-1 bg-[#004c78] text-white px-4 py-1.5 rounded-md hover:bg-[#003355] transition-colors text-sm"
                                    >
                                        Search
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Articles Table */}
            <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto max-h-[80vh] relative">
                    <table className="w-full">
                        <thead className="sticky top-0 bg-gray-50 border-b border-gray-200 z-10">
                            <tr>

                                {headers.map((header, index) => (
                                    <th
                                        key={index}
                                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                    >
                                        {header}
                                    </th>
                                ))}


                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {sortedArticles?.map((entry) => {
                                return <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                                    {/* Article Title */}
                                    <td className="px-6 py-4 text-sm text-gray-900 max-w-[400px] flex items-center gap-2">
                                        {/* Keywords indicator icon */}
                                        <div className="relative group">
                                            {entry?.genericKeywords ? (
                                                <div className="text-green-500 cursor-help">
                                                    {/* Check icon */}
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <polyline points="20 6 9 17 4 12"></polyline>
                                                    </svg>

                                                    {/* Tooltip that appears on hover */}
                                                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 min-w-[150px] z-10">
                                                        <p className="font-semibold mb-1">Primary Keywords:</p>
                                                        <p>
                                                            {Array.isArray(entry?.genericKeywords)
                                                                ? entry.genericKeywords.join(", ")
                                                                : (entry?.genericKeywords === true ? "Yes" : "No")}
                                                        </p>
                                                        <div className="absolute left-2 top-full w-2 h-2 bg-gray-800 transform rotate-45"></div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-red-500 cursor-help">
                                                    {/* Cross icon */}
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="00 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                                    </svg>

                                                    {/* Tooltip for no keywords */}
                                                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 min-w-[150px] z-10">
                                                        <p>No primary keywords available</p>
                                                        <div className="absolute left-2 top-full w-2 h-2 bg-gray-800 transform rotate-45"></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="font-medium ">
                                            {entry?.publicData?.title?.name || "N/A"}
                                        </div>
                                    </td>

                                    {/* Authors */}
                                    <td className="px-6 py-4 text-sm text-gray-700 max-w-[200px]">
                                        <div className="flex flex-wrap gap-x-1.5 truncate">
                                            {entry?.publicData?.authors?.map((author, index) => (
                                                <span key={index} className="whitespace-nowrap">
                                                    {author.name}
                                                    {index < entry.publicData.authors.length - 1 && ","}
                                                </span>
                                            )) || "N/A"}
                                        </div>
                                    </td>

                                    {/* Country */}
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {entry?.publicData?.country?.map((c, index) => (
                                            <span key={index}>
                                                {c?.name}
                                                {index < entry.publicData.country.length - 1 && ","}
                                            </span>
                                        )) || "N/A"}
                                    </td>
                                    {role && role !== 'User' && (
                                        <td className="px-6 py-4">
                                            <div className="relative group">
                                                <div
                                                    className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors 
          ${entry.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
          hover:bg-opacity-80`}
                                                    onClick={() => document.getElementById(`status-select-${entry.id}`)?.focus()}
                                                >
                                                    {entry.status}
                                                </div>

                                                {/* Hidden Native Select for Accessibility */}
                                                <select
                                                    id={`status-select-${entry.id}`}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    value={entry.status}
                                                    onChange={(e) => handleStatusChange(entry.id, e.target.value)}
                                                >
                                                    {['Unverified', 'In Review', 'Flagged for Review','Review Complete','Verified', 'Draft'].map((opt) => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>

                                                {/* Dropdown Arrow */}
                                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </td>
                                    )}


                                    {/* Assigned to */}
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {entry.reviewer ? (
                                            <div>
                                                <div><span className="font-semibold">{entry.reviewer.name}</span></div>
                                                <div className="text-xs text-gray-500">{entry.reviewer.email}</div>
                                                <div className="text-xs text-gray-400">Last login: {entry.reviewer.updated_at ? new Date(entry.reviewer.updated_at).toLocaleString() : 'N/A'}</div>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic">Unassigned</span>
                                        )}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 text-gray-600">
                                            {/* Preview Button */}
                                            <button
                                                onClick={() => handlePreview(entry)}
                                                className="p-1.5 hover:bg-gray-100 rounded-lg relative group"
                                                title="View details"
                                            >
                                                <FaEye className="w-5 h-5" />
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                                    View Details
                                                </div>
                                            </button>

                                            {/* Edit Button */}
                                            <button
                                                onClick={() => entry.status !== "Verified" && handleEdit(entry)}
                                                className={`p-1.5 hover:bg-gray-100 rounded-lg relative group ${entry.status === "Verified" ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                                title={entry.status === "Verified" ? "Cannot edit verified entry" : "Edit entry"}
                                            >
                                                <FaEdit className="w-5 h-5" />
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                                    {entry.status === "Verified" ? "Cannot edit verified entry" : "Edit Entry"}
                                                </div>
                                            </button>

                                            {/* Flag/Special Action Button */}
                                            <button
                                                onClick={() => handleSpecialAction(entry)}
                                                className="p-1.5 hover:bg-gray-100 rounded-lg relative group"
                                                title="Flag for review"
                                            >
                                                <FaFlag className="w-5 h-5" />
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                                    Flag for Review
                                                </div>
                                            </button>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => entry.status !== "Verified" && handleDelete(entry.id)}
                                                className={`p-1.5 hover:bg-red-50 rounded-lg relative group ${entry.status === "Verified" ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                                title={entry.status === "Verified" ? "Cannot delete verified entry" : "Delete entry"}
                                            >
                                                <FaTrash className="w-5 h-5 text-red-600" />
                                                <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 ${entry.status === "Verified" ? 'bg-gray-600' : 'bg-red-600'
                                                    }`}>
                                                    {entry.status === "Verified" ? "Cannot delete verified entry" : "Delete Entry"}
                                                </div>
                                            </button>

                                            {/* Trending Button */}
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        await apiHandle.post(`/articles/${entry.id}/toggle-trending`);
                                                        fetchArticles(currentPage);
                                                    } catch (err) {
                                                        setError('Failed to toggle trending status.');
                                                    }
                                                }}
                                                className={`p-1.5 rounded-lg relative group ${entry.is_trending ? 'bg-yellow-100 hover:bg-yellow-200' : 'hover:bg-gray-100'}`}
                                                title={entry.is_trending ? 'Unmark as Trending' : 'Mark as Trending'}
                                            >
                                                <svg className={`w-5 h-5 ${entry.is_trending ? 'text-yellow-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                                                </svg>
                                                <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 ${entry.is_trending ? 'bg-yellow-500' : 'bg-gray-800'}`}
                                                >
                                                    {entry.is_trending ? 'Unmark as Trending' : 'Mark as Trending'}
                                                </div>
                                            </button>

                                            {/* PDF Viewer Button */}
                                            {entry?.publicData?.pdf_url && entry?.publicData?.pdf_url[0]?.name && (
                                                <button
                                                    onClick={() => navigate('/pdf-viewer', { state: { pdfUrl: entry?.publicData?.pdf_url[0]?.name } })}
                                                    className="p-1.5 hover:bg-gray-100 rounded-lg relative group"
                                                    title="View PDF"
                                                >
                                                    <FaFilePdf className="w-5 h-5" />
                                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                                        View PDF
                                                    </div>
                                                </button>
                                            )}

                                            {/* History Button */}
                                            <button
                                                onClick={() => handleShowRevisions(entry)}
                                                className="p-1.5 hover:bg-gray-100 rounded-lg relative group"
                                                title="View Edit History"
                                            >
                                                <FaHistory className="w-5 h-5" />
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                                    View Edit History
                                                    {entry.revisions && entry.revisions.length > 0 && (
                                                        <span className="ml-1 bg-blue-500 text-white text-xs rounded-full px-1">
                                                            {entry.revisions.length}
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {articles.length === 0 && !loading && (
                    <div className="p-12 text-center">
                        <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                        <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                    </div>
                )}

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <span className="text-sm text-gray-600">
                            Showing <span className="font-medium">{(currentPage - 1) * entriesPerPage + 1}</span> -{' '}
                            <span className="font-medium">{Math.min(currentPage * entriesPerPage, totalArticles)}</span> of{' '}
                            <span className="font-medium">{totalArticles}</span> results
                        </span>

                        <div className="flex gap-1">
                            {Array.from({ length: Math.ceil(totalArticles / entriesPerPage) }, (_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => paginate(index + 1)}
                                    className={`px-3 py-1.5 min-w-[36px] text-sm rounded-md transition-colors
                                ${currentPage === index + 1
                                            ? 'bg-[#004c78] text-white'
                                            : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            </div>

            {/* Revision History Modal */}
            {revisionModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Edit History</h2>
                            <button
                                onClick={() => setRevisionModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="overflow-y-auto max-h-[70vh] p-6">
                            {selectedArticleRevisions.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No edit history available for this article.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {selectedArticleRevisions.map((revision, index) => {
                                        try {
                                            // Calculate actual changes (excluding unchanged values)
                                            const actualChanges = Object.entries(revision.changes || {}).reduce((acc, [section, sectionChanges]) => {
                                                if (!sectionChanges || typeof sectionChanges !== 'object') return acc;
                                                
                                                const changedFields = Object.entries(sectionChanges).filter(([fieldName, change]) => {
                                                    try {
                                                        return change && !areValuesEqual(change?.from, change?.to, fieldName);
                                                    } catch (err) {
                                                        console.warn('Error comparing values:', err, { fieldName, change });
                                                        return true; // Consider it changed if we can't compare
                                                    }
                                                });
                                                if (changedFields.length > 0) {
                                                    acc[section] = changedFields.length;
                                                }
                                                return acc;
                                            }, {});
                                            
                                            const totalChanges = Object.values(actualChanges).reduce((sum, count) => sum + count, 0);
                                        
                                            return (
                                                <div key={revision.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center space-x-3">
                                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                                Revision #{selectedArticleRevisions.length - index}
                                                            </span>
                                                            <span className="text-sm text-gray-500">
                                                                {new Date(revision.created_at).toLocaleString()}
                                                            </span>
                                                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                                                {totalChanges} change{totalChanges !== 1 ? 's' : ''}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleShowRevisionDetail(revision)}
                                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                                                        >
                                                            View Details
                                                        </button>
                                                    </div>
                                                    
                                                    <div className="text-sm text-gray-600">
                                                        <p className="mb-2">
                                                            <span className="font-medium">Changed by:</span> {revision?.changed_by?.name}
                                                        </p>
                                                        <p className="mb-2">
                                                            <span className="font-medium">Email:</span> {revision?.changed_by?.email}
                                                        </p>
                                                        {Object.keys(actualChanges).length > 0 && (
                                                            <div>
                                                                <span className="font-medium">Sections modified:</span>
                                                                <div className="flex flex-wrap gap-1 mt-1">
                                                                    {Object.entries(actualChanges).map(([section, count]) => (
                                                                        <span key={section} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                                                                            {formatFieldName(section)} ({count})
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        } catch (error) {
                                            console.error('Error rendering revision:', error, revision);
                                            return (
                                                <div key={index} className="bg-red-50 border border-red-200 p-4 rounded-lg">
                                                    <p className="text-red-700">Error displaying revision data</p>
                                                    <p className="text-xs text-red-500 mt-1">Date: {new Date(revision.created_at).toLocaleString()}</p>
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Revision Detail Modal */}
            {revisionDetailModalOpen && selectedRevisionDetail && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Revision Details - {new Date(selectedRevisionDetail.created_at).toLocaleString()}
                            </h2>
                            <button
                                onClick={() => setRevisionDetailModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="overflow-y-auto max-h-[75vh] p-6">
                            <div className="mb-6">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-700 mb-1">
                                        <strong>Changed by:</strong> {selectedRevisionDetail?.changed_by?.name}
                                    </p>
                                    <p className="text-sm text-gray-700 mb-1">
                                        <strong>Email:</strong> {selectedRevisionDetail?.changed_by?.email}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        <strong>Date:</strong> {new Date(selectedRevisionDetail?.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {(() => {
                                const allSections = Object.entries(selectedRevisionDetail.changes).map(([section, sectionChanges]) => {
                                    // Process all changes dynamically - let the smart diff handle detection
                                    const actualChanges = Object.entries(sectionChanges).map(([fieldName, change]) => {
                                        // Use smart diff to detect any changes dynamically
                                        const smartDiff = createSmartDiff(change?.from, change?.to);
                                        
                                        // If smart diff found changes, include this field
                                        if (smartDiff && (
                                            Object.keys(smartDiff.added).length > 0 || 
                                            Object.keys(smartDiff.removed).length > 0 || 
                                            Object.keys(smartDiff.modified).length > 0
                                        )) {
                                            return [fieldName, change, smartDiff];
                                        }
                                        
                                        // Fallback: if from and to are different (even just structure), show it
                                        if (JSON.stringify(change?.from) !== JSON.stringify(change?.to)) {
                                            return [fieldName, change, null];
                                        }
                                        
                                        return null;
                                    }).filter(Boolean);
                                    
                                    // Don't show section if no actual changes
                                    if (actualChanges.length === 0) return null;
                                    
                                    return (
                                        <div key={section} className="border border-gray-200 rounded-lg p-4">
                                            <h3 className="text-lg font-semibold mb-4 text-gray-900 capitalize">
                                                {formatFieldName(section)}
                                                <span className="ml-2 text-sm font-normal text-gray-500">
                                                    ({actualChanges.length} change{actualChanges.length !== 1 ? 's' : ''})
                                                </span>
                                            </h3>
                                            
                                            <div className="space-y-4">
                                                {actualChanges.map(([fieldName, change, smartDiff]) => (
                                                    <div key={fieldName} className="border-l-4 border-blue-200 pl-4">
                                                        <h4 className="font-medium text-gray-700 mb-3">
                                                            {formatFieldName(fieldName)}
                                                        </h4>
                                                        
                                                        {smartDiff ? (
                                                            // Use smart diff rendering for dynamic changes - show both sides
                                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                                                                    <h5 className="text-sm font-semibold text-red-800 mb-3 flex items-center">
                                                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                                        </svg>
                                                                        Previous Value
                                                                    </h5>
                                                                    <div className="text-sm text-red-700">
                                                                        {renderSmartDiff(smartDiff, true)}
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                                                                    <h5 className="text-sm font-semibold text-green-800 mb-3 flex items-center">
                                                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                        </svg>
                                                                        New Value
                                                                    </h5>
                                                                    <div className="text-sm text-green-700">
                                                                        {renderSmartDiff(smartDiff, false)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            // Fallback to traditional before/after comparison
                                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                                                                    <h5 className="text-sm font-semibold text-red-800 mb-3 flex items-center">
                                                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                                        </svg>
                                                                        Previous Value
                                                                    </h5>
                                                                    <div className="text-sm text-red-700">
                                                                        {renderChangeValue(change?.from, change?.to, true)}
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                                                                    <h5 className="text-sm font-semibold text-green-800 mb-3 flex items-center">
                                                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                        </svg>
                                                                        New Value
                                                                    </h5>
                                                                    <div className="text-sm text-green-700">
                                                                        {renderChangeValue(change?.to, change?.from, false)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                }).filter(Boolean);

                                return allSections.length > 0 ? (
                                    <div className="space-y-6">
                                        {allSections}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                                            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Meaningful Changes</h3>
                                        <p className="text-sm text-gray-500">
                                            This revision appears to contain only formatting or structural changes without actual content modifications.
                                        </p>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ArticlesOverviewTable;