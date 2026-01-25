import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Input } from '../../Input/Input';
import { CustomCreatableSelect } from '../../CustomSelect/CustomSelect';
import { colorTheme } from '../../../Utils/colortheme';
import { FaInfoCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { add_methods_service_auth, get_methods_service_auth } from '../../../Services/SpecieService';
import { Accordion } from '../../Accordian/Accordian';
import { InputWithUnit } from '../../DurationInput/DurationInput';
import { setShowCellCultureTissuesStatus, setShowConcernReportStatus, setShowIngestionStatus, setShowInhalationConcentrationFields, setShowInhalationStatus, setShowTopicalApplicationsStatus } from '../../../Store/slices/Study_type_slice';
import { ReuseableInput } from '../../DurationInput/ReuseableInput';
import { asyncStatus } from '../../../Utils/asyncStatus';

const ResearcherForm = ({ onSubmit, initialData, onDraftSubmit, onBack, WebpageLinkRequired, speciesTypeGetting, ShowDefault, isSpecialAction, articleGeneralData, onWeightChange }) => {
    const dispatch = useDispatch()

    const { get_method_data } = useSelector((state) => state.method)
    const { ShowConcernReportRedux, ShowInhalationRedux, ShowIngestionRedux, ShowCellCultureTissuesRedux, ShowTopicalApplicationsRedux, showDefaultRedux, showInhalationConcentrationFields } = useSelector((state) => state.StudyType);
    const { add_article_status } = useSelector((state) => state.article);

    // Memoize custom label maps to prevent infinite re-renders
    const trueFalseLabelMap = useMemo(() => ({
        "True": "Yes",
        "False": "No",
        "N/A": "Not Applicable"
    }), []);

    const yesNoLabelMap = useMemo(() => ({
        "Yes": "Yes",
        "No": "No"
    }), []);




    const [formData, setFormData] = useState(initialData || {
        isERW: { name: '', status: 'Unverified' },
        ph: { name: '', status: 'Unverified' },
        erwCompared: { name: '', status: 'Unverified' },
        methodOfAdmin: { name: '', status: 'Unverified' },
        drugComparison: { name: '', status: 'Unverified' },
        comparisonDetail: { name: '', status: 'Unverified' },
        pharmacokinetics: { name: '', status: 'Unverified' },
        pharmacokineticsDescription: { name: '', status: 'Unverified' },
        topical_how: { name: '', status: 'Unverified' },
        hydrogenInhalation: { name: '', status: 'Unverified' },
        percentPurity: { name: '', status: 'Unverified' },
        unitDurationFlowRate: { name: '', status: 'Unverified' },
        HydrogenWaterHuman: { name: '', status: 'Unverified' },
        HydrogenWaterAnimals: { name: '', status: 'Unverified' },
        CompMethodAdmin: { name: '', status: 'Unverified' },
        CompMethodAdminDesc: { name: '', status: 'Unverified' },
        doseComparison: { name: '', status: 'Unverified' },
        doseComparisonDesc: { name: '', status: 'Unverified' },
        geneExpression: { name: '', status: 'Unverified' },
        geneExpressionDesc: { name: '', status: 'Unverified' },
        Video_WebpageLink: { name: '', status: 'Unverified' },
        commercialProduct: { name: '', status: 'Unverified' },
        brandName: { name: '', status: 'Unverified' },
        FrequencyofHydrogen: { name: '', status: 'Unverified' },
        DurationFrequency: { name: '', status: 'Unverified' },
        Peakbreathhydrogen: { name: '', status: 'Unverified' },
        Frequency: { name: '', status: 'Unverified' },
        IngestionDurationfrequency: { name: '', status: 'Unverified' },
        concentrationOfHydrogenForMedium: { name: '', status: 'Unverified' },
        FrequencyCellCultureTissues: { name: '', status: 'Unverified' },
        DurationFrequencyCellCultureTissues: { name: '', status: 'Unverified' },
        VolumeOfWaterConsumed: { name: 0, status: 'Unverified' },
        VolumeOfWaterConsumedUnit: { name: '', status: 'Unverified' },
        HowManyConcentrations: { name: '', status: 'Unverified' },
        sexDifference: { name: '', status: 'Unverified' },
        responderDifference: { name: '', status: 'Unverified' },
        safetyProfile: { name: '', status: 'Unverified' },
        pregnantBreastfeeding: { name: '', status: 'Unverified' },
        adverseEffects: { name: '', status: 'Unverified' },
        adverseEffectsDescription: { name: '', status: 'Unverified' },
        doseDependentEffect: { name: '', status: 'Unverified' },
        mechanisticInsights: { name: '', status: 'Unverified' },
        mechanisticInsightsDesc: { name: '', status: 'Unverified' },
        safetyofhydrogen: { name: '', status: 'Unverified' },
        PasteUrl: { name: '', status: 'Unverified' },
        bodyWeight: { name: 75, status: 'Unverified', unit: 'g' },

        speciesData: initialData?.speciesData || {},

        wasOxyhydrogenUsed: { name: '', status: 'Unverified' },
        inhalationConcentrations: [],
    });


    const [showPH, setShowPH] = useState(false);
    const [showComparisonDetail, setShowComparisonDetail] = useState(false);
    const [showPharmacokineticsDescription, setShowPharmacokineticsDescription] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [DoseConcentrationComparison, setDoseConcentrationComparison] = useState(false);
    const [setCompMethodAdminState, setCompMethodAdmin] = useState(false);
    const [geneExpressionDesciption, setGeneExpressionDesciption] = useState(false);

    // ============== //
    const [showConcentrationForm, setShowConcentrationForm] = useState({});
    const [species, setSpecies] = useState([]);
    const [speciesWeight, setSpeciesWeight] = useState([]);
    const [isDraft, setIsDraft] = useState(false);
    // ============== //

    useEffect(() => {
        dispatch(get_methods_service_auth());
    }, [dispatch]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const didInit = useRef(false);

    useEffect(() => {
        // Run this effect AFTER other effects by adding a tiny delay
        const timeoutId = setTimeout(() => {
            // Run if we have initialData OR speciesTypeGetting data (for new articles)
            const hasInitialData = initialData && Object.keys(initialData).length > 0;
            const hasSpeciesData = speciesTypeGetting?.speciesDetails !== undefined; // Changed: just check if speciesDetails exists (even if empty)
            
            if (!didInit.current && (hasInitialData || hasSpeciesData)) {
                console.log('=== DELAYED DIDINT EFFECT RUNNING ===');
                console.log('hasInitialData:', hasInitialData);
                console.log('hasSpeciesData:', hasSpeciesData);
                console.log('initialData.speciesData:', initialData?.speciesData);
                
                setFormData((prevFormData) => {
                    console.log('=== INSIDE DELAYED DIDINT SETFORMDATA ===');
                    console.log('prevFormData.speciesData before merge:', prevFormData.speciesData);
                    console.log('initialData.speciesData:', initialData?.speciesData);
                    
                    // Get species that should exist
                    // Priority: speciesTypeGetting (current selection) > initialData (for existing articles)
                    const allSpeciesFromInitial = Object.keys(initialData?.speciesData || {});
                    const allSpeciesFromSyncing = Object.keys(speciesTypeGetting?.speciesDetails || {});
                    
                    // Use syncing species (current selection) if available
                    // If hasSpeciesData is true, use syncing species (even if empty - means no species selected)
                    // If hasSpeciesData is false, use initial data for existing articles
                    const speciesThatShouldExist = hasSpeciesData ? allSpeciesFromSyncing : allSpeciesFromInitial;
                    
                    console.log('allSpeciesFromInitial:', allSpeciesFromInitial);
                    console.log('allSpeciesFromSyncing:', allSpeciesFromSyncing);
                    console.log('speciesThatShouldExist:', speciesThatShouldExist);
                    
                    // Build the complete species data - ONLY include species that should exist
                    const completeSpeciesData = {};
                    
                    speciesThatShouldExist.forEach(species => {
                        // Try to preserve existing data from initialData if available
                        if (initialData?.speciesData?.[species]) {
                            completeSpeciesData[species] = initialData.speciesData[species];
                        } 
                        // If not in initial data but in syncing, create new with defaults
                        else if (speciesTypeGetting?.speciesDetails?.[species]) {
                            const specieData = speciesTypeGetting.speciesDetails[species];
                            completeSpeciesData[species] = {
                                isOpen: false,
                                HowManyConcentrations: { name: 0, status: 'Unverified' },
                                volumes: [],
                                concentrations: [],
                                absoluteDoses: [],
                                relativeDoses: [],
                                inhalationConcentrations: [],
                                wasOxyhydrogenUsed: { name: '', status: 'Unverified' },
                                isInhalationOpen: false,
                                isCellTissueOpen: false,
                                isIngestionOpen: false,
                                methods: speciesTypeGetting.methods || [],
                                weight: getSpeciesWeightFromArticleData(species),
                            };
                        }
                    });
                    
                    console.log('DELAYED completeSpeciesData after merge:', completeSpeciesData);
                    
                    // Return merged data - use initialData if available, otherwise preserve current formData
                    if (hasInitialData) {
                        return {
                            ...initialData,
                            speciesData: completeSpeciesData
                        };
                    } else {
                        // For new articles, just update the speciesData
                        return {
                            ...prevFormData,
                            speciesData: completeSpeciesData
                        };
                    }
                });
                
                // Apply initial data settings if we have initialData
                if (hasInitialData) {
                    console.log('=== FULL INITIAL DATA DEBUG ===');
                    console.log('Full initialData:', initialData);
                    
                    setShowPH(initialData.isERW === 'True');
                    setShowComparisonDetail(initialData.drugComparison === 'True');
                    setShowPharmacokineticsDescription(initialData.pharmacokinetics === 'True');
                    setCompMethodAdmin(initialData.CompMethodAdmin === 'True');
                    setDoseConcentrationComparison(initialData.doseComparison === 'True');
                    setGeneExpressionDesciption(initialData.geneExpression?.name === 'True');
                    
                    // Fix malformed method names from PDF bot
                    let correctedMethods = initialData.methodOfAdmin;
                    if (hasInitialData && initialData.methodOfAdmin) {
                        correctedMethods = initialData.methodOfAdmin.map(method => {
                            const methodName = method.name || method;
                            
                            // Fix common malformed method names
                            if (methodName.includes('Cell Culture / Tissue') && !methodName.includes('Cell Culture / Tissues')) {
                                console.log('Fixing malformed Cell Culture method:', methodName);
                                return {
                                    ...method,
                                    name: 'Cell Culture / Tissues'
                                };
                            }
                            
                            // Add more mappings as needed
                            return method;
                        });
                        
                        console.log('Original methods:', initialData.methodOfAdmin);
                        console.log('Corrected methods:', correctedMethods);
                        
                        // Update formData with corrected methods
                        setFormData(prevData => ({
                            ...prevData,
                            methodOfAdmin: correctedMethods
                        }));
                    }
                    
                    // Helper function to check if a field has real data (not placeholder/empty)
                    const hasRealData = (value) => {
                        if (!value) return false;
                        if (typeof value === 'string') {
                            // Check for placeholder text patterns
                            const isPlaceholder = value.includes('EXPLAINATION REQUIRED') || 
                                                value.includes('EXPLANATION REQUIRED') ||
                                                value.trim() === '' ||
                                                value === 'N/A';
                            return !isPlaceholder;
                        }
                        if (typeof value === 'object' && value.name) {
                            return hasRealData(value.name);
                        }
                        return true;
                    };
                    
                    // Check methods from methodOfAdmin (use corrected methods)
                    const methods = correctedMethods || [];
                    const methodNames = Array.isArray(methods) ? methods.map(m => m.name || m) : [];
                    console.log('=== INITIALIZATION METHOD CHECK ===');
                    console.log('methods from initialData:', methods);
                    console.log('methodNames (after correction):', methodNames);
                    console.log('Available methods from API:', get_method_data?.methods?.map(m => m.name));
                    
                    // Check for Inhalation methods
                    const hasInhalationMethod = methodNames.some(method => method.includes('Inhalation'));
                    const hasInhalationData = initialData?.inhalationConcentrations?.length > 0;
                    if (hasInhalationMethod || hasInhalationData) {
                        console.log('Showing inhalation status from init - method:', hasInhalationMethod, 'data:', hasInhalationData);
                        dispatch(setShowInhalationStatus(true));
                    } else {
                        console.log('Hiding inhalation status');
                        dispatch(setShowInhalationStatus(false));
                    }
                    
                    // Check for Gavage/Oral methods  
                    const hasConcernReportMethod = methodNames.some(method => 
                        method.includes('Gavage') || method.includes('Oral Hydrogen Water') || method.includes('Hydrogen-rich Saline')
                    );
                    const hasConcernReportData = initialData?.concentrations?.length > 0;
                    if (hasConcernReportMethod || hasConcernReportData) {
                        console.log('Showing concern report status from init - method:', hasConcernReportMethod, 'data:', hasConcernReportData);
                        dispatch(setShowConcernReportStatus(true));
                    } else {
                        console.log('Hiding concern report status');
                        dispatch(setShowConcernReportStatus(false));
                    }
                    
                    // Check for Ingestion methods - be strict about placeholder data
                    const hasIngestionMethod = methodNames.some(method => method.includes('Ingestion'));
                    const hasIngestionData = hasRealData(initialData?.Peakbreathhydrogen) || 
                                           hasRealData(initialData?.Frequency) || 
                                           hasRealData(initialData?.IngestionDurationfrequency);
                    console.log('Ingestion check - method:', hasIngestionMethod, 'realData:', hasIngestionData);
                    console.log('  - Frequency:', initialData?.Frequency, 'isReal:', hasRealData(initialData?.Frequency));
                    console.log('  - Peakbreathhydrogen:', initialData?.Peakbreathhydrogen, 'isReal:', hasRealData(initialData?.Peakbreathhydrogen));
                    console.log('  - IngestionDurationfrequency:', initialData?.IngestionDurationfrequency, 'isReal:', hasRealData(initialData?.IngestionDurationfrequency));
                    if (hasIngestionMethod || hasIngestionData) {
                        console.log('Showing ingestion status from init');
                        dispatch(setShowIngestionStatus(true));
                    } else {
                        console.log('Hiding ingestion status');
                        dispatch(setShowIngestionStatus(false));
                    }
                    
                    // Check for Cell Culture methods - be strict about placeholder data
                    const hasCellCultureMethod = methodNames.some(method => method.includes('Cell Culture'));
                    const hasCellCultureData = hasRealData(initialData?.concentrationOfHydrogenForMedium) || 
                                             hasRealData(initialData?.FrequencyCellCultureTissues) || 
                                             hasRealData(initialData?.DurationFrequencyCellCultureTissues);
                    console.log('Cell Culture check - method:', hasCellCultureMethod, 'realData:', hasCellCultureData, 'methodNames:', methodNames);
                    console.log('  - concentrationOfHydrogenForMedium:', initialData?.concentrationOfHydrogenForMedium, 'isReal:', hasRealData(initialData?.concentrationOfHydrogenForMedium));
                    if (hasCellCultureMethod || hasCellCultureData) {
                        console.log('Showing cell culture status from init');
                        dispatch(setShowCellCultureTissuesStatus(true));
                    } else {
                        console.log('Hiding cell culture status');
                        dispatch(setShowCellCultureTissuesStatus(false));
                    }
                    
                    // Check for Topical methods - be strict about placeholder data
                    const hasTopicalMethod = methodNames.some(method => method.includes('Topical applications'));
                    const hasTopicalData = hasRealData(initialData?.topical_how);
                    console.log('Topical check - method:', hasTopicalMethod, 'realData:', hasTopicalData);
                    console.log('  - topical_how:', initialData?.topical_how, 'isReal:', hasRealData(initialData?.topical_how));
                    if (hasTopicalMethod || hasTopicalData) {
                        console.log('Showing topical status from init');
                        dispatch(setShowTopicalApplicationsStatus(true));
                    } else {
                        console.log('Hiding topical status');
                        dispatch(setShowTopicalApplicationsStatus(false));
                    }
                } else {
                    // For new articles (PDF bot scraper), ensure all method tabs are hidden initially
                    console.log('No initial data - hiding all method tabs');
                    dispatch(setShowInhalationStatus(false));
                    dispatch(setShowConcernReportStatus(false));
                    dispatch(setShowIngestionStatus(false));
                    dispatch(setShowCellCultureTissuesStatus(false));
                    dispatch(setShowTopicalApplicationsStatus(false));
                }
                
                // THIS LINE IS REQUIRED!
                didInit.current = true;
            }
        }, 0); // Run after current execution stack
        
        return () => clearTimeout(timeoutId);
    }, [initialData, speciesTypeGetting]);


    // // Ensure formData has speciesData to render
    // DISABLED: This effect is now handled by the didInit effect above to prevent conflicts
    /*
useEffect(() => {
    console.log('=== SYNCING EFFECT RUNNING ===');
    console.log('speciesTypeGetting:', speciesTypeGetting);
    console.log('speciesTypeGetting.speciesDetails:', speciesTypeGetting?.speciesDetails);
    
    if (speciesTypeGetting && speciesTypeGetting.speciesDetails) {
        const speciesDetails = speciesTypeGetting.speciesDetails;
        console.log('=== INSIDE SYNCING CONDITION ===');
        setFormData((prevFormData) => {
            let prevSpeciesData = prevFormData.speciesData || {};
            let updatedSpeciesData = { ...prevSpeciesData };

            // ADD THESE LOGS:
            console.log('Current prevSpeciesData:', prevSpeciesData);
            console.log('speciesDetails from speciesTypeGetting:', speciesDetails);

            Object.keys(speciesDetails).forEach((specieName) => {
                if (!updatedSpeciesData[specieName]) {
                    let specieData = speciesDetails[specieName];
                    // ADD THIS LOG:
                    console.log('Adding missing specie to formData:', specieName, specieData);
                    updatedSpeciesData[specieName] = {
                        isOpen: false,
                        HowManyConcentrations: { name: 0, status: 'Unverified' },
                        volumes: [],
                        concentrations: [],
                        absoluteDoses: [],
                        relativeDoses: [],
                        inhalationConcentrations: [],
                        wasOxyhydrogenUsed: { name: '', status: 'Unverified' },
                        isInhalationOpen: false,
                        isCellTissueOpen: false,
                        isIngestionOpen: false,
                        methods: speciesTypeGetting.methods || [],
                        weight: getSpeciesWeightFromArticleData(specieName),
                    };
                } else {
                    // ADD THIS LOG:
                    console.log('Specie already exists in formData:', specieName);
                }
            });

            // ADD THIS LOG:
            console.log('Updated formData.speciesData:', updatedSpeciesData);

            return {
                ...prevFormData,
                speciesData: updatedSpeciesData,
            };
        });
    } else {
        console.log('=== SYNCING CONDITION NOT MET ===');
        console.log('speciesTypeGetting exists:', !!speciesTypeGetting);
        console.log('speciesDetails exists:', !!speciesTypeGetting?.speciesDetails);
    }
}, [speciesTypeGetting]);
*/

    // Sync weight data from ArticleGeneralData
    useEffect(() => {
        if (articleGeneralData?.speciesDetails) {
            setFormData(prevState => {
                const updatedSpeciesData = { ...prevState.speciesData };
                
                // Update weight for each species from ArticleGeneralData
                Object.keys(updatedSpeciesData).forEach(speciesName => {
                    if (updatedSpeciesData[speciesName]) {
                        updatedSpeciesData[speciesName] = {
                            ...updatedSpeciesData[speciesName],
                            weight: getSpeciesWeightFromArticleData(speciesName)
                        };
                    }
                });
                
                return {
                    ...prevState,
                    speciesData: updatedSpeciesData
                };
            });
        }
    }, [articleGeneralData]);

    // NEW: Sync species data when species are added/removed from ArticleGeneralData
    // This effect runs AFTER initial sync and handles both adding new species and removing old ones
    useEffect(() => {
        // Only run after initial sync is complete
        if (!didInit.current) {
            return;
        }

        // Get the current valid species from speciesTypeGetting
        const validSpecies = Object.keys(speciesTypeGetting?.speciesDetails || {});
        
        console.log('=== SPECIES SYNC EFFECT ===');
        console.log('Valid species from ArticleGeneralData:', validSpecies);

        setFormData(prevState => {
            const currentSpeciesData = prevState.speciesData || {};
            const currentSpeciesKeys = Object.keys(currentSpeciesData);
            
            console.log('Current species in formData:', currentSpeciesKeys);
            console.log('Current formData.speciesData FULL:', JSON.stringify(currentSpeciesData, null, 2));
            
            // Find species to remove (exist in formData but not in validSpecies)
            const speciesToRemove = currentSpeciesKeys.filter(
                species => !validSpecies.includes(species)
            );
            
            // Find species to add (exist in validSpecies but not in formData)
            const speciesToAdd = validSpecies.filter(
                species => !currentSpeciesKeys.includes(species)
            );
            
            // If nothing to add or remove, return unchanged state
            if (speciesToRemove.length === 0 && speciesToAdd.length === 0) {
                console.log('No species changes needed');
                return prevState;
            }
            
            console.log('Species being removed:', speciesToRemove);
            console.log('Species being added:', speciesToAdd);
            
            // IMPORTANT: Start with a COPY of the current species data to preserve all existing data
            const syncedSpeciesData = { ...currentSpeciesData };
            
            // Remove species that should no longer exist
            speciesToRemove.forEach(species => {
                console.log(`Removing species: ${species}`);
                delete syncedSpeciesData[species];
            });
            
            // Add new species with default values (existing species are already in syncedSpeciesData)
            speciesToAdd.forEach(species => {
                console.log(`Adding new species: ${species}`);
                syncedSpeciesData[species] = {
                    isOpen: false,
                    HowManyConcentrations: { name: 0, status: 'Unverified' },
                    volumes: [],
                    concentrations: [],
                    absoluteDoses: [],
                    relativeDoses: [],
                    inhalationConcentrations: [],
                    wasOxyhydrogenUsed: { name: '', status: 'Unverified' },
                    isInhalationOpen: false,
                    isCellTissueOpen: false,
                    isIngestionOpen: false,
                    methods: [],
                    methodsData: {},
                    weight: getSpeciesWeightFromArticleData(species),
                };
            });
            
            console.log('Synced speciesData keys:', Object.keys(syncedSpeciesData));
            console.log('Synced speciesData FULL:', JSON.stringify(syncedSpeciesData, null, 2));
            
            // If all species are removed, also clear methodOfAdmin
            if (validSpecies.length === 0) {
                console.log('All species removed - clearing methodOfAdmin');
                return {
                    ...prevState,
                    speciesData: syncedSpeciesData,
                    methodOfAdmin: { name: '', status: 'Unverified' }
                };
            }
            
            return {
                ...prevState,
                speciesData: syncedSpeciesData
            };
        });

        // Also cleanup showConcentrationForm state (keys are like "species-method-type")
        setShowConcentrationForm(prevState => {
            const cleanedState = {};
            Object.keys(prevState).forEach(key => {
                // Check if any valid species is part of this key
                const belongsToValidSpecies = validSpecies.some(species => 
                    key.startsWith(`${species}-`)
                );
                // Keep 'simple' key and keys belonging to valid species
                if (key === 'simple' || belongsToValidSpecies) {
                    cleanedState[key] = prevState[key];
                }
            });
            return cleanedState;
        });
        
        // If all species removed, hide all method tabs
        if (validSpecies.length === 0) {
            console.log('All species removed - hiding all method tabs');
            dispatch(setShowInhalationStatus(false));
            dispatch(setShowConcernReportStatus(false));
            dispatch(setShowIngestionStatus(false));
            dispatch(setShowCellCultureTissuesStatus(false));
            dispatch(setShowTopicalApplicationsStatus(false));
        }
    }, [speciesTypeGetting?.speciesDetails]);

    const speciesDataExists = formData?.speciesData && Object.keys(formData.speciesData).length > 0;


    const hasError = (fields) => fields.some((field) => validationErrors[field]);
    const isResearchBioInvalid = hasError(['methodOfAdmin']);
    const [isResearchBio, setIsResearchBio] = useState(isResearchBioInvalid);
    const [isERWandComp, setIsERWandComp] = useState();
    const [isInhalationInformation, setIsInhalationInformation] = useState();
    const [isIngestionInformation, setIsIngestionInformation] = useState();
    const [isCellCultureTissuesInformation, setIsCellCultureTissuesInformation] = useState();
    const [isGeneExpression, setIsGeneExpression] = useState();
    const [isAdverseEffects, setIsAdverseEffects] = useState();
    const [isBiologicalMechanistic, setIsBiologicalMechanistic] = useState();
    const [isExternalReferences, setIsExternalReferences] = useState();
    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
    const [missingFields, setMissingFields] = useState([]);


    const handleInputChange = (value, name) => {
        // setFormData((prevState) => ({
        //     ...prevState,
        //     [name]: value
        // }));
        // setFormData((prevState) => ({
        //     ...prevState,
        //     [name]: { name: value, status: 'Unverified' }
        // }));

        console.log("value", value);
        console.log("name", name);

        // setFormData((prevState) => ({
        //     ...prevState,
        //     [name]: Array.isArray(value)
        //         ? value.map(item => typeof item === "string"
        //             ? { name: item, status: "Unverified" }
        //             : item) // Ensure array values are objects
        //         : { name: value, status: "Unverified" } // Ensure single values are objects
        // }));
        setFormData((prevState) => ({
            ...prevState,
            [name]: Array.isArray(value)
                ? value.map((item) =>
                    typeof item === "string"
                        ? { name: item, status: "Unverified" } // Convert string to object
                        : item
                )
                : { name: value, status: prevState[name]?.status || "Unverified" }, // Maintain object structure
        }));


        if (name === 'methodOfAdmin') {
            console.log('=== METHOD OF ADMIN CHANGE ===');
            console.log('Selected methods:', value);
            console.log('Current formData.methodOfAdmin:', formData.methodOfAdmin);
            
            // Handle `Gavage` and `Oral Hydrogen Water` together for concern report
            if (value.includes('Gavage') || value.includes('Oral Hydrogen Water') || value.includes('Hydrogen-rich Saline')) {
                dispatch(setShowConcernReportStatus(true));
            } else {
                dispatch(setShowConcernReportStatus(false));
                // Clear concern report related data when these methods are removed
                setFormData((prevData) => ({
                    ...prevData,
                    HowManyConcentrations: { name: 0, status: 'Unverified' },
                    volumes: [],
                    concentrations: [],
                    absoluteDoses: [],
                    relativeDoses: []
                }));
            }

            // Handle Inhalation methods - show if ANY method contains "Inhalation"
            const hasInhalationMethod = value.some(method => method.includes('Inhalation'));
            if (!hasInhalationMethod) {
                dispatch(setShowInhalationStatus(false));
                dispatch(setShowInhalationConcentrationFields(false));
                // Clear all inhalation-related data when Inhalation is removed
                setFormData((prevData) => ({
                    ...prevData,
                    wasOxyhydrogenUsed: { name: '', status: 'Unverified' },
                    numInhalationConcentrations: { name: null, status: 'Unverified' },
                    inhalationConcentrations: [],
                    hydrogenInhalation: { name: '', status: 'Unverified' }
                }));
            } else {
                dispatch(setShowInhalationStatus(true));
            }

            // Handle Ingestion methods - show if ANY method contains "Ingestion"
            const hasIngestionMethod = value.some(method => method.includes('Ingestion'));
            if (!hasIngestionMethod) {
                dispatch(setShowIngestionStatus(false));
                setFormData((prevData) => ({
                    ...prevData,
                    Peakbreathhydrogen: { name: '', status: 'Unverified' },
                    Frequency: { name: '', status: 'Unverified' },
                    IngestionDurationfrequency: { name: '', status: 'Unverified' }
                }));
            } else {
                dispatch(setShowIngestionStatus(true));
            }

            // Handle Cell Culture / Tissues method clearing
            const hasCellCultureMethod = value.some(method => method.includes('Cell Culture'));
            console.log('Cell Culture method check:', hasCellCultureMethod, 'methods:', value);
            if (!hasCellCultureMethod) {
                console.log('Hiding cell culture status');
                dispatch(setShowCellCultureTissuesStatus(false));
                setFormData((prevData) => ({
                    ...prevData,
                    concentrationOfHydrogenForMedium: { name: '', status: 'Unverified' },
                    FrequencyCellCultureTissues: { name: '', status: 'Unverified' },
                    DurationFrequencyCellCultureTissues: { name: '', status: 'Unverified' }
                }));
            } else {
                console.log('Showing cell culture status');
                dispatch(setShowCellCultureTissuesStatus(true));
            }

            // Handle Topical applications method clearing
            if (!value.includes("Topical applications")) {
                dispatch(setShowTopicalApplicationsStatus(false));
                setFormData((prevData) => ({
                    ...prevData,
                    topical_how: { name: '', status: 'Unverified' }
                }));
            } else {
                dispatch(setShowTopicalApplicationsStatus(true));
            }
        }
        //  Inhalaion Hydrogen Section

        // If "Was Oxyhydrogen used?" is answered as "Yes", show further input fields
        if (name === "wasOxyhydrogenUsed" && value === "Yes") {
            dispatch(setShowInhalationConcentrationFields(true));
        } else if (name === "wasOxyhydrogenUsed" && value === "No") {
            dispatch(setShowInhalationConcentrationFields(true));

        }

        if (name === "numInhalationConcentrations") {
            const newCount = parseInt(value) || 0;
            setFormData((prevData) => ({
                ...prevData,
                numInhalationConcentrations: { name: newCount, status: 'Unverified' },
                inhalationConcentrations: Array.from({ length: newCount }, (_, i) => ({
                    percentPurity: prevData.inhalationConcentrations?.[i]?.percentPurity || { name: "", status: "Unverified" },
                    flowRate: prevData.inhalationConcentrations?.[i]?.flowRate || { name: "", status: "Unverified" },
                    frequency: prevData.inhalationConcentrations?.[i]?.frequency || { name: "", status: "Unverified" },
                    duration: prevData.inhalationConcentrations?.[i]?.duration || { name: "", status: "Unverified" },
                    unitFlowRate: prevData.inhalationConcentrations?.[i]?.unitFlowRate || { name: "mL/min", status: "Unverified" },
                    unitDuration: prevData.inhalationConcentrations?.[i]?.unitDuration || { name: "minutes", status: "Unverified" },
                })),
            }));

        }

        // Handling dynamic updates for each inhalation concentration field

        if (name.startsWith("inhalationConcentration_")) {
            const [_, index, field] = name.split("_");
            const idx = parseInt(index, 10);

            setFormData((prevData) => {
                const updatedInhalationConcentrations = prevData.inhalationConcentrations.map((item, i) =>
                    i === idx
                        ? {
                            ...item,
                            [field]: { name: value, status: "Unverified" }, // Ensuring correct format
                        }
                        : item
                );

                return {
                    ...prevData,
                    inhalationConcentrations: updatedInhalationConcentrations,
                };
            });
        }

        //  Inhalaion Hydrogen Section



        if (name === "HowManyConcentrations") {
            const newCount = parseInt(value) || '';

            setFormData((prevData) => ({
                ...prevData,
                HowManyConcentrations: { name: newCount, status: "Unverified" },
                volumes: Array.from({ length: newCount }, (_, i) => ({
                    value: prevData.volumes?.[i]?.value || { name: "", status: "Unverified" },
                    unit: prevData.volumes?.[i]?.unit || { name: "mL", status: "Unverified" },
                })),
                concentrations: Array.from({ length: newCount }, (_, i) => ({
                    value: prevData.concentrations?.[i]?.value || { name: "", status: "Unverified" },
                    unit: prevData.concentrations?.[i]?.unit || { name: "mg/L", status: "Unverified" },
                })),
                absoluteDoses: Array.from({ length: newCount }, (_, i) => ({
                    value: prevData.absoluteDoses?.[i]?.value || { name: "", status: "Unverified" },
                    unit: prevData.absoluteDoses?.[i]?.unit || { name: "mg/day", status: "Unverified" },
                })),
                relativeDoses: Array.from({ length: newCount }, (_, i) => ({
                    value: prevData.relativeDoses?.[i]?.value || { name: "", status: "Unverified" },
                    unit: prevData.relativeDoses?.[i]?.unit || { name: "mg/kg/day", status: "Unverified" },
                })),
            }));
        }
        else if (
            name.startsWith("volume_") ||
            name.startsWith("concentration_") ||
            name.startsWith("absoluteDoses_") ||
            name.startsWith("relativeDoses_")
        ) {
            const [_, index, field] = name.split("_");
            const idx = parseInt(index, 10);

            setFormData((prevData) => {
                const updateField = (list) =>
                    list.map((item, i) =>
                        i === idx
                            ? {
                                ...item,
                                [field]: { name: value, status: "Unverified" },
                            }
                            : item
                    );

                return {
                    ...prevData,
                    volumes: name.startsWith("volume_") ? updateField(prevData.volumes) : prevData.volumes,
                    concentrations: name.startsWith("concentration_") ? updateField(prevData.concentrations) : prevData.concentrations,
                    absoluteDoses: name.startsWith("absoluteDoses_") ? updateField(prevData.absoluteDoses) : prevData.absoluteDoses,
                    relativeDoses: name.startsWith("relativeDoses_") ? updateField(prevData.relativeDoses) : prevData.relativeDoses,
                };
            });
        }

        if (name === "ph") {
            const parsedValue = parseFloat(value);

            // Check if the value is within the 0-14 range and is a valid number
            if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 14) {
                setFormData((prevState) => ({
                    ...prevState,
                    [name]: {
                        name: value, // Store the valid pH value
                        status: prevState[name]?.status || "Unverified", // Maintain or set default status
                    },
                }));
                setValidationErrors((prevErrors) => ({
                    ...prevErrors,
                    [name]: "", // Clear validation error
                }));
            } else if (value === "") {
                // Allow empty input (clear field but keep status)
                setFormData((prevState) => ({
                    ...prevState,
                    [name]: {
                        name: "", // Clear value but keep status
                        status: prevState[name]?.status || "Unverified",
                    },
                }));
                setValidationErrors((prevErrors) => ({
                    ...prevErrors,
                    [name]: "",
                }));
            } else {
                // Invalid value, show error and do not update the value
                setValidationErrors((prevErrors) => ({
                    ...prevErrors,
                    [name]: "Please enter a valid pH between 0 and 14.",
                }));
            }
        }
        if (name === 'doseComparison') {
            setDoseConcentrationComparison(value === 'True');
            if (value !== 'True') {
                setFormData((prevState) => ({
                    ...prevState,
                    doseComparisonDesc: ''
                }));
            }
        }
        if (name === 'CompMethodAdmin') {
            setCompMethodAdmin(value === 'True');
            if (value !== 'True') {
                setFormData((prevState) => ({
                    ...prevState,
                    CompMethodAdminDesc: ''
                }));
            }
        }
        if (name === 'geneExpression') {
            setGeneExpressionDesciption(value === 'True');
            if (value !== 'True') {
                setFormData((prevState) => ({
                    ...prevState,
                    geneExpressionDesc: ''
                }));
            }
        }
        if (name === 'isERW') {
            setShowPH(value === 'True');
            if (value !== 'True') {
                setFormData((prevState) => ({
                    ...prevState,
                    ph: ''
                }));
            }
        }
        if (name === 'drugComparison') {
            setShowComparisonDetail(value === 'True');
            if (value !== 'True') {
                setFormData((prevState) => ({
                    ...prevState,
                    comparisonDetail: ''
                }));
            }
        }
        if (name === 'pharmacokinetics') {
            setShowPharmacokineticsDescription(value === 'True');
            if (value !== 'True') {
                setFormData((prevState) => ({
                    ...prevState,
                    pharmacokineticsDescription: ''
                }));
            }
        }

        setValidationErrors({ ...validationErrors, [name]: '' });

    };

    const calculateSpeciesWeightNew = (specie, speciesWeight) => {
        return parseFloat(speciesWeight[specie]?.averageWeight || "75");
    };

    // Get species weight from ArticleGeneralData
    const getSpeciesWeightFromArticleData = (speciesName) => {
        if (!articleGeneralData?.speciesDetails) {
            return { name: 75, unit: 'kg' }; // Default fallback
        }

        const speciesData = articleGeneralData.speciesDetails[speciesName];
        if (speciesData?.averageWeight) {
            return {
                name: parseFloat(speciesData.averageWeight.name) || 75,
                unit: speciesData.averageWeight.unit || 'kg',
                status: speciesData.averageWeight.status || 'Unverified'
            };
        }

        // Default fallback
        return { name: 75, unit: 'kg', status: 'Unverified' };
    };

    const handleBodyWeightUnitChange = (newUnit) => {
        setFormData((prevState) => {
            const updated = {
                ...prevState,
                bodyWeight: {
                    ...prevState.bodyWeight,
                    unit: newUnit
                }
            };
            // Sync to ArticleGeneralData if onWeightChange exists
            if (onWeightChange) {
                onWeightChange('default', {
                    averageWeight: prevState.bodyWeight?.name || '',
                    weightUnit: newUnit
                });
            }
            return updated;
        });
    };


    const handleInputChangeSpecie = (specie, field, value, method = null) => {
        setFormData((prevData) => {
            const updatedSpeciesData = { ...prevData.speciesData };

            // Initialize speciesEntry with status for all fields
            const speciesEntry = updatedSpeciesData[specie] || {
                HowManyConcentrations: { name: 0, status: 'Unverified' },
                volumes: [],
                concentrations: [],
                absoluteDoses: [],
                relativeDoses: [],
                methodsData: {},
                weight: getSpeciesWeightFromArticleData(specie)
            };
            
            // Ensure methodsData exists
            if (!speciesEntry.methodsData) {
                speciesEntry.methodsData = {};
            }

            // Handle method-specific HowManyConcentrations (e.g., HowManyConcentrations-Gavage)
            if (field.startsWith("HowManyConcentrations-")) {
                const methodName = field.replace("HowManyConcentrations-", "");
                const count = parseInt(value, 10) || 0;
                
                // Store the count for this method
                speciesEntry[field] = { name: count, status: 'Unverified' };
                
                // Initialize methodsData array for this method
                const existingData = speciesEntry.methodsData[methodName] || [];
                const newMethodData = [];
                
                for (let i = 0; i < count; i++) {
                    if (existingData[i]) {
                        newMethodData.push(existingData[i]);
                    } else {
                        newMethodData.push({
                            volume: { value: "", unit: "mL", status: "Unverified" },
                            concentration: { value: "", unit: "mg/L", status: "Unverified" },
                            absoluteDose: { value: "", unit: "mg/day", status: "Unverified" },
                            relativeDose: { value: "", unit: "mg/kg/day", status: "Unverified" }
                        });
                    }
                }
                
                speciesEntry.methodsData[methodName] = newMethodData;
                updatedSpeciesData[specie] = speciesEntry;
                return { ...prevData, speciesData: updatedSpeciesData };
            }
            
            // Handle method-specific volume/concentration updates
            // Field format: methodsData.MethodName[index].fieldName (e.g., methodsData.Gavage[0].volume)
            if (field.startsWith("methodsData.")) {
                const match = field.match(/methodsData\.(.+?)\[(\d+)\]\.(\w+)/);
                if (match) {
                    const [, methodName, indexStr, fieldName] = match;
                    const index = parseInt(indexStr, 10);
                    
                    if (!speciesEntry.methodsData[methodName]) {
                        speciesEntry.methodsData[methodName] = [];
                    }
                    
                    if (!speciesEntry.methodsData[methodName][index]) {
                        speciesEntry.methodsData[methodName][index] = {
                            volume: { value: "", unit: "mL", status: "Unverified" },
                            concentration: { value: "", unit: "mg/L", status: "Unverified" },
                            absoluteDose: { value: "", unit: "mg/day", status: "Unverified" },
                            relativeDose: { value: "", unit: "mg/kg/day", status: "Unverified" }
                        };
                    }
                    
                    // Update the specific field
                    speciesEntry.methodsData[methodName][index][fieldName] = {
                        ...speciesEntry.methodsData[methodName][index][fieldName],
                        ...value
                    };
                    
                    // Calculate doses for Gavage/OHW/HRS methods
                    const methodData = speciesEntry.methodsData[methodName][index];
                    const bodyWeight = speciesEntry.weight?.name || 75;
                    const weightUnit = speciesEntry.weight?.unit || 'kg';
                    
                    // Convert weight to kg
                    let weightInKg = bodyWeight;
                    switch (weightUnit) {
                        case 'g': weightInKg = bodyWeight / 1000; break;
                        case 'Lbs': weightInKg = bodyWeight * 0.453592; break;
                        default: weightInKg = bodyWeight; break;
                    }
                    
                    // Calculate absolute and relative doses if volume and concentration are present
                    if (methodData.volume?.value && methodData.concentration?.value) {
                        const volValue = parseFloat(methodData.volume.value) || 0;
                        const volUnit = methodData.volume.unit || "mL";
                        const concValue = parseFloat(methodData.concentration.value) || 0;
                        const concUnit = methodData.concentration.unit || "mg/L";
                        
                        // Convert volume to liters
                        let volInL = volUnit === "mL" ? volValue / 1000 : volValue;
                        
                        // Convert concentration to mg/L
                        let concInMgL = concValue;
                        switch (concUnit) {
                            case "mM": concInMgL = concValue * 2; break;
                            case "ppm": concInMgL = concValue; break;
                            case "ppb": concInMgL = concValue / 1000; break;
                            case "µM": concInMgL = concValue * 0.002; break;
                        }
                        
                        const absoluteDose = (volInL * concInMgL).toFixed(4);
                        const relativeDose = weightInKg > 0 ? (absoluteDose / weightInKg).toFixed(5) : "0";
                        
                        speciesEntry.methodsData[methodName][index].absoluteDose = {
                            value: absoluteDose,
                            unit: "mg/day",
                            status: "Unverified"
                        };
                        speciesEntry.methodsData[methodName][index].relativeDose = {
                            value: relativeDose,
                            unit: "mg/kg/day",
                            status: "Unverified"
                        };
                    }
                    
                    updatedSpeciesData[specie] = speciesEntry;
                    return { ...prevData, speciesData: updatedSpeciesData };
                }
            }

            // Legacy handling for non-method-specific fields
            if (field === "HowManyConcentrations") {
                const count = parseInt(value, 10) || 0;
                speciesEntry.HowManyConcentrations = { name: count, status: 'Unverified' };

                // Initialize arrays with status
                speciesEntry.volumes = Array.from({ length: count }, (_, index) => ({
                    value: speciesEntry.volumes?.[index]?.value || "",
                    unit: speciesEntry.volumes?.[index]?.unit || "mL",
                    status: speciesEntry.volumes?.[index]?.status || "Unverified"
                }));

                speciesEntry.concentrations = Array.from({ length: count }, (_, index) => ({
                    value: speciesEntry.concentrations?.[index]?.value || "",
                    unit: speciesEntry.concentrations?.[index]?.unit || "mg/L",
                    status: speciesEntry.concentrations?.[index]?.status || "Unverified"
                }));

                // Initialize calculated fields with status
                speciesEntry.absoluteDoses = Array.from({ length: count }, (_, index) => ({
                    value: speciesEntry.absoluteDoses?.[index]?.value || "",
                    unit: "mg/day",
                    status: speciesEntry.absoluteDoses?.[index]?.status || "Unverified"
                }));

                speciesEntry.relativeDoses = Array.from({ length: count }, (_, index) => ({
                    value: speciesEntry.relativeDoses?.[index]?.value || "",
                    unit: "mg/kg/day",
                    status: speciesEntry.relativeDoses?.[index]?.status || "Unverified"
                }));
            }
           else if (field.includes("volumes") || field.includes("concentrations")) {
    const [key, index] = field.match(/(\w+)\[(\d+)\]/).slice(1);
    const parsedIndex = parseInt(index, 10);

    // Ensure the array exists before accessing an index
    if (!Array.isArray(speciesEntry[key])) {
        speciesEntry[key] = [];
    }

    speciesEntry[key][parsedIndex] = {
        ...(speciesEntry[key][parsedIndex] || {
            value: "",
            unit: key === "volumes" ? "mL" : "mg/L",
            status: "Unverified"
        }),
        ...value,
        status: speciesEntry[key][parsedIndex]?.status || "Unverified"
    };
}

            // Calculations
            const convertToMgPerL = (val, unit) => {
                const numVal = parseFloat(val) || 0;
                const conversions = {
                    mM: numVal * 2,
                    ppm: numVal,
                    ppb: numVal / 1000,
                    µM: numVal * 0.002,
                    default: numVal
                };
                return conversions[unit] || conversions.default;
            };

            const bodyWeight = speciesEntry.weight?.name || 75;
            const weightUnit = speciesEntry.weight?.unit || 'kg';
            
            // Convert weight to kg for relative dose calculation
            let weightInKg = bodyWeight;
            switch (weightUnit) {
                case 'g':
                    weightInKg = bodyWeight / 1000;
                    break;
                case 'Lbs':
                    weightInKg = bodyWeight * 0.453592;
                    break;
                case 'kg':
                default:
                    weightInKg = bodyWeight;
                    break;
            }

            // Calculate absolute doses
            const absoluteDoses = Array.isArray(speciesEntry?.volumes) && Array.isArray(speciesEntry?.concentrations)
                ? speciesEntry.volumes.map((vol, idx) => {
                    if (!vol || !speciesEntry.concentrations[idx]) return 0;
                    
                    // Convert volume to liters
                    const volValue = parseFloat(vol.value) || 0;
                    let volInL = 0;
                    
                    switch (vol.unit) {
                        case "mL":
                            volInL = volValue / 1000;
                            break;
                        case "L":
                            volInL = volValue;
                            break;
                        case "µL":
                            volInL = volValue / 1000000;
                            break;
                        default:
                            volInL = volValue; // Assume L if unit not recognized
                    }
                    
                    const conc = speciesEntry.concentrations[idx] || { value: 0, unit: "mg/L" };
                    const concInMgL = convertToMgPerL(conc.value, conc.unit);
                    
                    // Calculate: volume (L) × concentration (mg/L) = mg/day
                    return volInL * concInMgL;
                })
                : [];

            // Calculate relative doses (mg/kg/day)
            const relativeDoses = absoluteDoses.map(dose =>
                weightInKg > 0 ? dose / weightInKg : 0
            );

            // Update calculated fields with status
            speciesEntry.absoluteDoses = absoluteDoses.map((dose, idx) => ({
                value: isNaN(dose) ? "" : dose.toFixed(2),
                unit: "mg/day",
                status: (Array.isArray(speciesEntry.absoluteDoses) && speciesEntry.absoluteDoses[idx]) ? speciesEntry.absoluteDoses[idx].status || "Unverified" : "Unverified"
            }));

            speciesEntry.relativeDoses = relativeDoses.map((dose, idx) => ({
                value: isNaN(dose) ? "" : dose.toFixed(2),
                unit: "mg/kg/day",
                status: (Array.isArray(speciesEntry.relativeDoses) && speciesEntry.relativeDoses[idx]) ? speciesEntry.relativeDoses[idx].status || "Unverified" : "Unverified"
            }));

            updatedSpeciesData[specie] = speciesEntry;

            return { ...prevData, speciesData: updatedSpeciesData };
        });
    };

    // const handleSpecificInputChange = (specie, value, field, unit) => {
    //     setFormData((prevData) => {
    //         const updatedSpeciesData = { ...prevData.speciesData };
    //         const speciesEntry = updatedSpeciesData[specie] || {};

    //         // Check if the field requires unit handling
    //         if (["FlowRateofHydrogen", "DurationFrequency", "IngestionDurationfrequency", "FrequencyCellCultureTissues", "DurationFrequencyCellCultureTissues"].includes(field)) {
    //             speciesEntry[field] = {
    //                 value, // Numeric value
    //                 unit: unit || speciesEntry[field]?.unit || "minutes", // Default unit if not provided
    //             };
    //         } else {
    //             // Fields without units
    //             speciesEntry[field] = value;
    //         }

    //         updatedSpeciesData[specie] = speciesEntry;

    //         return {
    //             ...prevData,
    //             speciesData: updatedSpeciesData,
    //         };
    //     });
    // };

    const handleSpecificInputChange = (specie, value, field, unit) => {
        setFormData((prevData) => {
            const updatedSpeciesData = { ...prevData.speciesData };
            const speciesEntry = updatedSpeciesData[specie] || {};

            // Common field structure with status
            const fieldStructure = {
                name: value,
                status: speciesEntry[field]?.status || "Unverified",
                ...(unit && { unit }) // Add unit only if present
            };

            // Special handling for fields with units
            const unitFields = [
                "FlowRateofHydrogen",
                "DurationFrequency",
                "IngestionDurationfrequency",
                "FrequencyCellCultureTissues",
                "DurationFrequencyCellCultureTissues"
            ];

            // Handle numInhalationConcentrations for any inhalation method
            // Supports both "numInhalationConcentrations" (legacy for "Inhalation") 
            // and "numInhalationConcentrations-{methodName}" for specific inhalation methods
            if (field === "numInhalationConcentrations" || field.startsWith("numInhalationConcentrations-")) {
                const count = parseInt(value, 10) || 0;
                
                // Determine the method name - either from the field suffix or default to "Inhalation"
                const methodName = field === "numInhalationConcentrations" 
                    ? "Inhalation" 
                    : field.replace("numInhalationConcentrations-", "");
                
                // Initialize methodsData if needed
                if (!speciesEntry.methodsData) {
                    speciesEntry.methodsData = {};
                }
                
                const existingData = Array.isArray(speciesEntry.methodsData[methodName]) 
                    ? speciesEntry.methodsData[methodName] 
                    : [];
                
                // Get existing wasOxyhydrogenUsed and deliveryMethod from first entry if available
                const existingWasOxyhydrogenUsed = existingData[0]?.wasOxyhydrogenUsed;
                const existingDeliveryMethod = existingData[0]?.deliveryMethod;
                
                const newMethodData = [];
                
                for (let i = 0; i < count; i++) {
                    if (existingData[i]) {
                        newMethodData.push(existingData[i]);
                    } else {
                        newMethodData.push({
                            percentPurity: { value: "", status: "Unverified" },
                            flowRate: { value: "", unit: "mL/min", status: "Unverified" },
                            estimatedFiH2: { value: "", status: "Unverified" },
                            frequency: { value: "", status: "Unverified" },
                            duration: { value: "", unit: "minutes", status: "Unverified" },
                            inhalationDuration: { value: "", unit: "minutes", status: "Unverified" },
                            wasOxyhydrogenUsed: existingWasOxyhydrogenUsed || { value: "", status: "Unverified" },
                            deliveryMethod: existingDeliveryMethod || { value: "", status: "Unverified" }
                        });
                    }
                }
                
                speciesEntry.methodsData[methodName] = newMethodData;
                
                speciesEntry[field] = { ...fieldStructure, value };
            } else if (unitFields.includes(field)) {
                speciesEntry[field] = {
                    value: parseFloat(value) || 0,
                    unit: unit || speciesEntry[field]?.unit || "minutes",
                    status: speciesEntry[field]?.status || "Unverified"
                };
            } else {
                // Apply to all fields: preserve existing status or set Unverified
                speciesEntry[field] = field === "wasOxyhydrogenUsed"
                    ? { name: value, status: "Unverified" }
                    : { ...fieldStructure, value };
            }

            updatedSpeciesData[specie] = speciesEntry;
            return { ...prevData, speciesData: updatedSpeciesData };
        });
    };

  const handleInhalationInputChange = (specie, index, field, value, method = "Inhalation") => {
    setFormData((prevData) => {
        const prevSpeciesData = prevData.speciesData[specie] || {};
        
        // Initialize methodsData if needed
        const methodsData = { ...(prevSpeciesData.methodsData || {}) };
        
        // Ensure methodData is an array (preserve wasOxyhydrogenUsed and deliveryMethod at method level)
        let methodDataArray = Array.isArray(methodsData[method]) ? [...methodsData[method]] : [];
        const methodLevelData = !Array.isArray(methodsData[method]) ? { ...methodsData[method] } : {};
        
        if (!methodDataArray[index]) {
            // Get existing wasOxyhydrogenUsed and deliveryMethod from first entry if available
            const existingWasOxyhydrogenUsed = methodDataArray[0]?.wasOxyhydrogenUsed;
            const existingDeliveryMethod = methodDataArray[0]?.deliveryMethod;
            
            methodDataArray[index] = {
                percentPurity: { value: "", status: "Unverified" },
                flowRate: { value: "", unit: "mL/min", status: "Unverified" },
                estimatedFiH2: { value: "", status: "Unverified" },
                frequency: { value: "", status: "Unverified" },
                duration: { value: "", unit: "minutes", status: "Unverified" },
                inhalationDuration: { value: "", unit: "minutes", status: "Unverified" },
                wasOxyhydrogenUsed: existingWasOxyhydrogenUsed || { value: "", status: "Unverified" },
                deliveryMethod: existingDeliveryMethod || { value: "", status: "Unverified" }
            };
        }
        
        // Handle unit changes
        if (field === 'unitFlowRate') {
            methodDataArray[index].flowRate = { 
                ...methodDataArray[index].flowRate, 
                unit: value 
            };
        } else if (field === 'unitDuration') {
            methodDataArray[index].duration = { 
                ...methodDataArray[index].duration, 
                unit: value 
            };
            methodDataArray[index].inhalationDuration = { 
                ...methodDataArray[index].inhalationDuration, 
                unit: value 
            };
        } else if (field === 'inhalationDuration') {
            // Sync inhalationDuration with duration
            const currentUnit = methodDataArray[index].inhalationDuration?.unit || methodDataArray[index].duration?.unit || "minutes";
            methodDataArray[index].inhalationDuration = { 
                value: value, 
                unit: currentUnit,
                status: "Unverified"
            };
            methodDataArray[index].duration = { 
                value: value, 
                unit: currentUnit,
                status: "Unverified"
            };
        } else {
            // Update the changed field with value property
            methodDataArray[index][field] = { 
                value: value, 
                status: "Unverified",
                ...(methodDataArray[index][field]?.unit ? { unit: methodDataArray[index][field].unit } : {})
            };
        }
        
        // Automatically calculate FiH2 ONLY if flowRate or percentPurity changed
        if (field === 'flowRate' || field === 'percentPurity') {
            const concentration = methodDataArray[index];
            const flowRate = parseFloat(concentration.flowRate?.value);
            const purity = parseFloat(concentration.percentPurity?.value);
            const totalInspiratoryFlow = 8000;

            if (!isNaN(flowRate) && !isNaN(purity)) {
                const fiH2 = ((flowRate / totalInspiratoryFlow) * (purity)).toFixed(2);
                methodDataArray[index].estimatedFiH2 = {
                    value: fiH2,
                    status: "Unverified",
                };
            }
        }
        
        // Store array with method-level properties preserved
        methodsData[method] = methodDataArray;
        // Also preserve wasOxyhydrogenUsed and deliveryMethod at method level
        if (methodLevelData.wasOxyhydrogenUsed) {
            methodsData[method].wasOxyhydrogenUsed = methodLevelData.wasOxyhydrogenUsed;
        }
        if (methodLevelData.deliveryMethod) {
            methodsData[method].deliveryMethod = methodLevelData.deliveryMethod;
        }

        return {
            ...prevData,
            speciesData: {
                ...prevData.speciesData,
                [specie]: {
                    ...prevSpeciesData,
                    methodsData: methodsData,
                },
            },
        };
    });
};







    const handleMethodChange = (speciesName, selectedMethods) => {
        if (speciesName.toLowerCase() === 'plant' || speciesName.toLowerCase() === 'plants') {
            setFormData((prev) => ({
                ...prev,
                speciesData: {
                    ...prev.speciesData,
                    [speciesName]: {
                        ...prev.speciesData[speciesName],
                        methodsText: selectedMethods, // Update text value for plants
                    },
                },
            }));
        } else {
            // Ensure selectedMethods is always an array
            const methodsArray = Array.isArray(selectedMethods) ? selectedMethods : [selectedMethods];
            setFormData((prev) => ({
                ...prev,
                speciesData: {
                    ...prev.speciesData,
                    [speciesName]: {
                        ...prev.speciesData[speciesName],
                        methods: methodsArray, // Update methods with the selected values
                    },
                },
            }));
            // Update Redux states for each method dynamically
            if (methodsArray.includes("Inhalation")) {
                dispatch(setShowInhalationStatus(true));
            } else {
                dispatch(setShowInhalationStatus(false));
            }
            if (methodsArray.includes("Oral Hydrogen Water") || methodsArray.includes("Gavage") || methodsArray.includes("Hydrogen-rich Saline")) {
                dispatch(setShowConcernReportStatus(true));
            } else {
                dispatch(setShowConcernReportStatus(false));
            }
        }
    };

    const InfoTooltip = ({ message, width }) => (
        <div className="relative group">
            <FaInfoCircle className="ml-2 cursor-pointer" color={colorTheme.primary} />
            <div
                style={{
                    width: width || '300px',
                    whiteSpace: 'pre-wrap',
                    backgroundColor: '#333',
                    color: '#e0e0e0',
                    fontWeight: 'normal',     // Softer text weight for clarity
                    border: '1px solid #555', // Border for subtle contrast
                    padding: '10px',          // More padding for readability
                    borderRadius: '5px',      // Rounded corners for visual comfort
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Softer shadow for subtle lift,
                    fontSize: '14px'
                }}
                className="absolute bottom-full mb-2 hidden group-hover:block"
            >
                {message}
            </div>
        </div>
    );

    const handleAddMethods = (newMethods) => {
        const obj = { name: newMethods };
        dispatch(add_methods_service_auth(obj))
            .then(() => {
                const updatedResearchTopicList = [...get_method_data.methods, { name: newMethods }];
                handleInputChange([...formData.methodOfAdmin, newMethods], 'researchtopic');
                dispatch(get_methods_service_auth());
            })
            .catch(error => {
                console.error('Error adding research topic:', error);
            });
    };


    const openConcentrationHandle = (specie) => {
        setShowConcentrationForm((prevForms) => ({
            ...prevForms,
            [specie]: !prevForms[specie], // Toggle the specific species' concentration form
        }));
    };
    const openSimpleConcentrationHandle = () => {
        setShowConcentrationForm(prev => ({
            ...prev,
            simple: !prev.simple
        }));
    };

    const openInhalationHandle = () => {
        setIsInhalationInformation((prev) => !prev)
    };
    const openIngestionHandle = () => {
        setIsIngestionInformation((prev) => !prev)

    };
    const openCellCultureTissuesHandle = () => {
        setIsCellCultureTissuesInformation((prev) => !prev)

    };

    const toggleInhalationInfo = (specie) => {
        setFormData((prev) => ({
            ...prev,
            speciesData: {
                ...prev.speciesData,
                [specie]: {
                    ...prev.speciesData[specie],
                    isInhalationOpen: !prev.speciesData[specie]?.isInhalationOpen, // Toggle state
                },
            },
        }));
    };

    const toggleCellTissueInfo = (specie) => {
        setFormData((prevData) => ({
            ...prevData,
            speciesData: {
                ...prevData.speciesData,
                [specie]: {
                    ...prevData.speciesData[specie],
                    isCellTissueOpen: !prevData.speciesData[specie]?.isCellTissueOpen,
                },
            },
        }));
    };

    const toggleIngestionInfo = (specie) => {
        setFormData((prevData) => ({
            ...prevData,
            speciesData: {
                ...prevData.speciesData,
                [specie]: {
                    ...prevData.speciesData[specie],
                    isIngestionOpen: !prevData.speciesData[specie]?.isIngestionOpen,
                },
            },
        }));
    };



    const handleDraftSave = () => {
        setIsDraft(true); // Mark action as draft
        onDraftSubmit(formData)
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // If "Save as Draft" is clicked
        if (isDraft) {
            setIsDraft(false);
            return;
        }
        onSubmit(formData);
        // const optionalFields = [
        //     // 'methodOfAdmin',
        // ];

        // const missing = optionalFields.filter((field) => !formData[field]);

        // if (missing.length > 0) {
        //     setMissingFields(missing);
        //     // setIsConfirmationModalVisible(false);
        // } else {
        //     onSubmit(formData);
        //     // console.log("ResearchData", formData);

        // }
    };

    const confirmSubmit = () => {
        onSubmit(formData);
        // console.log("formData", formData);

        setIsConfirmationModalVisible(false);
    };

    // const fieldNameMappings = {
    //     methodOfAdmin: "Method of Administration",
    // };


    const unitOptions = ["mg/L", "mg/day", "mM", "ppm", "ppb", "µM", "L"];
    const weightUnitOptions = ["g", "kg", "Lbs"];


    useEffect(() => {
        // console.log("runing...");
    }, [ShowDefault])


    useEffect(() => {
        if (species?.specie) {
            setFormData((prev) => ({
                ...prev,
                speciesData: species.specie.reduce((acc, specie) => {
                    acc[specie] = { isOpen: false, methods: [] };
                    return acc;
                }, {}),
            }));
        }
    }, [species]);


    const [statusVolume, setStatusVolume] = useState({});
    const [statusConcentration, setStatusConcentration] = useState({});

    console.log("statusVolume", statusVolume);
    useEffect(() => {
        
        console.log("statusVolume", statusVolume);
        console.log("statusConcentration", statusConcentration);

    })

    const handleVolumeChange = (specie, index, value) => {
        setStatusVolume((prev) => ({
            ...prev,
            [specie]: {
                ...prev[specie],
                [index]: value,
            },
        }));
    };


    const handleConcentrationChange = (specie, index, value) => {
        setStatusConcentration((prev) => ({
            ...prev,
            [specie]: {
                ...prev[specie],
                [index]: value,
            },
        }));
    };

    const handleStatusChange = (fieldName, newStatus) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: Array.isArray(prev[fieldName])
                ? prev[fieldName].map(item => ({ ...item, status: newStatus }))
                : { ...prev[fieldName], status: newStatus },
        }));
    };

    const handleStatusChangeMulti = (field, status, specie) => {
        console.log("Before update:", formData.speciesData[specie][field]);
        setFormData(prevState => ({
            ...prevState,
            speciesData: {
                ...prevState.speciesData,
                [specie]: {
                    ...prevState.speciesData[specie],
                    [field]: {
                        ...prevState.speciesData[specie][field],
                        status: status
                    }
                }
            }
        }));
        console.log("After update:", formData.speciesData[specie][field]);
    };

    const handleStatusChangeInhalation = (methodOrLegacy, status, specie, index, fieldName) => {
        setFormData(prevState => {
            const prevSpeciesData = prevState.speciesData[specie] || {};
            
            // Check if it's a method name (for methodsData) or legacy "inhalationConcentrations"
            if (methodOrLegacy === "inhalationConcentrations") {
                // Legacy support - update old inhalationConcentrations array
                return {
                    ...prevState,
                    speciesData: {
                        ...prevState.speciesData,
                        [specie]: {
                            ...prevSpeciesData,
                            inhalationConcentrations: (prevSpeciesData.inhalationConcentrations || []).map((item, i) =>
                                i === index ? {
                                    ...item,
                                    [fieldName]: {
                                        ...item[fieldName],
                                        status: status
                                    }
                                } : item
                            )
                        }
                    }
                };
            } else {
                // New structure - update methodsData[method][index][fieldName]
                const methodsData = { ...(prevSpeciesData.methodsData || {}) };
                const methodData = [...(methodsData[methodOrLegacy] || [])];
                
                if (methodData[index]) {
                    methodData[index] = {
                        ...methodData[index],
                        [fieldName]: {
                            ...methodData[index][fieldName],
                            status: status
                        }
                    };
                }
                
                methodsData[methodOrLegacy] = methodData;
                
                return {
                    ...prevState,
                    speciesData: {
                        ...prevState.speciesData,
                        [specie]: {
                            ...prevSpeciesData,
                            methodsData: methodsData
                        }
                    }
                };
            }
        });
    };

    const handleStatusChangeGavage = (field, status, specie, index) => {
        setFormData(prevState => ({
            ...prevState,
            speciesData: {
                ...prevState.speciesData,
                [specie]: {
                    ...prevState.speciesData[specie],
                    volumes: prevState.speciesData[specie].volumes.map((item, i) =>
                        i === index ? {
                            ...item,
                            status: status  // सीधे status अपडेट करें
                        } : item
                    )
                }
            }
        }));
    };

    const handleStatusChangeConcentration = (status, specie, index) => {
        setFormData(prevState => ({
            ...prevState,
            speciesData: {
                ...prevState.speciesData,
                [specie]: {
                    ...prevState.speciesData[specie],
                    concentrations: prevState.speciesData[specie].concentrations.map((item, i) =>
                        i === index ? {
                            ...item,
                            status: status  // सिर्फ status अपडेट करें
                        } : item
                    )
                }
            }
        }));
    };

    // Absolute Dose
    const handleStatusChangeAbsoluteDose = (status, specie, index) => {
        setFormData(prevState => ({
            ...prevState,
            speciesData: {
                ...prevState.speciesData,
                [specie]: {
                    ...prevState.speciesData[specie],
                    absoluteDoses: prevState.speciesData[specie].absoluteDoses.map((item, i) =>
                        i === index ? {
                            ...item,
                            status: status  // सिर्फ status अपडेट करें
                        } : item
                    )
                }
            }
        }));
    };

    // Relative Dose 
    const handleStatusChangeRelativeDose = (status, specie, index) => {
        setFormData(prevState => ({
            ...prevState,
            speciesData: {
                ...prevState.speciesData,
                [specie]: {
                    ...prevState.speciesData[specie],
                    relativeDoses: prevState.speciesData[specie].relativeDoses.map((item, i) =>
                        i === index ? {
                            ...item,
                            status: status  // सिर्फ status अपडेट करें
                        } : item
                    )
                }
            }
        }));
    };


    const handleStatusChangeSimpleInhalation = (field, status, index) => {
        setFormData((prevState) => {
            const updatedInhalationConcentrations = [...prevState.inhalationConcentrations];

            // Ensure the specific inhalation concentration exists
            if (!updatedInhalationConcentrations[index]) {
                updatedInhalationConcentrations[index] = {};
            }

            // Update the status for the specific field
            updatedInhalationConcentrations[index] = {
                ...updatedInhalationConcentrations[index],
                [field]: {
                    ...updatedInhalationConcentrations[index][field],
                    status: status,
                },
            };

            return {
                ...prevState,
                inhalationConcentrations: updatedInhalationConcentrations,
            };
        });
    };


    const handleStatusSimpleConcentration = (field, status, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) =>
                i === index
                    ? {
                        ...item,
                        value: {
                            ...item.value,
                            status: status,
                        }
                    }
                    : item
            )
        }));
    };

    useEffect(() => {   
        console.log("formData updated:", formData);
    }
, [formData]);





    // Add this function at the beginning of your component or in a utils file
    const normalizeFormValues = (data) => {
        if (!data) return {};

        const result = {};

        // Normalize Video_WebpageLink
        if (result.Video_WebpageLink !== undefined) {
            if (result.Video_WebpageLink === null) {
                result.Video_WebpageLink = { name: '', status: 'Unverified' };
            }
            else if (typeof result.Video_WebpageLink === 'boolean') {
                result.Video_WebpageLink = {
                    name: result.Video_WebpageLink ? 'True' : 'False',
                    status: 'Unverified'
                };
            }
            else if (typeof result.Video_WebpageLink === 'object' && result.Video_WebpageLink !== null) {
                if (typeof result.Video_WebpageLink.name === 'boolean') {
                    result.Video_WebpageLink.name = result.Video_WebpageLink.name ? 'True' : 'False';
                }
            }
        }

        // Normalize commercialProduct - convert boolean to 'Yes'/'No'
        if (result.commercialProduct !== undefined) {
            if (result.commercialProduct === null) {
                result.commercialProduct = { name: '', status: 'Unverified' };
            }
            else if (typeof result.commercialProduct === 'boolean') {
                result.commercialProduct = {
                    name: result.commercialProduct ? 'Yes' : 'No',
                    status: 'Unverified'
                };
            }
            else if (typeof result.commercialProduct === 'object' && result.commercialProduct !== null) {
                if (typeof result.commercialProduct.name === 'boolean') {
                    result.commercialProduct.name = result.commercialProduct.name ? 'Yes' : 'No';
                }
            }
        }

        // Iterate through each key in the data
        Object.keys(data).forEach(key => {
            const value = data[key];

            // Handle null values
            if (value === null) {
                result[key] = { name: '', status: 'Unverified' };
                return;
            }

            // Handle boolean values
            if (typeof value === 'boolean') {
                result[key] = { name: value ? 'True' : 'False', status: 'Unverified' };
                return;
            }

            // Handle objects with name property
            if (typeof value === 'object' && value !== null) {
                // If name property is a boolean, convert it to 'True'/'False'
                if (typeof value.name === 'boolean') {
                    result[key] = {
                        name: value.name ? 'True' : 'False',
                        status: value.status || 'Unverified'
                    };
                }
                // Handle the special case for isERW which has a nested structure
                else if (key === 'isERW' && value.name && typeof value.name.erw === 'boolean') {
                    result[key] = {
                        name: value.name.erw ? 'True' : 'False',
                        status: value.status || 'Unverified'
                    };
                }
                // Keep other objects as they are
                else {
                    result[key] = value;
                }
                return;
            }

            // Keep other values as they are
            result[key] = value;
        });

        return result;
    };

    // Then, use this function when initializing your form data in useEffect:
    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            // Apply normalization to the whole object
            const normalizedData = normalizeFormValues(initialData);
            setFormData(normalizedData);

            // Set component state based on normalized values
            setShowPH(normalizedData.isERW?.name === 'True');
            setShowComparisonDetail(normalizedData.drugComparison?.name === 'True');
            setShowPharmacokineticsDescription(normalizedData.pharmacokinetics?.name === 'True');
            setCompMethodAdmin(normalizedData.CompMethodAdmin?.name === 'True');
            setDoseConcentrationComparison(normalizedData.doseComparison?.name === 'True');
        }
    }, [initialData]);



    // console.log("formData", formData);


    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-6">
            <h1 className="text-2xl font-bold mb-6">
                {/* {initialData && Object.keys(initialData).length > 0 ? 'Edit Article Specific Information' : 'Article Specific Information'} */}
                Article Specific Information
            </h1>
            <form onSubmit={handleSubmit}>


  
            <div className="container text-sm pr-4 text-gray-500 mt-1  mb-2 font-extrabold">
              Note: Not required for review / non-experimental articles
            </div>
          
                <Accordion
                    title="Hydrogen Administration Details"
                    isOpen={isResearchBio}
                    onToggle={() => setIsResearchBio((prev) => !prev)}

                >

                    {
                        speciesDataExists ? (
                            Object.keys(formData.speciesData).map((specie, index) => {
                                console.log("=== RENDER DEBUG ===");
                                console.log("speciesDataExists:", speciesDataExists);
                                console.log("formData.speciesData keys:", Object.keys(formData.speciesData));
                                console.log("Current specie being rendered:", specie);
                                console.log("speciesTypeGetting.speciesDetails keys:", Object.keys(speciesTypeGetting?.speciesDetails || {}));
                                console.log("===================");

                                const specieData = formData.speciesData[specie];



                                // Remove any unit from bodyWeight, keep only the number
                                let bodyWeight = (
    specieData?.weight && typeof specieData.weight === 'object' && 'name' in specieData.weight
        ? specieData.weight.name
        : specieData?.weight
) || calculateSpeciesWeightNew(specie, speciesWeight);

                                 console.log("bodyWeight", bodyWeight);

                                const weightObj = formData.speciesData?.[specie]?.weight;
                                let weightUnit = (weightObj && typeof weightObj === 'object' && 'unit' in weightObj && weightObj.unit != null
                                    ? weightObj.unit
                                    : null) ||
                                    formData.bodyWeight?.unit;
                                
                                // If no unit is found, use kg for humans and g for all other species
                                if (!weightUnit || weightUnit === "") {
                                    if (specie.toLowerCase().includes("human")) {
                                        weightUnit = "kg";
                                    } else {
                                        weightUnit = "g";
                                    }
                                }
                                
                                // Normalize weight unit for display consistency
                                const displayWeightUnit = weightUnit === "kilograms" ? "kg" : weightUnit;
                                
                                const title =
                                  specie.toLowerCase() === 'plant' || specie.toLowerCase() === 'plants'
                                    ? `Methods of Administration For ${specie}`
                                    : `Methods of Administration For ${specie} (Weight of Species: ${bodyWeight} ${displayWeightUnit})`;

                                const handleWeightChange = (newWeight) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        speciesData: {
                                            ...prev.speciesData,
                                            [specie]: {
                                                ...prev.speciesData[specie],
                                                weight: {
                                                    name: newWeight,
                                                    status: prev.speciesData[specie]?.weight?.status || 'Unverified',
                                                    unit: prev.speciesData[specie]?.weight?.unit || 'g'
                                                }
                                            },
                                        },
                                    }));
                                };

                                const handleSpeciesWeightUnitChange = (newUnit) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        speciesData: {
                                            ...prev.speciesData,
                                            [specie]: {
                                                ...prev.speciesData[specie],
                                                weight: {
                                                    ...prev.speciesData[specie]?.weight,
                                                    unit: newUnit
                                                }
                                            },
                                        },
                                    }));
                                };

                                const handleSpeciesWeightStatusChange = (newStatus) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        speciesData: {
                                            ...prev.speciesData,
                                            [specie]: {
                                                ...prev.speciesData[specie],
                                                weight: {
                                                    ...prev.speciesData[specie]?.weight,
                                                    status: newStatus
                                                }
                                            },
                                        },
                                    }));
                                };


                                return (
                                    
                                    <Accordion
                                        defaultStyle={true}
                                        key={index}
                                        title={title}
                                        isOpen={formData.speciesData[specie].isOpen}
                                        onToggle={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                speciesData: {
                                                    ...prev.speciesData,
                                                    [specie]: {
                                                        ...prev.speciesData[specie],
                                                        isOpen: !prev.speciesData[specie].isOpen,
                                                    },
                                                },
                                            }))
                                        }
                                    >

                                        {/* Methods of Administration */}
                                        {((specie || '').toLowerCase() === 'plant' || (specie || '').toLowerCase() === 'plants') ? (
                                          <div style={{ marginBottom: '16px' }}>
                                            <label style={{ fontWeight: 500 }}>Methods of Administration</label>
                                            <input
                                              type="text"
                                              name={`methods_${specie}`}
                                              value={formData.speciesData?.[specie]?.methodsText || ''}
                                              onChange={e => handleMethodChange(specie, e.target.value)}
                                              className="ant-input"
                                              placeholder="Enter methods of administration"
                                              style={{ width: '100%', marginTop: 8 }}
                                            />
                                          </div>
                                        ) : (
                                          <CustomCreatableSelect
                                            isCreate={true}
                                            label="Methods of Administration"
                                            name={`methods`}
                                            options={
                                              (get_method_data?.methods
                                                ?.map((method) => method.name)
                                                .filter(
                                                  (name) =>
                                                    !((specie || '').toLowerCase() === 'plant' ||
                                                      (specie || '').toLowerCase() === 'plants') ||
                                                    name.toLowerCase() !== 'gavage'
                                                ) || [])
                                                .sort((a, b) => a.localeCompare(b))
                                            }
                                            value={formData.speciesData?.[specie]?.methods || []}
                                            onChange={(selected) => handleMethodChange(specie, selected)}
                                            isMulti
                                          />
                                          
                                          
                                        )}

                                        {/* Dynamic Fields for Methods */}

                                        {/* Inhalation - OLD COMBINED SECTION (HIDDEN - replaced by separate tabs below) */}
                                        {false && formData.speciesData?.[specie]?.methods?.includes("Inhalation") && (
                                            <>
                                                <CustomCreatableSelect
                                                    isCreate={false}
                                                    label="Was Oxyhydrogen used?"
                                                    name={`wasOxyhydrogenUsed_${specie}`}
                                                    options={["Yes", "No"]}
                                                    showNaOption={false}
                                                    value={formData.speciesData?.[specie]?.wasOxyhydrogenUsed || ""}
                                                    onChange={(value) => handleSpecificInputChange(specie, value, "wasOxyhydrogenUsed")}

                                                    isSpecialAction={isSpecialAction}
                                                    customStatusComponent={
                                                        <div className="flex items-center space-x-4">
                                                            <label className="flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    name={`oxyhydrogen-${specie}-status`}
                                                                    value="Verified"
                                                                    checked={formData.speciesData?.[specie]?.wasOxyhydrogenUsed?.status === "Verified"}
                                                                    onChange={() => handleStatusChangeMulti("wasOxyhydrogenUsed", "Verified", specie)}
                                                                    className="mr-1"
                                                                />
                                                                <span>Verified</span>
                                                            </label>
                                                            <label className="flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    name={`oxyhydrogen-${specie}-status`}
                                                                    value="Unverified"
                                                                    checked={formData.speciesData?.[specie]?.wasOxyhydrogenUsed?.status === "Unverified"}
                                                                    onChange={() => handleStatusChangeMulti("wasOxyhydrogenUsed", "Unverified", specie)}
                                                                    className="mr-1"
                                                                />
                                                                <span>Unverified</span>
                                                            </label>
                                                        </div>
                                                    }
                                                />

                                                <CustomCreatableSelect
                                                    isCreate={true}
                                                    label="Delivery Method"
                                                    name={`deliveryMethod_${specie}`}
                                                    options={["nasal cannula", "mask", "chamber", "ventilator", "tube", "bag", "room air", "endotracheal tube", "tracheostomy", "face tent", "oxygen hood", "nebulizer",  "bubble system", "sealed container", "exposure box", "inhalation box", "breathing circuit", "anesthesia circuit", "CPAP", "BiPAP", "mechanical ventilation"]}
                                                    showNaOption={false}
                                                    value={formData.speciesData?.[specie]?.deliveryMethod || ""}
                                                    onChange={(value) => handleSpecificInputChange(specie, value, "deliveryMethod")}
                                                    InfoTooltip={
                                                        <InfoTooltip message="Choose the delivery method used in the study" />
                                                    }
                                                    isSpecialAction={isSpecialAction}
                                                    customStatusComponent={
                                                        <div className="flex items-center space-x-4">
                                                            <label className="flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    name={`deliveryMethod-${specie}-status`}
                                                                    value="Verified"
                                                                    checked={formData.speciesData?.[specie]?.deliveryMethod?.status === "Verified"}
                                                                    onChange={() => handleStatusChangeMulti("deliveryMethod", "Verified", specie)}
                                                                    className="mr-1"
                                                                />
                                                                <span>Verified</span>
                                                            </label>
                                                            <label className="flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    name={`deliveryMethod-${specie}-status`}
                                                                    value="Unverified"
                                                                    checked={formData.speciesData?.[specie]?.deliveryMethod?.status === "Unverified"}
                                                                    onChange={() => handleStatusChangeMulti("deliveryMethod", "Unverified", specie)}
                                                                    className="mr-1"
                                                                />
                                                                <span>Unverified</span>
                                                            </label>
                                                        </div>
                                                    }
                                                />

                                                <div className="border border-gray-300 rounded-lg shadow-sm mb-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleInhalationInfo(specie)}
                                                        className="w-full text-left px-4 py-2 flex justify-between items-center bg-blue-100 rounded-t-lg hover:bg-blue-200 focus:outline-none"
                                                        style={{ color: colorTheme.primary, fontWeight: "bold" }}
                                                    >
                                                        <span>{`Inhalation Concentration for ${specie}`}</span>
                                                        <span>{formData.speciesData[specie]?.isInhalationOpen ? "-" : "+"}</span>
                                                    </button>

                                                    {formData.speciesData[specie]?.isInhalationOpen && (
                                                        <div className="px-4 py-2">
                                                            <Input
                                                                label="How many unique concentrations/flow rates/percentages were used in this study?"
                                                                name={`numInhalationConcentrations_${specie}`}
                                                                value={formData.speciesData?.[specie]?.numInhalationConcentrations?.name || ""}
                                                                onChange={(value) => handleSpecificInputChange(specie, value, "numInhalationConcentrations")}

                                                                isSpecialAction={isSpecialAction}
                                                                customStatusComponent={
                                                                    <div className="flex items-center space-x-4">
                                                                        <label className="flex items-center">
                                                                            <input
                                                                                type="radio"
                                                                                name={`numInhalationConcentrations-${specie}-status`}
                                                                                value="Verified"
                                                                                checked={formData.speciesData?.[specie]?.numInhalationConcentrations?.status === "Verified"}
                                                                                onChange={() => handleStatusChangeMulti("numInhalationConcentrations", "Verified", specie)}
                                                                                className="mr-1"
                                                                            />
                                                                            <span>Verified</span>
                                                                        </label>
                                                                        <label className="flex items-center">
                                                                            <input
                                                                                type="radio"
                                                                                name={`numInhalationConcentrations-${specie}-status`}
                                                                                value="Unverified"
                                                                                checked={formData.speciesData?.[specie]?.numInhalationConcentrations?.status === "Unverified"}
                                                                                onChange={() => handleStatusChangeMulti("numInhalationConcentrations", "Unverified", specie)}
                                                                                className="mr-1"
                                                                            />
                                                                            <span>Unverified</span>
                                                                        </label>
                                                                    </div>
                                                                }

                                                            />


                                                            {formData.speciesData?.[specie]?.numInhalationConcentrations?.name &&
                                                                Array.from({ length: formData.speciesData[specie]?.numInhalationConcentrations.name || 0 }, (_, i) => (
                                                                    <div key={i} className="inhalation-concentration-block border rounded-lg p-4 mb-4 shadow-sm">
                                                                        <h3 className="text-lg font-bold mb-4">Inhalation Concentration {i + 1}</h3>

                                                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                                                            <div>
                                                                                <Input
                                                                                    label="Percent Purity"
                                                                                    name={`inhalationConcentration_${specie}_${i}_percentPurity`}
                                                                                    value={
                                                                                        formData.speciesData[specie]?.methodsData?.["Inhalation"]?.[i]?.percentPurity?.value
                                                                                            ? formData.speciesData[specie].methodsData["Inhalation"][i].percentPurity.value.toString().replace(/%/g, '')
                                                                                            : ""
                                                                                    }
                                                                                    onChange={(value) => {
                                                                                        const cleanValue = value.replace(/%/g, '');
                                                                                        if (cleanValue === '' || /^(\d+)?(\.\d*)?$/.test(cleanValue)) {
                                                                                            handleInhalationInputChange(specie, i, "percentPurity", cleanValue, "Inhalation");
                                                                                        }
                                                                                    }}
                                                                                    InfoTooltip={
                                                                                        <InfoTooltip message="Indicate the percentage of hydrogen purity used in the inhalation method, as stated in the article. Enter the percentage as a numerical value (e.g., 99%, 2.5%)." />
                                                                                    }
                                                                                    isSpecialAction={isSpecialAction}
                                                                                    customStatusComponent={
                                                                                        <div className="flex items-center space-x-4">
                                                                                            <label className="flex items-center">
                                                                                                <input
                                                                                                    type="radio"
                                                                                                    name={`percentPurity-status-${specie}-${i}`}
                                                                                                    value="Verified"
                                                                                                    checked={formData.speciesData[specie]?.methodsData?.["Inhalation"]?.[i]?.percentPurity?.status === "Verified"}
                                                                                                    onChange={() => handleStatusChangeInhalation("Inhalation", "Verified", specie, i, "percentPurity")}
                                                                                                    className="mr-1"
                                                                                                />
                                                                                                <span>Verified</span>
                                                                                            </label>
                                                                                            <label className="flex items-center">
                                                                                                <input
                                                                                                    type="radio"
                                                                                                    name={`percentPurity-status-${specie}-${i}`}
                                                                                                    value="Unverified"
                                                                                                    checked={formData.speciesData[specie]?.methodsData?.["Inhalation"]?.[i]?.percentPurity?.status === "Unverified"}
                                                                                                    onChange={() => handleStatusChangeInhalation("Inhalation", "Unverified", specie, i, "percentPurity")}
                                                                                                    className="mr-1"
                                                                                                />
                                                                                                <span>Unverified</span>
                                                                                            </label>
                                                                                        </div>
                                                                                    }
                                                                                />



                                                                            </div>

                                                                            <div>
                                                                                <ReuseableInput
                                                                                    label="Flow Rate of Hydrogen"
                                                                                    type="number"
                                                                                    name={`inhalationConcentration_${specie}_${i}_flowRate`}
                                                                                    value={formData.speciesData[specie]?.methodsData?.["Inhalation"]?.[i]?.flowRate?.value || ""}
                                                                                    onChange={(value) => handleInhalationInputChange(specie, i, "flowRate", value, "Inhalation")}
                                                                                    unit={formData.speciesData[specie]?.methodsData?.["Inhalation"]?.[i]?.flowRate?.unit || "mL/min"}
                                                                                    onUnitChange={(newUnit) => handleInhalationInputChange(specie, i, "unitFlowRate", newUnit, "Inhalation")}
                                                                                    options={["mL/min"]}
                                                                                    InfoTooltip={
                                                                                        <InfoTooltip message="Specifies the rate at which hydrogen gas is delivered to the subject, measured in milliliters per minute (mL/min)" />
                                                                                    }
                                                                                    isSpecialAction={isSpecialAction}
                                                                                    customStatusComponent={
                                                                                        <div className="flex items-center space-x-4">
                                                                                            <label className="flex items-center">
                                                                                                <input
                                                                                                    type="radio"
                                                                                                    name={`flowRate-status-${specie}-${i}`}
                                                                                                    value="Verified"
                                                                                                    checked={formData.speciesData[specie]?.methodsData?.["Inhalation"]?.[i]?.flowRate?.status === "Verified"}
                                                                                                    onChange={() => handleStatusChangeInhalation("Inhalation", "Verified", specie, i, "flowRate")}
                                                                                                    className="mr-1"
                                                                                                />
                                                                                                <span>Verified</span>
                                                                                            </label>
                                                                                            <label className="flex items-center">
                                                                                                <input
                                                                                                    type="radio"
                                                                                                    name={`flowRate-status-${specie}-${i}`}
                                                                                                    value="Unverified"
                                                                                                    checked={formData.speciesData[specie]?.methodsData?.["Inhalation"]?.[i]?.flowRate?.status === "Unverified"}
                                                                                                    onChange={() => handleStatusChangeInhalation("Inhalation", "Unverified", specie, i, "flowRate")}
                                                                                                    className="mr-1"
                                                                                                />
                                                                                                <span>Unverified</span>
                                                                                            </label>
                                                                                        </div>
                                                                                    }
                                                                                />
                                                                            </div>

                                                                            <div>
                                                                                <Input
                                                                                    label="Frequency of Hydrogen Inhalation"
                                                                                    name={`inhalationConcentration_${specie}_${i}_frequency`}
                                                                                    value={formData.speciesData[specie]?.methodsData?.["Inhalation"]?.[i]?.frequency?.value || ""}
                                                                                    onChange={(value) => handleInhalationInputChange(specie, i, "frequency", value, "Inhalation")}
                                                                                    InfoTooltip={<InfoTooltip message="How many times per day was the hydrogen administered" />}
                                                                                    isSpecialAction={isSpecialAction}
                                                                                    customStatusComponent={
                                                                                        <div className="flex items-center space-x-4">
                                                                                            <label className="flex items-center">
                                                                                                <input
                                                                                                    type="radio"
                                                                                                    name={`frequency-status-${specie}-${i}`}
                                                                                                    value="Verified"
                                                                                                    checked={formData.speciesData[specie]?.methodsData?.["Inhalation"]?.[i]?.frequency?.status === "Verified"}
                                                                                                    onChange={() => handleStatusChangeInhalation("Inhalation", "Verified", specie, i, "frequency")}
                                                                                                    className="mr-1"
                                                                                                />
                                                                                                <span>Verified</span>
                                                                                            </label>
                                                                                            <label className="flex items-center">
                                                                                                <input
                                                                                                    type="radio"
                                                                                                    name={`frequency-status-${specie}-${i}`}
                                                                                                    value="Unverified"
                                                                                                    checked={formData.speciesData[specie]?.methodsData?.["Inhalation"]?.[i]?.frequency?.status === "Unverified"}
                                                                                                    onChange={() => handleStatusChangeInhalation("Inhalation", "Unverified", specie, i, "frequency")}
                                                                                                    className="mr-1"
                                                                                                />
                                                                                                <span>Unverified</span>
                                                                                            </label>
                                                                                        </div>
                                                                                    }
                                                                                />
                                                                            </div>

                                                                            <div>
                                                                                <InputWithUnit
                                                                                    type="number"
                                                                                    label="Duration per Frequency"
                                                                                    name={`inhalationConcentration_${specie}_${i}_duration`}
                                                                                    value={formData.speciesData[specie]?.methodsData?.["Inhalation"]?.[i]?.duration?.value || ""}
                                                                                    onChange={(value) => handleInhalationInputChange(specie, i, "duration", value, "Inhalation")}
                                                                                    unit={formData.speciesData[specie]?.methodsData?.["Inhalation"]?.[i]?.duration?.unit || "minutes"}
                                                                                    onUnitChange={(newUnit) => handleInhalationInputChange(specie, i, "unitDuration", newUnit, "Inhalation")}
                                                                                    options={["minutes", "hours"]}
                                                                                    InfoTooltip={<InfoTooltip message="How many minutes or hours did they inhale the hydrogen gas?" />}

                                                                                    isSpecialAction={isSpecialAction}
                                                                                    customStatusComponent={
                                                                                        <div className="flex items-center space-x-4">
                                                                                            <label className="flex items-center">
                                                                                                <input
                                                                                                    type="radio"
                                                                                                    name={`duration-status-${specie}-${i}`}
                                                                                                    value="Verified"
                                                                                                    checked={formData.speciesData[specie]?.methodsData?.["Inhalation"]?.[i]?.duration?.status === "Verified"}
                                                                                                    onChange={() => handleStatusChangeInhalation("Inhalation", "Verified", specie, i, "duration")}
                                                                                                    className="mr-1"
                                                                                                />
                                                                                                <span>Verified</span>
                                                                                            </label>
                                                                                            <label className="flex items-center">
                                                                                                <input
                                                                                                    type="radio"
                                                                                                    name={`duration-status-${specie}-${i}`}
                                                                                                    value="Unverified"
                                                                                                    checked={formData.speciesData[specie]?.methodsData?.["Inhalation"]?.[i]?.duration?.status === "Unverified"}
                                                                                                    onChange={() => handleStatusChangeInhalation("Inhalation", "Unverified", specie, i, "duration")}
                                                                                                    className="mr-1"
                                                                                                />
                                                                                                <span>Unverified</span>
                                                                                            </label>
                                                                                        </div>
                                                                                    }
                                                                                />
                                                                            </div>

                                                                            <div>
                                                                                <Input
                                                                               label={<span>Estimated F<sub>i</sub>H<sub>2</sub> [%]</span>}
                                                                                    name={`inhalationConcentration_${specie}_${i}_estimatedFiH2`}
                                                                                    value={
                                                                                        formData.speciesData[specie]?.methodsData?.["Inhalation"]?.[i]?.estimatedFiH2?.value
                                                                                            ? formData.speciesData[specie].methodsData["Inhalation"][i].estimatedFiH2.value.toString().replace(/%/g, '')
                                                                                            : ""
                                                                                    }
                                                                                    onChange={(value) => {
                                                                                        const cleanValue = value.replace(/%/g, '');
                                                                                        if (cleanValue === '' || /^(\d+)?(\.\d*)?$/.test(cleanValue)) {
                                                                                            handleInhalationInputChange(specie, i, "estimatedFiH2", cleanValue, "Inhalation");
                                                                                        }
                                                                                    }}
                                                                                    InfoTooltip={
                                                                                        <InfoTooltip message="Estimated percent of hydrogen of actual inhaled air based on flow rate and assumed breathing volume." />
                                                                                    }
                                                                                    isSpecialAction={isSpecialAction}
                                                                                    customStatusComponent={
                                                                                        <div className="flex items-center space-x-4">
                                                                                            <label className="flex items-center">
                                                                                                <input
                                                                                                    type="radio"
                                                                                                    name={`estimatedFiH2-status-${specie}-${i}`}
                                                                                                    value="Verified"
                                                                                                    checked={formData.speciesData[specie]?.methodsData?.["Inhalation"]?.[i]?.estimatedFiH2?.status === "Verified"}
                                                                                                    onChange={() => handleStatusChangeInhalation("Inhalation", "Verified", specie, i, "estimatedFiH2")}
                                                                                                    className="mr-1"
                                                                                                />
                                                                                                <span>Verified</span>
                                                                                            </label>
                                                                                            <label className="flex items-center">
                                                                                                <input
                                                                                                    type="radio"
                                                                                                    name={`estimatedFiH2-status-${specie}-${i}`}
                                                                                                    value="Unverified"
                                                                                                    checked={formData.speciesData[specie]?.methodsData?.["Inhalation"]?.[i]?.estimatedFiH2?.status === "Unverified"}
                                                                                                    onChange={() => handleStatusChangeInhalation("Inhalation", "Unverified", specie, i, "estimatedFiH2")}
                                                                                                    className="mr-1"
                                                                                                />
                                                                                                <span>Unverified</span>
                                                                                            </label>
                                                                                        </div>
                                                                                    }
                                                                                />
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        {/* Inhalation - OLD SECTION END */}

                                        {/* NEW: Separate tabs for each Inhalation method */}
                                        {(formData.speciesData?.[specie]?.methods || [])
                                            .filter(method => method.toLowerCase().includes("inhalation"))
                                            .map((method) => {
                                                const uniqueKey = `${specie}-${method}-inhalation`;
                                                return (
                                                    <div
                                                        className="border border-gray-300 rounded-lg shadow-sm mb-4"
                                                        key={uniqueKey}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => openConcentrationHandle(uniqueKey)}
                                                            className="w-full text-left px-4 py-2 flex justify-between items-center bg-blue-100 rounded-t-lg hover:bg-blue-200 focus:outline-none"
                                                            style={{ color: colorTheme.primary, fontWeight: "bold" }}
                                                        >
                                                            <span>{`${method} for ${specie}`}</span>
                                                            <span>{showConcentrationForm[uniqueKey] ? "-" : "+"}</span>
                                                        </button>

                                                        {showConcentrationForm[uniqueKey] && (
                                                            <div className="px-4 py-2">
                                                                {/* Was Oxyhydrogen used */}
                                                                <CustomCreatableSelect
                                                                    isCreate={false}
                                                                    label="Was Oxyhydrogen used?"
                                                                    name={`wasOxyhydrogenUsed_${specie}_${method}`}
                                                                    options={["Yes", "No"]}
                                                                    showNaOption={false}
                                                                    value={formData.speciesData?.[specie]?.methodsData?.[method]?.[0]?.wasOxyhydrogenUsed?.value || ""}
                                                                    onChange={(value) => {
                                                                        setFormData(prev => {
                                                                            const speciesData = { ...prev.speciesData };
                                                                            if (!speciesData[specie]) speciesData[specie] = {};
                                                                            if (!speciesData[specie].methodsData) speciesData[specie].methodsData = {};
                                                                            if (!Array.isArray(speciesData[specie].methodsData[method])) {
                                                                                speciesData[specie].methodsData[method] = [];
                                                                            }
                                                                            // Store wasOxyhydrogenUsed inside each concentration object
                                                                            speciesData[specie].methodsData[method] = speciesData[specie].methodsData[method].map(item => ({
                                                                                ...item,
                                                                                wasOxyhydrogenUsed: { value, status: "Unverified" }
                                                                            }));
                                                                            // If array is empty, add first entry
                                                                            if (speciesData[specie].methodsData[method].length === 0) {
                                                                                speciesData[specie].methodsData[method].push({
                                                                                    wasOxyhydrogenUsed: { value, status: "Unverified" }
                                                                                });
                                                                            }
                                                                            return { ...prev, speciesData };
                                                                        });
                                                                    }}
                                                                />

                                                                {/* Delivery Method */}
                                                                <CustomCreatableSelect
                                                                    isCreate={true}
                                                                    label="Delivery Method"
                                                                    name={`deliveryMethod_${specie}_${method}`}
                                                                    options={["nasal cannula", "mask", "chamber", "ventilator", "tube", "bag", "room air", "endotracheal tube", "tracheostomy", "face tent", "oxygen hood", "nebulizer", "bubble system", "sealed container", "exposure box", "inhalation box", "breathing circuit", "anesthesia circuit", "CPAP", "BiPAP", "mechanical ventilation"]}
                                                                    showNaOption={false}
                                                                    value={formData.speciesData?.[specie]?.methodsData?.[method]?.[0]?.deliveryMethod?.value || ""}
                                                                    onChange={(value) => {
                                                                        setFormData(prev => {
                                                                            const speciesData = { ...prev.speciesData };
                                                                            if (!speciesData[specie]) speciesData[specie] = {};
                                                                            if (!speciesData[specie].methodsData) speciesData[specie].methodsData = {};
                                                                            if (!Array.isArray(speciesData[specie].methodsData[method])) {
                                                                                speciesData[specie].methodsData[method] = [];
                                                                            }
                                                                            // Store deliveryMethod inside each concentration object
                                                                            speciesData[specie].methodsData[method] = speciesData[specie].methodsData[method].map(item => ({
                                                                                ...item,
                                                                                deliveryMethod: { value, status: "Unverified" }
                                                                            }));
                                                                            // If array is empty, add first entry
                                                                            if (speciesData[specie].methodsData[method].length === 0) {
                                                                                speciesData[specie].methodsData[method].push({
                                                                                    deliveryMethod: { value, status: "Unverified" }
                                                                                });
                                                                            }
                                                                            return { ...prev, speciesData };
                                                                        });
                                                                    }}
                                                                    InfoTooltip={<InfoTooltip message="Choose the delivery method used in the study" />}
                                                                />

                                                                {/* Number of Concentrations */}
                                                                <div className="mb-4">
                                                                    <label className="block text-gray-700 font-semibold mb-2">
                                                                        How many unique concentrations/flow rates for {method}?
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        min="1"
                                                                        max="10"
                                                                        value={formData.speciesData?.[specie]?.[`numInhalationConcentrations-${method}`]?.name || ""}
                                                                        onChange={(e) => handleSpecificInputChange(specie, e.target.value, `numInhalationConcentrations-${method}`)}
                                                                        placeholder="Enter number"
                                                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    />
                                                                </div>

                                                                {/* Dynamic concentration fields */}
                                                                {Array.from({ length: parseInt(formData.speciesData?.[specie]?.[`numInhalationConcentrations-${method}`]?.name) || 0 }, (_, i) => (
                                                                    <div key={i} className="border rounded-lg p-4 mb-4 shadow-sm">
                                                                        <h4 className="text-lg font-bold mb-4">{method} Concentration {i + 1}</h4>
                                                                        
                                                                        {/* Percent Purity */}
                                                                        <Input
                                                                            label="Percent Purity"
                                                                            name={`percentPurity_${method}_${specie}_${i}`}
                                                                            value={
                                                                                formData.speciesData?.[specie]?.methodsData?.[method]?.[i]?.percentPurity?.value
                                                                                    ? formData.speciesData[specie].methodsData[method][i].percentPurity.value.toString().replace(/%/g, '')
                                                                                    : ""
                                                                            }
                                                                            onChange={(value) => {
                                                                                const cleanValue = value.replace(/%/g, '');
                                                                                if (cleanValue === '' || /^(\d+)?(\.\d*)?$/.test(cleanValue)) {
                                                                                    handleInhalationInputChange(specie, i, "percentPurity", cleanValue, method);
                                                                                }
                                                                            }}
                                                                            InfoTooltip={<InfoTooltip message="Indicate the percentage of hydrogen purity used." />}
                                                                        />
                                                                        
                                                                        {/* Flow Rate */}
                                                                        <ReuseableInput
                                                                            label="Flow Rate"
                                                                            type="number"
                                                                            name={`flowRate_${method}_${specie}_${i}`}
                                                                            value={formData.speciesData?.[specie]?.methodsData?.[method]?.[i]?.flowRate?.value || ""}
                                                                            onChange={(value) => handleInhalationInputChange(specie, i, "flowRate", value, method)}
                                                                            unit={formData.speciesData?.[specie]?.methodsData?.[method]?.[i]?.flowRate?.unit || "L/min"}
                                                                            onUnitChange={(unit) => {
                                                                                setFormData(prev => {
                                                                                    const speciesData = { ...prev.speciesData };
                                                                                    if (!speciesData[specie]?.methodsData?.[method]?.[i]) return prev;
                                                                                    speciesData[specie].methodsData[method][i].flowRate = {
                                                                                        ...speciesData[specie].methodsData[method][i].flowRate,
                                                                                        unit
                                                                                    };
                                                                                    return { ...prev, speciesData };
                                                                                });
                                                                            }}
                                                                            options={["L/min", "mL/min"]}
                                                                            InfoTooltip={<InfoTooltip message="Enter the flow rate of hydrogen gas." />}
                                                                        />
                                                                        
                                                                        {/* Duration per Frequency */}
                                                                        <ReuseableInput
                                                                            label="Duration per Frequency"
                                                                            type="number"
                                                                            name={`inhalationDuration_${method}_${specie}_${i}`}
                                                                            value={formData.speciesData?.[specie]?.methodsData?.[method]?.[i]?.inhalationDuration?.value || ""}
                                                                            onChange={(value) => handleInhalationInputChange(specie, i, "inhalationDuration", value, method)}
                                                                            unit={formData.speciesData?.[specie]?.methodsData?.[method]?.[i]?.inhalationDuration?.unit || "minutes"}
                                                                            onUnitChange={(unit) => {
                                                                                setFormData(prev => {
                                                                                    const speciesData = { ...prev.speciesData };
                                                                                    if (!speciesData[specie]?.methodsData?.[method]?.[i]) return prev;
                                                                                    speciesData[specie].methodsData[method][i].inhalationDuration = {
                                                                                        ...speciesData[specie].methodsData[method][i].inhalationDuration,
                                                                                        unit
                                                                                    };
                                                                                    return { ...prev, speciesData };
                                                                                });
                                                                            }}
                                                                            options={["minutes", "hours"]}
                                                                            InfoTooltip={<InfoTooltip message="Enter the duration of each inhalation session." />}
                                                                        />
                                                                        
                                                                        {/* Frequency per day */}
                                                                        <Input
                                                                            label="Frequency (times per day)"
                                                                            name={`frequency_${method}_${specie}_${i}`}
                                                                            value={formData.speciesData?.[specie]?.methodsData?.[method]?.[i]?.frequency?.value || ""}
                                                                            onChange={(value) => handleInhalationInputChange(specie, i, "frequency", value, method)}
                                                                            InfoTooltip={<InfoTooltip message="How many times per day was inhalation performed?" />}
                                                                        />
                                                                        
                                                                        {/* Estimated FiH2 */}
                                                                        <Input
                                                                            label="Estimated FiH2 (%)"
                                                                            name={`estimatedFiH2_${method}_${specie}_${i}`}
                                                                            value={
                                                                                formData.speciesData?.[specie]?.methodsData?.[method]?.[i]?.estimatedFiH2?.value
                                                                                    ? formData.speciesData[specie].methodsData[method][i].estimatedFiH2.value.toString().replace(/%/g, '')
                                                                                    : ""
                                                                            }
                                                                            onChange={(value) => {
                                                                                const cleanValue = value.replace(/%/g, '');
                                                                                if (cleanValue === '' || /^(\d+)?(\.\d*)?$/.test(cleanValue)) {
                                                                                    handleInhalationInputChange(specie, i, "estimatedFiH2", cleanValue, method);
                                                                                }
                                                                            }}
                                                                            InfoTooltip={<InfoTooltip message="Estimated percent of hydrogen of actual inhaled air." />}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })
                                        }

                                        {/* Gavage & Oral Hydrogen Water - OLD COMBINED SECTION (HIDDEN - replaced by separate tabs below) */}
                                        {false && (formData.speciesData?.[specie]?.methods?.includes("Gavage") || formData.speciesData?.[specie]?.methods?.includes("Oral Hydrogen Water") || formData.speciesData?.[specie]?.methods?.includes("Hydrogen-rich Saline")) ? (
                                            <div
                                                className="border border-gray-300 rounded-lg shadow-sm mb-4"
                                                key={`concentration-report-${specie}`}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => openConcentrationHandle(specie)}
                                                    className="w-full text-left px-4 py-2 flex justify-between items-center bg-blue-100 rounded-t-lg hover:bg-blue-200 focus:outline-none"
                                                    style={{ color: colorTheme.primary, fontWeight: "bold" }}
                                                >
                                                    <span>{`${
                                                        formData.speciesData?.[specie]?.methods?.includes("Gavage")
                                                            ? "Gavage"
                                                            : formData.speciesData?.[specie]?.methods?.includes("Oral Hydrogen Water")
                                                            ? "Oral Hydrogen Water"
                                                            : "Hydrogen-rich Saline"
                                                    } Concentration Report for ${specie}`}</span>
                                                    <span>{showConcentrationForm[specie] ? "-" : "+"}</span>
                                                </button>

                                                {showConcentrationForm[specie] && (
                                                    <div className="px-4 py-2">
                                                        {/* Input: Number of Concentrations */}
                                                        <div className="mb-4 relative">
                                                            <div
                                                                className="text-gray-700 font-semibold mb-2 flex justify-between items-center w-full"
                                                            >
                                                                {/* Left Section: Label & Tooltip */}
                                                                <div className="flex items-center">
                                                                    <span>How many unique hydrogen concentrations used in this study?</span>
                                                                    <span> <InfoTooltip message="If the experiment used different groups with varied hydrogen concentrations, count each as a separate concentration." /></span>
                                                                </div>

                                                                {/* Right Section: Radio Buttons */}
                                                                {isSpecialAction && formData.speciesData?.[specie]?.HowManyConcentrations?.name && (
                                                                    // Default Verified/Unverified buttons
                                                                    <div className="flex items-center space-x-4">
                                                                        <label className="flex items-center">
                                                                            <input
                                                                                type="radio"
                                                                                name={`HowManyConcentrations-${specie}-status`}
                                                                                value="Verified"
                                                                                checked={formData.speciesData?.[specie]?.HowManyConcentrations?.status === "Verified"}
                                                                                onChange={() => handleStatusChangeMulti("HowManyConcentrations", "Verified", specie)}
                                                                                className="mr-1"
                                                                            />
                                                                            <span>Verified</span>
                                                                        </label>
                                                                        <label className="flex items-center">
                                                                            <input
                                                                                type="radio"
                                                                                name={`HowManyConcentrations-${specie}-status`}
                                                                                value="Unverified"
                                                                                checked={formData.speciesData?.[specie]?.HowManyConcentrations?.status === "Unverified"}
                                                                                onChange={() => handleStatusChangeMulti("HowManyConcentrations", "Unverified", specie)}
                                                                                className="mr-1"
                                                                            />
                                                                            <span>Unverified</span>
                                                                        </label>
                                                                    </div>

                                                                )}
                                                            </div>

                                                            {/* Input Field */}
                                                            <input
                                                                type="number"
                                                                name={`HowManyConcentrations-${specie}`}
                                                                value={formData.speciesData?.[specie]?.HowManyConcentrations?.name || ""}
                                                                min="1"
                                                                max="10"
                                                                onChange={(e) =>
                                                                    handleInputChangeSpecie(specie, "HowManyConcentrations", e.target.value)
                                                                }
                                                                placeholder="Enter number of concentrations"
                                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                autoComplete="off"
                                                                style={{
                                                                    border: formData.speciesData?.[specie]?.HowManyConcentrations && "2px solid gray"
                                                                }}
                                                            />

                                                            {/* Error Message (Optional) */}
                                                            {formData.speciesData?.[specie]?.HowManyConcentrations === "" && (
                                                                <div style={{ color: "red", fontSize: 14, marginTop: 2, marginLeft: 2 }}>
                                                                    This field is required.
                                                                </div>
                                                            )}
                                                        </div>


                                                        {/* Dynamic Fields for Each Concentration */}
                                                        {Array. from(
                                                            { length: formData.speciesData?.[specie]?.HowManyConcentrations?.name || 0 },
                                                            (_, index) => (
                                                                <div
                                                                    key={`concentration-group-${index}`}
                                                                    className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4 border p-4 rounded-lg"
                                                                >
                                                                    <ReuseableInput
                                                                        isCheck={false}
                                                                        label={`${index + 1}. Volume of water/day`}
                                                                        type="number"
                                                                        value={formData.speciesData[specie]?.volumes?.[index]?.value || ""}
                                                                        onChange={(value) =>
                                                                            handleInputChangeSpecie(
                                                                                specie,
                                                                                `volumes[${index}]`,
                                                                                { value, unit: formData.speciesData[specie]?.volumes?.[index]?.unit || "mL" }
                                                                            )
                                                                        }
                                                                        unit={formData.speciesData[specie]?.volumes?.[index]?.unit || "mL"}
                                                                        onUnitChange={(unit) =>
                                                                            handleInputChangeSpecie(
                                                                                specie,
                                                                                `volumes[${index}]`,
                                                                                { value: formData.speciesData[specie]?.volumes?.[index]?.value || "", unit }
                                                                            )
                                                                        }
                                                                        options={["mL", "L"]}
                                                                        InfoTooltip={
                                                                            <InfoTooltip message="Specify the total volume of hydrogen water consumed daily. If the volume of water was not stated in the article, then we must make an estimate based on their exact breed/strain of species, age, and weight." />
                                                                        }
                                                                        width={"40px"}
                                                                        child={<div>
                                                                            {formData.speciesData[specie]?.volumes?.[index]?.value && <div style={{ marginTop: '8px', fontSize: '12px' }}>
                                                                                <div style={{ display: 'inline-flex', alignItems: 'center', marginRight: '10px' }}>
                                                                                    <input
                                                                                        type="radio"
                                                                                        id={`estimated-${specie}-${index}-volume`}
                                                                                        name={`status-volume-${specie}-${index}`}
                                                                                        value="estimated"
                                                                                        checked={statusVolume[specie]?.[index] === 'estimated'}
                                                                                        onChange={(e) => handleVolumeChange(specie, index, 'estimated')}
                                                                                        style={{
                                                                                            marginRight: '5px',
                                                                                            accentColor: '#004c78',
                                                                                            cursor: 'pointer'
                                                                                        }}
                                                                                    />
                                                                                    <label htmlFor={`estimated-${specie}-${index}-volume`} style={{ cursor: 'pointer' }}>
                                                                                        Estimated/Assumed
                                                                                    </label>
                                                                                </div>

                                                                                <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                                                                    <input
                                                                                        type="radio"
                                                                                        id={`provided-${specie}-${index}-volume`}
                                                                                        name={`status-volume-${specie}-${index}`}
                                                                                        value="provided"
                                                                                        checked={statusVolume[specie]?.[index] === 'provided'}
                                                                                        onChange={(e) => handleVolumeChange(specie, index, 'provided')}
                                                                                        style={{
                                                                                            marginRight: '5px',
                                                                                            accentColor: '#004c78',
                                                                                            cursor: 'pointer'
                                                                                        }}
                                                                                    />
                                                                                    <label htmlFor={`provided-${specie}-${index}-volume`} style={{ cursor: 'pointer' }}>
                                                                                        Provided
                                                                                    </label>
                                                                                </div>

                                                                                {/* ad libitum field  */}
                                                                                <div style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '10px' }}>
                                                                                    <input
                                                                                        type="radio"
                                                                                        id={`adlibitum-${specie}-${index}-volume`}
                                                                                        name={`status-volume-${specie}-${index}`}
                                                                                        value="adlibitum"
                                                                                        checked={statusVolume[specie]?.[index] === 'adlibitum'}
                                                                                        onChange={(e) => handleVolumeChange(specie, index, 'adlibitum')}
                                                                                        style={{
                                                                                            marginRight: '5px',
                                                                                            accentColor: '#004c78',
                                                                                            cursor: 'pointer'
                                                                                        }}
                                                                                    />
                                                                                    <label htmlFor={`adlibitum-${specie}-${index}-volume`} style={{ cursor: 'pointer' }}>
                                                                                        Ad libitum
                                                                                    </label>
                                                                                </div>
                                                                                
                                                                            </div>
                                                                            }
                                                                        </div>
                                                                        }

                                                                        isSpecialAction={isSpecialAction}
                                                                        customStatusComponent={
                                                                            <div className="flex items-center space-x-4">
                                                                                <label className="flex items-center">
                                                                                    <input
                                                                                        type="radio"
                                                                                        name={`volumes-status-${specie}-${index}`}
                                                                                        value="Verified"
                                                                                        checked={formData.speciesData[specie]?.volumes?.[index]?.status === "Verified"}
                                                                                        onChange={() => handleStatusChangeGavage("volumes", "Verified", specie, index)}
                                                                                        className="mr-1"
                                                                                    />
                                                                                    <span>Verified</span>
                                                                                </label>
                                                                                <label className="flex items-center">
                                                                                    <input
                                                                                        type="radio"
                                                                                        name={`volumes-status-${specie}-${index}`}
                                                                                        value="Unverified"
                                                                                        checked={formData.speciesData[specie]?.volumes?.[index]?.status === "Unverified"}
                                                                                        onChange={() => handleStatusChangeGavage("volumes", "Unverified", specie, index)}
                                                                                        className="mr-1"
                                                                                    />
                                                                                    <span>Unverified</span>
                                                                                </label>
                                                                            </div>
                                                                        }
                                                                    />

                                                                    <ReuseableInput
                                                                        isCheck={false}
                                                                        label={`${index + 1}. Concentration`}
                                                                        type="number"
                                                                        value={formData.speciesData[specie]?.concentrations?.[index]?.value || ""}
                                                                        onChange={(value) =>
                                                                            handleInputChangeSpecie(
                                                                                specie,
                                                                                `concentrations[${index}]`,
                                                                                { value, unit: formData.speciesData[specie]?.concentrations?.[index]?.unit || "mg/L" }
                                                                            )
                                                                        }
                                                                        unit={formData.speciesData[specie]?.concentrations?.[index]?.unit || "mg/L"}
                                                                        onUnitChange={(unit) =>
                                                                            handleInputChangeSpecie(
                                                                                specie,
                                                                                `concentrations[${index}]`,
                                                                                { value: formData.speciesData[specie]?.concentrations?.[index]?.value || "", unit }
                                                                            )
                                                                        }
                                                                        options={unitOptions}
                                                                        InfoTooltip={
                                                                            <InfoTooltip message="Enter the hydrogen concentration used in the study. " />
                                                                        }
                                                                        width={"60px"}
                                                                        child={<div>
                                                                            {formData.speciesData[specie]?.concentrations?.[index]?.value && <div style={{ marginTop: '8px', fontSize: '12px' }}>
                                                                                <div style={{ display: 'inline-flex', alignItems: 'center', marginRight: '10px' }}>
                                                                                    <input
                                                                                        type="radio"
                                                                                        id={`estimated-${specie}-${index}-concentration`}
                                                                                        name={`status-concentration-${specie}-${index}`}
                                                                                        value="estimated"
                                                                                        checked={statusConcentration[specie]?.[index] === 'estimated'}
                                                                                        onChange={(e) => handleConcentrationChange(specie, index, 'estimated')}
                                                                                        style={{
                                                                                            marginRight: '5px',
                                                                                            accentColor: '#004c78',
                                                                                            cursor: 'pointer',
                                                                                        }}
                                                                                    />
                                                                                    <label htmlFor={`estimated-${specie}-${index}-concentration`} style={{ cursor: 'pointer' }}>
                                                                                        Estimated/Assumed
                                                                                    </label>
                                                                                </div>

                                                                                <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                                                                    <input
                                                                                        type="radio"
                                                                                        id={`provided-${specie}-${index}-concentration`}
                                                                                        name={`status-concentration-${specie}-${index}`}
                                                                                        value="provided"
                                                                                        checked={statusConcentration[specie]?.[index] === 'provided'}
                                                                                        onChange={(e) => handleConcentrationChange(specie, index, 'provided')}
                                                                                        style={{
                                                                                            marginRight: '5px',
                                                                                            accentColor: '#004c78',
                                                                                            cursor: 'pointer',
                                                                                        }}
                                                                                    />
                                                                                    <label htmlFor={`provided-${specie}-${index}-concentration`} style={{ cursor: 'pointer' }}>
                                                                                        Provided
                                                                                    </label>
                                                                                </div>
                                                                            </div>}

                                                                        </div>
                                                                        }
                                                                        isSpecialAction={isSpecialAction}
                                                                        customStatusComponent={
                                                                            <div className="flex items-center space-x-4">
                                                                                <label className="flex items-center">
                                                                                    <input
                                                                                        type="radio"
                                                                                        name={`concentration-status-${specie}-${index}`}
                                                                                        value="Verified"
                                                                                        checked={formData.speciesData[specie]?.concentrations?.[index]?.status === "Verified"}
                                                                                        onChange={() => handleStatusChangeConcentration("Verified", specie, index)}
                                                                                        className="mr-1"
                                                                                    />
                                                                                    <span>Verified</span>
                                                                                </label>
                                                                                <label className="flex items-center">
                                                                                    <input
                                                                                        type="radio"
                                                                                        name={`concentration-status-${specie}-${index}`}
                                                                                        value="Unverified"
                                                                                        checked={formData.speciesData[specie]?.concentrations?.[index]?.status === "Unverified"}
                                                                                        onChange={() => handleStatusChangeConcentration("Unverified", specie, index)}
                                                                                        className="mr-1"
                                                                                    />
                                                                                    <span>Unverified</span>
                                                                                </label>
                                                                            </div>
                                                                        }


                                                                    />

                                                                    <ReuseableInput
                                                                        label={`${index + 1}. Absolute Dose/day`}
                                                                        type="text"
                                                                        value={formData.speciesData[specie]?.absoluteDoses?.[index]?.value || ""}
                                                                        onChange={(e) => {
                                                                            const newValue = e;

                                                                            setFormData((prevData) => {
                                                                                const updatedSpeciesData = { ...prevData.speciesData };

                                                                                // Ensure the species entry exists
                                                                                if (!updatedSpeciesData[specie]) {
                                                                                    updatedSpeciesData[specie] = {
                                                                                        absoluteDoses: [],
                                                                                        // Initialize other fields if necessary
                                                                                    };
                                                                                }

                                                                                // Ensure absoluteDoses array exists and is properly initialized
                                                                                const absoluteDoses = [...(updatedSpeciesData[specie].absoluteDoses || [])];
                                                                                if (!absoluteDoses[index]) {
                                                                                    absoluteDoses[index] = { value: "", unit: "mg/day" }; // Initialize default structure
                                                                                }

                                                                                // Update the specific value
                                                                                absoluteDoses[index].value = newValue;

                                                                                // Assign back to species data
                                                                                updatedSpeciesData[specie].absoluteDoses = absoluteDoses;

                                                                                return {
                                                                                    ...prevData,
                                                                                    speciesData: updatedSpeciesData,
                                                                                };
                                                                            });
                                                                        }}
                                                                        unit={formData.speciesData[specie]?.absoluteDoses?.[index]?.unit || "mg/day"}
                                                                        onUnitChange={() => { }} // No action needed as it's read-only
                                                                        options={["mg/day"]} // Fixed unit
                                                                        isCheck={false}
                                                                        style={{ backgroundColor: "#f3f4f6" }}
                                                                        InfoTooltip={
                                                                            <InfoTooltip message={
                                                                                `How to calculate Absolute Dose per Day:\n\n1. Ensure both concentration and volume are in compatible units (e.g., mg/L and L, or µg/mL and mL).\n2. Multiply the hydrogen concentration by the total volume consumed per day.\n3. Convert the result to µg/day if needed (1 mg = 1000 µg).\n\nExample: If concentration = 0.5 mg/L and volume = 2 L/day, then Absolute Dose = 0.5 mg/L × 2 L = 1 mg/day = 1000 µg/day.`}
                                                                            />
                                                                        }
                                                                        width={"80px"}
                                                                        isSpecialAction={isSpecialAction}
                                                                        customStatusComponent={
                                                                            <div className="flex items-center space-x-4">
                                                                                <label className="flex items-center">
                                                                                    <input
                                                                                        type="radio"
                                                                                        name={`absoluteDose-status-${specie}-${index}`}
                                                                                        value="Verified"
                                                                                        checked={formData.speciesData[specie]?.absoluteDoses?.[index]?.status === "Verified"}
                                                                                        onChange={() => handleStatusChangeAbsoluteDose("Verified", specie, index)}
                                                                                        className="mr-1"
                                                                                    />
                                                                                    <span>Verified</span>
                                                                                </label>
                                                                                <label className="flex items-center">
                                                                                    <input
                                                                                        type="radio"
                                                                                        name={`absoluteDose-status-${specie}-${index}`}
                                                                                        value="Unverified"
                                                                                        checked={formData.speciesData[specie]?.absoluteDoses?.[index]?.status === "Unverified"}
                                                                                        onChange={() => handleStatusChangeAbsoluteDose("Unverified", specie, index)}
                                                                                        className="mr-1"
                                                                                    />
                                                                                    <span>Unverified</span>
                                                                                </label>
                                                                            </div>
                                                                        }
                                                                    />


                                                                    <ReuseableInput
                                                                        label={`${index + 1}. Relative Dose/day`}
                                                                        type="text"
                                                                        value={formData.speciesData[specie]?.relativeDoses?.[index]?.value || ""}
                                                                        onChange={(e) => {
                                                                            const newValue = e;

                                                                            setFormData((prevData) => {
                                                                                const updatedSpeciesData = { ...prevData.speciesData };

                                                                                // Ensure the species entry exists
                                                                                if (!updatedSpeciesData[specie]) {
                                                                                    updatedSpeciesData[specie] = {
                                                                                        relativeDoses: [],
                                                                                        // Initialize other fields if necessary
                                                                                    };
                                                                                }

                                                                                // Ensure relativeDoses array exists and is properly initialized
                                                                                const relativeDoses = [...(updatedSpeciesData[specie].relativeDoses || [])];
                                                                                if (!relativeDoses[index]) {
                                                                                    relativeDoses[index] = { value: "", unit: "mg/kg/day" }; // Initialize default structure
                                                                                }

                                                                                // Update the specific value
                                                                                relativeDoses[index].value = newValue;

                                                                                // Assign back to species data
                                                                                updatedSpeciesData[specie].relativeDoses = relativeDoses;

                                                                                return {
                                                                                    ...prevData,
                                                                                    speciesData: updatedSpeciesData,
                                                                                };
                                                                            });
                                                                        }}
                                                                        unit={formData.speciesData[specie]?.relativeDoses?.[index]?.unit || "mg/kg/day"}
                                                                        onUnitChange={() => { }} // No action needed as it's read-only
                                                                        options={["mg/kg/day"]}
                                                                        isCheck={false}
                                                                        style={{ backgroundColor: "#f3f4f6" }}
                                                                        InfoTooltip={
                                                                            <InfoTooltip message="Calculate by taking the absolute dose divided by the average weight of the species in the study. Verify unit conversions for accuracy." />
                                                                        }
                                                                        width={"94px"}
                                                                        isSpecialAction={isSpecialAction}
                                                                        customStatusComponent={
                                                                            <div className="flex items-center space-x-4">
                                                                                <label className="flex items-center">
                                                                                    <input
                                                                                        type="radio"
                                                                                        name={`relativeDose-status-${specie}-${index}`}
                                                                                        value="Verified"
                                                                                        checked={formData.speciesData[specie]?.relativeDoses?.[index]?.status === "Verified"}
                                                                                        onChange={() => handleStatusChangeRelativeDose("Verified", specie, index)}
                                                                                        className="mr-1"
                                                                                    />
                                                                                    <span>Verified</span>
                                                                                </label>
                                                                                <label className="flex items-center">
                                                                                    <input
                                                                                        type="radio"
                                                                                        name={`relativeDose-status-${specie}-${index}`}
                                                                                        value="Unverified"
                                                                                        checked={formData.speciesData[specie]?.relativeDoses?.[index]?.status === "Unverified"}
                                                                                        onChange={() => handleStatusChangeRelativeDose("Unverified", specie, index)}
                                                                                        className="mr-1"
                                                                                    />
                                                                                    <span>Unverified</span>
                                                                                </label>
                                                                            </div>
                                                                        }
                                                                    />

                                                                    <ReuseableInput
                                                                        label="Weight of species"
                                                                        type="number"
                                                                        value={bodyWeight}
                                                                        onChange={handleWeightChange}
                                                                        unit={formData.speciesData[specie]?.weight?.unit || 
                                                                        //if human or human like species use kg otherwise g
                                                                        formData.bodyWeight?.unit || (specie.toLowerCase().includes('human') ? 'kg' : 'g')
                                                                        
                                                                        }
                                                                        onUnitChange={handleSpeciesWeightUnitChange}
                                                                        options={weightUnitOptions}
                                                                        InfoTooltip={
                                                                            <InfoTooltip message="Enter the weight of the species and select the appropriate unit (g or kg)." />
                                                                        }
                                                                        isCheck={false}
                                                                        isSpecialAction={isSpecialAction}
                                                                        customStatusComponent={
                                                                            <div className="flex items-center space-x-4">
                                                                                <label className="flex items-center">
                                                                                    <input
                                                                                        type="radio"
                                                                                        name={`species-weight-status-${specie}`}
                                                                                        value="Verified"
                                                                                        checked={formData.speciesData[specie]?.weight?.status === "Verified"}
                                                                                        onChange={() => handleSpeciesWeightStatusChange("Verified")}
                                                                                        className="mr-1"
                                                                                    />
                                                                                    <span>Verified</span>
                                                                                </label>
                                                                                <label className="flex items-center">
                                                                                    <input
                                                                                        type="radio"
                                                                                        name={`species-weight-status-${specie}`}
                                                                                        value="Unverified"
                                                                                        checked={formData.speciesData[specie]?.weight?.status === "Unverified"}
                                                                                        onChange={() => handleSpeciesWeightStatusChange("Unverified")}
                                                                                        className="mr-1"
                                                                                    />
                                                                                    <span>Unverified</span>
                                                                                </label>
                                                                            </div>
                                                                        }
                                                                    />
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ) : null}
                                        {/* Gavage & Oral Hydrogen Water - OLD SECTION END */}

                                        {/* NEW: Separate tabs for each Gavage/OHW/HRS method */}
                                        {(formData.speciesData?.[specie]?.methods || [])
                                            .filter(method => 
                                                method === "Gavage" || 
                                                method === "Oral Hydrogen Water" || 
                                                method === "Hydrogen-rich Saline"
                                            )
                                            .map((method) => {
                                                const uniqueKey = `${specie}-${method}`;
                                                return (
                                                    <div
                                                        className="border border-gray-300 rounded-lg shadow-sm mb-4"
                                                        key={uniqueKey}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => openConcentrationHandle(uniqueKey)}
                                                            className="w-full text-left px-4 py-2 flex justify-between items-center bg-blue-100 rounded-t-lg hover:bg-blue-200 focus:outline-none"
                                                            style={{ color: colorTheme.primary, fontWeight: "bold" }}
                                                        >
                                                            <span>{`${method} Concentration Report for ${specie}`}</span>
                                                            <span>{showConcentrationForm[uniqueKey] ? "-" : "+"}</span>
                                                        </button>

                                                        {showConcentrationForm[uniqueKey] && (
                                                            <div className="px-4 py-2">
                                                                {/* Number of Concentrations for this method */}
                                                                <div className="mb-4">
                                                                    <label className="block text-gray-700 font-semibold mb-2">
                                                                        How many unique concentrations for {method}?
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        min="1"
                                                                        max="10"
                                                                        value={formData.speciesData?.[specie]?.[`HowManyConcentrations-${method}`]?.name || ""}
                                                                        onChange={(e) => handleInputChangeSpecie(specie, `HowManyConcentrations-${method}`, e.target.value)}
                                                                        placeholder="Enter number of concentrations"
                                                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    />
                                                                </div>

                                                                {/* Dynamic fields for each concentration */}
                                                                {Array.from({ length: parseInt(formData.speciesData?.[specie]?.[`HowManyConcentrations-${method}`]?.name) || 0 }, (_, index) => (
                                                                    <div key={index} className="border rounded-lg p-4 mb-4 shadow-sm">
                                                                        <h4 className="text-lg font-bold mb-4">{method} Concentration {index + 1}</h4>
                                                                        
                                                                        {/* Volume */}
                                                                        <ReuseableInput
                                                                            label="Volume"
                                                                            type="number"
                                                                            name={`volume-${method}-${specie}-${index}`}
                                                                            value={formData.speciesData?.[specie]?.methodsData?.[method]?.[index]?.volume?.value || ""}
                                                                            onChange={(val) => handleInputChangeSpecie(specie, `methodsData.${method}[${index}].volume`, { value: val })}
                                                                            unit={formData.speciesData?.[specie]?.methodsData?.[method]?.[index]?.volume?.unit || "mL"}
                                                                            onUnitChange={(unit) => handleInputChangeSpecie(specie, `methodsData.${method}[${index}].volume`, { unit: unit })}
                                                                            options={["mL", "L"]}
                                                                            InfoTooltip={<InfoTooltip message="Enter the volume of hydrogen water administered." />}
                                                                        />
                                                                        
                                                                        {/* Concentration */}
                                                                        <ReuseableInput
                                                                            label="Concentration"
                                                                            type="number"
                                                                            name={`concentration-${method}-${specie}-${index}`}
                                                                            value={formData.speciesData?.[specie]?.methodsData?.[method]?.[index]?.concentration?.value || ""}
                                                                            onChange={(val) => handleInputChangeSpecie(specie, `methodsData.${method}[${index}].concentration`, { value: val })}
                                                                            unit={formData.speciesData?.[specie]?.methodsData?.[method]?.[index]?.concentration?.unit || "mg/L"}
                                                                            onUnitChange={(unit) => handleInputChangeSpecie(specie, `methodsData.${method}[${index}].concentration`, { unit: unit })}
                                                                            options={["mg/L", "mM", "ppm", "ppb", "µM"]}
                                                                            InfoTooltip={<InfoTooltip message="Enter the hydrogen concentration." />}
                                                                        />
                                                                        
                                                                        {/* Absolute Dose (calculated) */}
                                                                        <ReuseableInput
                                                                            label="Absolute Dose"
                                                                            type="text"
                                                                            name={`absoluteDose-${method}-${specie}-${index}`}
                                                                            value={formData.speciesData?.[specie]?.methodsData?.[method]?.[index]?.absoluteDose?.value || ""}
                                                                            onChange={() => {}}
                                                                            unit="mg/day"
                                                                            options={["mg/day"]}
                                                                            style={{ backgroundColor: "#f3f4f6" }}
                                                                            InfoTooltip={<InfoTooltip message="Calculated: Volume × Concentration" />}
                                                                        />
                                                                        
                                                                        {/* Relative Dose (calculated) */}
                                                                        <ReuseableInput
                                                                            label="Relative Dose"
                                                                            type="text"
                                                                            name={`relativeDose-${method}-${specie}-${index}`}
                                                                            value={formData.speciesData?.[specie]?.methodsData?.[method]?.[index]?.relativeDose?.value || ""}
                                                                            onChange={() => {}}
                                                                            unit="mg/kg/day"
                                                                            options={["mg/kg/day"]}
                                                                            style={{ backgroundColor: "#f3f4f6" }}
                                                                            InfoTooltip={<InfoTooltip message="Calculated: Absolute Dose / Body Weight" />}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })
                                        }

                                        {/* Cell Culture / Tissues - OLD SECTION (HIDDEN) */}
                                        {false && formData.speciesData?.[specie]?.methods?.includes("Cell Culture / Tissues") && (
                                            <div className="border border-gray-300 rounded-lg shadow-sm mb-4">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleCellTissueInfo(specie)}
                                                    className="w-full text-left px-4 py-2 flex justify-between items-center bg-blue-100 rounded-t-lg hover:bg-blue-200 focus:outline-none"
                                                    style={{ color: colorTheme.primary, fontWeight: "bold" }}
                                                >
                                                    <span>{`Cell Culture / Tissues for ${specie}`}</span>
                                                    <span>{formData.speciesData[specie]?.isCellTissueOpen ? "-" : "+"}</span>
                                                </button>

                                                {/* Fields inside Accordion */}
                                                {formData.speciesData[specie]?.isCellTissueOpen && (
                                                    <div className="px-4 py-2">
                                                        <Input
                                                            label="What is the concentration of hydrogen for the medium (μM/L)."
                                                            name="concentrationOfHydrogenForMedium"
                                                            value={formData.speciesData?.[specie]?.concentrationOfHydrogenForMedium?.name || ""}
                                                            onChange={(value) => handleSpecificInputChange(specie, value, "concentrationOfHydrogenForMedium")}

                                                            InfoTooltip={<InfoTooltip message="Enter the measured concentration of dissolved molecular hydrogen in the cell 
                                                                                                culture medium, expressed in micromoles per liter (µM/L)." />}

                                                            isSpecialAction={isSpecialAction}
                                                            customStatusComponent={
                                                                <div className="flex items-center space-x-4">
                                                                    <label className="flex items-center">
                                                                        <input
                                                                            type="radio"
                                                                            name={`concentrationOfHydrogenForMedium-${specie}-status`}
                                                                            value="Verified"
                                                                            checked={formData.speciesData?.[specie]?.concentrationOfHydrogenForMedium?.status === "Verified"}
                                                                            onChange={() => handleStatusChangeMulti("concentrationOfHydrogenForMedium", "Verified", specie)}
                                                                            className="mr-1"
                                                                        />
                                                                        <span>Verified</span>
                                                                    </label>
                                                                    <label className="flex items-center">
                                                                        <input
                                                                            type="radio"
                                                                            name={`concentrationOfHydrogenForMedium-${specie}-status`}
                                                                            value="Unverified"
                                                                            checked={formData.speciesData?.[specie]?.concentrationOfHydrogenForMedium?.status === "Unverified"}
                                                                            onChange={() => handleStatusChangeMulti("concentrationOfHydrogenForMedium", "Unverified", specie)}
                                                                            className="mr-1"
                                                                        />
                                                                        <span>Unverified</span>
                                                                    </label>
                                                                </div>
                                                            }


                                                        />

                                                        <InputWithUnit
                                                            type="number"
                                                            label="Volume of Medium Used (mL)"
                                                            name="FrequencyCellCultureTissues"
                                                            value={formData.speciesData?.[specie]?.FrequencyCellCultureTissues?.value || ""}
                                                            onChange={(value) =>
                                                                handleSpecificInputChange(
                                                                    specie,
                                                                    value,
                                                                    "FrequencyCellCultureTissues",
                                                                    formData.speciesData?.[specie]?.FrequencyCellCultureTissues?.unit
                                                                )
                                                            }
                                                            error={validationErrors?.[specie]?.FrequencyCellCultureTissues}
                                                            unit={formData.speciesData?.[specie]?.FrequencyCellCultureTissues?.unit || "minutes"}
                                                            onUnitChange={(newUnit) =>
                                                                handleSpecificInputChange(
                                                                    specie,
                                                                    formData.speciesData?.[specie]?.FrequencyCellCultureTissues?.value,
                                                                    "FrequencyCellCultureTissues",
                                                                    newUnit
                                                                )
                                                            }
                                                            options={["mL"]}
                                                            InfoTooltip={<InfoTooltip message="Enter the total volume of culture medium used in the experiment, measured in 
                                                                                                milliliters (mL)." />}
                                                            isSpecialAction={isSpecialAction}
                                                            customStatusComponent={
                                                                <div className="flex items-center space-x-4">
                                                                    <label className="flex items-center">
                                                                        <input
                                                                            type="radio"
                                                                            name={`FrequencyCellCultureTissues-${specie}-status`}
                                                                            value="Verified"
                                                                            checked={formData.speciesData?.[specie]?.FrequencyCellCultureTissues?.status === "Verified"}
                                                                            onChange={() => handleStatusChangeMulti("FrequencyCellCultureTissues", "Verified", specie)}
                                                                            className="mr-1"
                                                                        />
                                                                        <span>Verified</span>
                                                                    </label>
                                                                    <label className="flex items-center">
                                                                        <input
                                                                            type="radio"
                                                                            name={`FrequencyCellCultureTissues-${specie}-status`}
                                                                            value="Unverified"
                                                                            checked={formData.speciesData?.[specie]?.FrequencyCellCultureTissues?.status === "Unverified"}
                                                                            onChange={() => handleStatusChangeMulti("FrequencyCellCultureTissues", "Unverified", specie)}
                                                                            className="mr-1"
                                                                        />
                                                                        <span>Unverified</span>
                                                                    </label>
                                                                </div>
                                                            }
                                                        />

                                                        <InputWithUnit
                                                            type="number"
                                                            label="Total Exposure Duration (hours/min)"
                                                            name="DurationFrequencyCellCultureTissues"
                                                            value={formData.speciesData?.[specie]?.DurationFrequencyCellCultureTissues?.value || ""}
                                                            onChange={(value) =>
                                                                handleSpecificInputChange(
                                                                    specie,
                                                                    value,
                                                                    "DurationFrequencyCellCultureTissues",
                                                                    formData.speciesData?.[specie]?.DurationFrequencyCellCultureTissues?.unit
                                                                )
                                                            }
                                                            error={validationErrors?.[specie]?.DurationFrequencyCellCultureTissues}
                                                            unit={formData.speciesData?.[specie]?.DurationFrequencyCellCultureTissues?.unit || "minutes"}
                                                            onUnitChange={(newUnit) =>
                                                                handleSpecificInputChange(
                                                                    specie,
                                                                    formData.speciesData?.[specie]?.DurationFrequencyCellCultureTissues?.value,
                                                                    "DurationFrequencyCellCultureTissues",
                                                                    newUnit
                                                                )
                                                            }
                                                            options={["Min", "Hr"]}
                                                            InfoTooltip={<InfoTooltip message="Indicate how long the cells were exposed to the hydrogen-enriched medium, 
                                                                                                measured in hours or minutes." />}
                                                            isSpecialAction={isSpecialAction}
                                                            customStatusComponent={
                                                                <div className="flex items-center space-x-4">
                                                                    <label className="flex items-center">
                                                                        <input
                                                                            type="radio"
                                                                            name={`DurationFrequencyCellCultureTissues-${specie}-status`}
                                                                            value="Verified"
                                                                            checked={formData.speciesData?.[specie]?.DurationFrequencyCellCultureTissues?.status === "Verified"}
                                                                            onChange={() => handleStatusChangeMulti("DurationFrequencyCellCultureTissues", "Verified", specie)}
                                                                            className="mr-1"
                                                                        />
                                                                        <span>Verified</span>
                                                                    </label>
                                                                    <label className="flex items-center">
                                                                        <input
                                                                            type="radio"
                                                                            name={`DurationFrequencyCellCultureTissues-${specie}-status`}
                                                                            value="Unverified"
                                                                            checked={formData.speciesData?.[specie]?.DurationFrequencyCellCultureTissues?.status === "Unverified"}
                                                                            onChange={() => handleStatusChangeMulti("DurationFrequencyCellCultureTissues", "Unverified", specie)}
                                                                            className="mr-1"
                                                                        />
                                                                        <span>Unverified</span>
                                                                    </label>
                                                                </div>
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {/* Cell Culture / Tissues - OLD SECTION END */}

                                        {/* NEW: Separate tabs for each Cell Culture / Tissues method */}
                                        {(formData.speciesData?.[specie]?.methods || [])
                                            .filter(method => method.toLowerCase().includes("cell culture") || method.toLowerCase().includes("tissues"))
                                            .map((method) => {
                                                const uniqueKey = `${specie}-${method}-cellculture`;
                                                return (
                                                    <div
                                                        className="border border-gray-300 rounded-lg shadow-sm mb-4"
                                                        key={uniqueKey}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => openConcentrationHandle(uniqueKey)}
                                                            className="w-full text-left px-4 py-2 flex justify-between items-center bg-blue-100 rounded-t-lg hover:bg-blue-200 focus:outline-none"
                                                            style={{ color: colorTheme.primary, fontWeight: "bold" }}
                                                        >
                                                            <span>{`${method} for ${specie}`}</span>
                                                            <span>{showConcentrationForm[uniqueKey] ? "-" : "+"}</span>
                                                        </button>

                                                        {showConcentrationForm[uniqueKey] && (
                                                            <div className="px-4 py-2">
                                                                {/* Concentration of hydrogen for medium */}
                                                                <Input
                                                                    label="What is the concentration of hydrogen for the medium (μM/L)?"
                                                                    name={`concentrationOfHydrogenForMedium-${method}`}
                                                                    value={formData.speciesData?.[specie]?.methodsData?.[method]?.concentrationOfHydrogenForMedium?.value || ""}
                                                                    onChange={(value) => {
                                                                        setFormData(prev => {
                                                                            const speciesData = { ...prev.speciesData };
                                                                            if (!speciesData[specie]) speciesData[specie] = {};
                                                                            if (!speciesData[specie].methodsData) speciesData[specie].methodsData = {};
                                                                            if (!speciesData[specie].methodsData[method]) speciesData[specie].methodsData[method] = {};
                                                                            speciesData[specie].methodsData[method].concentrationOfHydrogenForMedium = { value, status: "Unverified" };
                                                                            return { ...prev, speciesData };
                                                                        });
                                                                    }}
                                                                    InfoTooltip={<InfoTooltip message="Enter the measured concentration of dissolved molecular hydrogen in the cell culture medium, expressed in micromoles per liter (µM/L)." />}
                                                                />

                                                                {/* Volume of Medium Used */}
                                                                <ReuseableInput
                                                                    label="Volume of Medium Used"
                                                                    type="number"
                                                                    name={`volumeOfMedium-${method}`}
                                                                    value={formData.speciesData?.[specie]?.methodsData?.[method]?.volumeOfMedium?.value || ""}
                                                                    onChange={(value) => {
                                                                        setFormData(prev => {
                                                                            const speciesData = { ...prev.speciesData };
                                                                            if (!speciesData[specie]) speciesData[specie] = {};
                                                                            if (!speciesData[specie].methodsData) speciesData[specie].methodsData = {};
                                                                            if (!speciesData[specie].methodsData[method]) speciesData[specie].methodsData[method] = {};
                                                                            speciesData[specie].methodsData[method].volumeOfMedium = { 
                                                                                value, 
                                                                                unit: speciesData[specie].methodsData[method]?.volumeOfMedium?.unit || "mL",
                                                                                status: "Unverified" 
                                                                            };
                                                                            return { ...prev, speciesData };
                                                                        });
                                                                    }}
                                                                    unit={formData.speciesData?.[specie]?.methodsData?.[method]?.volumeOfMedium?.unit || "mL"}
                                                                    onUnitChange={(unit) => {
                                                                        setFormData(prev => {
                                                                            const speciesData = { ...prev.speciesData };
                                                                            if (!speciesData[specie]) speciesData[specie] = {};
                                                                            if (!speciesData[specie].methodsData) speciesData[specie].methodsData = {};
                                                                            if (!speciesData[specie].methodsData[method]) speciesData[specie].methodsData[method] = {};
                                                                            speciesData[specie].methodsData[method].volumeOfMedium = { 
                                                                                value: speciesData[specie].methodsData[method]?.volumeOfMedium?.value || "",
                                                                                unit, 
                                                                                status: "Unverified" 
                                                                            };
                                                                            return { ...prev, speciesData };
                                                                        });
                                                                    }}
                                                                    options={["mL", "L"]}
                                                                    InfoTooltip={<InfoTooltip message="Enter the total volume of culture medium used in the experiment." />}
                                                                />

                                                                {/* Total Exposure Duration */}
                                                                <ReuseableInput
                                                                    label="Total Exposure Duration"
                                                                    type="number"
                                                                    name={`exposureDuration-${method}`}
                                                                    value={formData.speciesData?.[specie]?.methodsData?.[method]?.exposureDuration?.value || ""}
                                                                    onChange={(value) => {
                                                                        setFormData(prev => {
                                                                            const speciesData = { ...prev.speciesData };
                                                                            if (!speciesData[specie]) speciesData[specie] = {};
                                                                            if (!speciesData[specie].methodsData) speciesData[specie].methodsData = {};
                                                                            if (!speciesData[specie].methodsData[method]) speciesData[specie].methodsData[method] = {};
                                                                            speciesData[specie].methodsData[method].exposureDuration = { 
                                                                                value, 
                                                                                unit: speciesData[specie].methodsData[method]?.exposureDuration?.unit || "minutes",
                                                                                status: "Unverified" 
                                                                            };
                                                                            return { ...prev, speciesData };
                                                                        });
                                                                    }}
                                                                    unit={formData.speciesData?.[specie]?.methodsData?.[method]?.exposureDuration?.unit || "minutes"}
                                                                    onUnitChange={(unit) => {
                                                                        setFormData(prev => {
                                                                            const speciesData = { ...prev.speciesData };
                                                                            if (!speciesData[specie]) speciesData[specie] = {};
                                                                            if (!speciesData[specie].methodsData) speciesData[specie].methodsData = {};
                                                                            if (!speciesData[specie].methodsData[method]) speciesData[specie].methodsData[method] = {};
                                                                            speciesData[specie].methodsData[method].exposureDuration = { 
                                                                                value: speciesData[specie].methodsData[method]?.exposureDuration?.value || "",
                                                                                unit, 
                                                                                status: "Unverified" 
                                                                            };
                                                                            return { ...prev, speciesData };
                                                                        });
                                                                    }}
                                                                    options={["minutes", "hours"]}
                                                                    InfoTooltip={<InfoTooltip message="Indicate how long the cells were exposed to the hydrogen-enriched medium." />}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })
                                        }

                                        {/* Ingestion of H2-producing bacteria - OLD COMBINED SECTION (HIDDEN) */}
                                        {false && formData.speciesData?.[specie]?.methods?.some(
  method => method.toLowerCase().includes("ingestion")
) && (
                                            <div className="border border-gray-300 rounded-lg shadow-sm mb-4">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleIngestionInfo(specie)}
                                                    className="w-full text-left px-4 py-2 flex justify-between items-center bg-blue-100 rounded-t-lg hover:bg-blue-200 focus:outline-none"
                                                    style={{ color: colorTheme.primary, fontWeight: "bold" }}
                                                >
                                                    <span>{`${
                                                        //show that method name here  that contains "ingestion" or "Ingestion"
                                                        formData.speciesData[specie]?.methods?.find(method => method.toLowerCase().includes("ingestion")) || ""

                                                    } for ${specie}`}</span>
                                                    <span>{formData.speciesData[specie]?.isIngestionOpen ? "-" : "+"}</span>
                                                </button>

                                                {/* Fields inside Accordion */}
                                                {formData.speciesData[specie]?.isIngestionOpen && (
                                                    <div className="px-4 py-2">
                                                        <>
                                                            <Input
                                                                label="Peak breath hydrogen concentration?"
                                                                name="Peakbreathhydrogen"
                                                                value={formData.speciesData?.[specie]?.Peakbreathhydrogen?.name || ""}
                                                                onChange={(value) => handleSpecificInputChange(specie, value, "Peakbreathhydrogen")}
                                                                InfoTooltip={<InfoTooltip message="Enter the maximum hydrogen concentration in the breath measured during the study. Use units such as ppm (parts per million)." />}

                                                                isSpecialAction={isSpecialAction}
                                                                customStatusComponent={
                                                                    <div className="flex items-center space-x-4">
                                                                        <label className="flex items-center">
                                                                            <input
                                                                                type="radio"
                                                                                name={`Peakbreathhydrogen-${specie}-status`}
                                                                                value="Verified"
                                                                                checked={formData.speciesData?.[specie]?.Peakbreathhydrogen?.status === "Verified"}
                                                                                onChange={() => handleStatusChangeMulti("Peakbreathhydrogen", "Verified", specie)}
                                                                                className="mr-1"
                                                                            />
                                                                            <span>Verified</span>
                                                                        </label>
                                                                        <label className="flex items-center">
                                                                            <input
                                                                                type="radio"
                                                                                name={`Peakbreathhydrogen-${specie}-status`}
                                                                                value="Unverified"
                                                                                checked={formData.speciesData?.[specie]?.Peakbreathhydrogen?.status === "Unverified"}
                                                                                onChange={() => handleStatusChangeMulti("Peakbreathhydrogen", "Unverified", specie)}
                                                                                className="mr-1"
                                                                            />
                                                                            <span>Unverified</span>
                                                                        </label>
                                                                    </div>
                                                                }

                                                            />

                                                            <Input
                                                                label="Frequency"
                                                                name="Frequency"
                                                                value={formData.speciesData?.[specie]?.Frequency?.name || ""}
                                                                onChange={(value) => handleSpecificInputChange(specie, value, "Frequency")}
                                                                InfoTooltip={<InfoTooltip message="How many times per day did they take ingest it?" />}

                                                                isSpecialAction={isSpecialAction}
                                                                customStatusComponent={
                                                                    <div className="flex items-center space-x-4">
                                                                        <label className="flex items-center">
                                                                            <input
                                                                                type="radio"
                                                                                name={`Frequency-${specie}-status`}
                                                                                value="Verified"
                                                                                checked={formData.speciesData?.[specie]?.Frequency?.status === "Verified"}
                                                                                onChange={() => handleStatusChangeMulti("Frequency", "Verified", specie)}
                                                                                className="mr-1"
                                                                            />
                                                                            <span>Verified</span>
                                                                        </label>
                                                                        <label className="flex items-center">
                                                                            <input
                                                                                type="radio"
                                                                                name={`Frequency-${specie}-status`}
                                                                                value="Unverified"
                                                                                checked={formData.speciesData?.[specie]?.Frequency?.status === "Unverified"}
                                                                                onChange={() => handleStatusChangeMulti("Frequency", "Unverified", specie)}
                                                                                className="mr-1"
                                                                            />
                                                                            <span>Unverified</span>
                                                                        </label>
                                                                    </div>
                                                                }

                                                            />

                                                            <InputWithUnit
                                                                type="number"
                                                                label="Duration per frequency"
                                                                name="IngestionDurationfrequency"
                                                                value={formData.speciesData?.[specie]?.IngestionDurationfrequency?.value || ""}
                                                                onChange={(value) =>
                                                                    handleSpecificInputChange(
                                                                        specie,
                                                                        value,
                                                                        "IngestionDurationfrequency",
                                                                        formData.speciesData?.[specie]?.IngestionDurationfrequency?.unit
                                                                    )
                                                                }
                                                                error={validationErrors?.[specie]?.IngestionDurationfrequency}
                                                                unit={formData.speciesData?.[specie]?.IngestionDurationfrequency?.unit || "minutes"}
                                                                onUnitChange={(newUnit) =>
                                                                    handleSpecificInputChange(
                                                                        specie,
                                                                        formData.speciesData?.[specie]?.IngestionDurationfrequency?.value,
                                                                        "IngestionDurationfrequency",
                                                                        newUnit
                                                                    )
                                                                }
                                                                options={["Min", "Hr"]}

                                                                isSpecialAction={isSpecialAction}
                                                                customStatusComponent={
                                                                    <div className="flex items-center space-x-4">
                                                                        <label className="flex items-center">
                                                                            <input
                                                                                type="radio"
                                                                                name={`IngestionDurationfrequency-${specie}-status`}
                                                                                value="Verified"
                                                                                checked={formData.speciesData?.[specie]?.IngestionDurationfrequency?.status === "Verified"}
                                                                                onChange={() => handleStatusChangeMulti("IngestionDurationfrequency", "Verified", specie)}
                                                                                className="mr-1"
                                                                            />
                                                                            <span>Verified</span>
                                                                        </label>
                                                                        <label className="flex items-center">
                                                                            <input
                                                                                type="radio"
                                                                                name={`IngestionDurationfrequency-${specie}-status`}
                                                                                value="Unverified"
                                                                                checked={formData.speciesData?.[specie]?.IngestionDurationfrequency?.status === "Unverified"}
                                                                                onChange={() => handleStatusChangeMulti("IngestionDurationfrequency", "Unverified", specie)}
                                                                                className="mr-1"
                                                                            />
                                                                            <span>Unverified</span>
                                                                        </label>
                                                                    </div>
                                                                }
                                                            />
                                                        </>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {/* Ingestion of H2-producing bacteria - OLD COMBINED SECTION END */}

                                        {/* NEW: Separate tabs for each Ingestion method */}
                                        {(formData.speciesData?.[specie]?.methods || [])
                                            .filter(method => method.toLowerCase().includes("ingestion"))
                                            .map((method) => {
                                                const uniqueKey = `${specie}-${method}-ingestion`;
                                                return (
                                                    <div
                                                        className="border border-gray-300 rounded-lg shadow-sm mb-4"
                                                        key={uniqueKey}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => openConcentrationHandle(uniqueKey)}
                                                            className="w-full text-left px-4 py-2 flex justify-between items-center bg-blue-100 rounded-t-lg hover:bg-blue-200 focus:outline-none"
                                                            style={{ color: colorTheme.primary, fontWeight: "bold" }}
                                                        >
                                                            <span>{`${method} for ${specie}`}</span>
                                                            <span>{showConcentrationForm[uniqueKey] ? "-" : "+"}</span>
                                                        </button>

                                                        {showConcentrationForm[uniqueKey] && (
                                                            <div className="px-4 py-2">
                                                                {/* Peak breath hydrogen */}
                                                                <Input
                                                                    label="Peak breath hydrogen concentration?"
                                                                    name={`Peakbreathhydrogen-${method}`}
                                                                    value={formData.speciesData?.[specie]?.methodsData?.[method]?.peakBreathHydrogen?.value || ""}
                                                                    onChange={(value) => {
                                                                        setFormData(prev => {
                                                                            const speciesData = { ...prev.speciesData };
                                                                            if (!speciesData[specie]) speciesData[specie] = {};
                                                                            if (!speciesData[specie].methodsData) speciesData[specie].methodsData = {};
                                                                            if (!speciesData[specie].methodsData[method]) speciesData[specie].methodsData[method] = {};
                                                                            speciesData[specie].methodsData[method].peakBreathHydrogen = { value, status: "Unverified" };
                                                                            return { ...prev, speciesData };
                                                                        });
                                                                    }}
                                                                    InfoTooltip={<InfoTooltip message="Enter the maximum hydrogen concentration in the breath measured during the study." />}
                                                                />

                                                                {/* Frequency */}
                                                                <Input
                                                                    label="Frequency"
                                                                    name={`Frequency-${method}`}
                                                                    value={formData.speciesData?.[specie]?.methodsData?.[method]?.frequency?.value || ""}
                                                                    onChange={(value) => {
                                                                        setFormData(prev => {
                                                                            const speciesData = { ...prev.speciesData };
                                                                            if (!speciesData[specie]) speciesData[specie] = {};
                                                                            if (!speciesData[specie].methodsData) speciesData[specie].methodsData = {};
                                                                            if (!speciesData[specie].methodsData[method]) speciesData[specie].methodsData[method] = {};
                                                                            speciesData[specie].methodsData[method].frequency = { value, status: "Unverified" };
                                                                            return { ...prev, speciesData };
                                                                        });
                                                                    }}
                                                                    InfoTooltip={<InfoTooltip message="How many times per day did they ingest it?" />}
                                                                />

                                                                {/* Duration per Frequency */}
                                                                <InputWithUnit
                                                                    type="number"
                                                                    label="Duration per Frequency"
                                                                    name={`IngestionDuration-${method}`}
                                                                    value={formData.speciesData?.[specie]?.methodsData?.[method]?.duration?.value || ""}
                                                                    onChange={(value) => {
                                                                        setFormData(prev => {
                                                                            const speciesData = { ...prev.speciesData };
                                                                            if (!speciesData[specie]) speciesData[specie] = {};
                                                                            if (!speciesData[specie].methodsData) speciesData[specie].methodsData = {};
                                                                            if (!speciesData[specie].methodsData[method]) speciesData[specie].methodsData[method] = {};
                                                                            speciesData[specie].methodsData[method].duration = { 
                                                                                value, 
                                                                                unit: speciesData[specie].methodsData[method]?.duration?.unit || "minutes",
                                                                                status: "Unverified" 
                                                                            };
                                                                            return { ...prev, speciesData };
                                                                        });
                                                                    }}
                                                                    unit={formData.speciesData?.[specie]?.methodsData?.[method]?.duration?.unit || "minutes"}
                                                                    onUnitChange={(unit) => {
                                                                        setFormData(prev => {
                                                                            const speciesData = { ...prev.speciesData };
                                                                            if (!speciesData[specie]) speciesData[specie] = {};
                                                                            if (!speciesData[specie].methodsData) speciesData[specie].methodsData = {};
                                                                            if (!speciesData[specie].methodsData[method]) speciesData[specie].methodsData[method] = {};
                                                                            speciesData[specie].methodsData[method].duration = { 
                                                                                value: speciesData[specie].methodsData[method]?.duration?.value || "",
                                                                                unit, 
                                                                                status: "Unverified" 
                                                                            };
                                                                            return { ...prev, speciesData };
                                                                        });
                                                                    }}
                                                                    options={["minutes", "hours"]}
                                                                    InfoTooltip={<InfoTooltip message="How long was each ingestion session?" />}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })
                                        }

                                        {/* Topical Applications - OLD SECTION (HIDDEN) */}
                                        {false && formData.speciesData?.[specie]?.methods?.includes("Topical applications") && (
                                            <CustomCreatableSelect
                                                isCreate={false}
                                                label="Method of Topical Application"
                                                name="topicalMethod"
                                                options={["Bathing", "Soaking", "Cream", "Direct Application"]}
                                                value={formData.speciesData?.[specie]?.topicalMethod || ""}
                                                onChange={(value) => handleSpecificInputChange(specie, value, "topicalMethod")}
                                                isSpecialAction={isSpecialAction}
                                                customStatusComponent={
                                                    <div className="flex items-center space-x-4">
                                                        <label className="flex items-center">
                                                            <input
                                                                type="radio"
                                                                name={`topicalMethod-${specie}-status`}
                                                                value="Verified"
                                                                checked={formData.speciesData?.[specie]?.topicalMethod?.status === "Verified"}
                                                                onChange={() => handleStatusChangeMulti("topicalMethod", "Verified", specie)}
                                                                className="mr-1"
                                                            />
                                                            <span>Verified</span>
                                                        </label>
                                                        <label className="flex items-center">
                                                            <input
                                                                type="radio"
                                                                name={`topicalMethod-${specie}-status`}
                                                                value="Unverified"
                                                                checked={formData.speciesData?.[specie]?.topicalMethod?.status === "Unverified"}
                                                                onChange={() => handleStatusChangeMulti("topicalMethod", "Unverified", specie)}
                                                                className="mr-1"
                                                            />
                                                            <span>Unverified</span>
                                                        </label>
                                                    </div>
                                                }
                                            />

                                        )}

                                        {/* NEW: Separate tabs for each Topical Application method */}
                                        {(formData.speciesData?.[specie]?.methods || [])
                                            .filter(method => method.toLowerCase().includes("topical"))
                                            .map((method) => {
                                                const uniqueKey = `${specie}-${method}-topical`;
                                                return (
                                                    <div
                                                        className="border border-gray-300 rounded-lg shadow-sm mb-4"
                                                        key={uniqueKey}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => openConcentrationHandle(uniqueKey)}
                                                            className="w-full text-left px-4 py-2 flex justify-between items-center bg-blue-100 rounded-t-lg hover:bg-blue-200 focus:outline-none"
                                                            style={{ color: colorTheme.primary, fontWeight: "bold" }}
                                                        >
                                                            <span>{`${method} for ${specie}`}</span>
                                                            <span>{showConcentrationForm[uniqueKey] ? "-" : "+"}</span>
                                                        </button>

                                                        {showConcentrationForm[uniqueKey] && (
                                                            <div className="px-4 py-2">
                                                                {/* Method of Topical Application */}
                                                                <CustomCreatableSelect
                                                                    isCreate={false}
                                                                    label="Method of Topical Application"
                                                                    name={`topicalMethod-${method}`}
                                                                    options={["Bathing", "Soaking", "Cream", "Direct Application"]}
                                                                    value={formData.speciesData?.[specie]?.methodsData?.[method]?.topicalMethod?.value || ""}
                                                                    onChange={(value) => {
                                                                        setFormData(prev => {
                                                                            const speciesData = { ...prev.speciesData };
                                                                            if (!speciesData[specie]) speciesData[specie] = {};
                                                                            if (!speciesData[specie].methodsData) speciesData[specie].methodsData = {};
                                                                            if (!speciesData[specie].methodsData[method]) speciesData[specie].methodsData[method] = {};
                                                                            speciesData[specie].methodsData[method].topicalMethod = { value, status: "Unverified" };
                                                                            return { ...prev, speciesData };
                                                                        });
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })
                                        }






                                    </Accordion>
                                );
                            })
                        ) : <>

                            <CustomCreatableSelect
                                isCreate={true}
                                label="Methods of Administration"
                                name="methodOfAdmin"
                                options={get_method_data?.methods?.map(method => method.name).sort((a, b) => a.localeCompare(b)) || []}
                                value={formData.methodOfAdmin}
                                onChange={handleInputChange}
                                isMulti
                                handleAddSpecies={handleAddMethods}
                                InfoTooltip={
                                    <InfoTooltip
                                        width="400px"
                                        message={
                                            <span>
                                                <strong>Select the method(s) used to administer hydrogen in the study.</strong>
                                            </span>
                                        }
                                    />
                                }

                            />

                            {/* ========================================= Inhalation ========================================= */}

                            {ShowInhalationRedux && (
                                <>
                                    <CustomCreatableSelect
                                        isCreate={false}
                                        label="Was Oxyhydrogen used?"
                                        name="wasOxyhydrogenUsed"
                                        options={['Yes', 'No']}
                                        value={formData.wasOxyhydrogenUsed}
                                        onChange={handleInputChange}
                                        isSpecialAction={isSpecialAction} // Pass isSpecialAction
                                        status={formData?.wasOxyhydrogenUsed?.status} // Pass status
                                        onStatusChange={handleStatusChange} // Pass status change handler
                                    />
                                </>
                            )}

                            {ShowInhalationRedux && <div className="border border-gray-300 rounded-lg shadow-sm mb-4">
                                <button
                                    type="button"
                                    onClick={openInhalationHandle}
                                    className="w-full text-left px-4 py-2 flex justify-between items-center bg-blue-100 rounded-t-lg hover:bg-blue-200 focus:outline-none"
                                    style={{ color: colorTheme.primary, fontWeight: 'bold' }}
                                >
                                    <span>{"Inhalation Concentration"}</span>
                                    <span>{isInhalationInformation ? '-' : '+'}</span>
                                </button>

                                {isInhalationInformation && <div className=' px-4 py-2'>


                                    <>
                                        <Input
                                            label="How many unique concentrations/flow rates/percentages were used in this study?"
                                            name="numInhalationConcentrations"
                                            value={formData.numInhalationConcentrations?.name}
                                            onChange={handleInputChange}
                                            isSpecialAction={isSpecialAction} // Pass isSpecialAction
                                            status={formData?.numInhalationConcentrations?.status} // Pass status
                                            onStatusChange={handleStatusChange} // Pass status change handler
                                        />
                                    </>


                                    {ShowInhalationRedux && formData?.inhalationConcentrations?.map((inhalationConcentration, index) => (
                                        <div key={index} className="inhalation-concentration-block border rounded-lg p-4 mb-4 shadow-sm">
                                            <h3 className="text-lg font-bold mb-4">Inhalation Concentration {index + 1}</h3>

                                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                                <div>
                                                    <Input
                                                        label="Percent Purity"
                                                        name={`inhalationConcentration_${index}_percentPurity`}
                                                        // value={inhalationConcentration?.percentPurity?.name || ""}
                                                        // onChange={handleInputChange}
                                                        value={
                                                            // Format the value to ensure consistency:
                                                            // 1. Remove any existing % signs
                                                            // 2. Show the clean numeric value
                                                            inhalationConcentration?.percentPurity?.name
                                                                ? inhalationConcentration.percentPurity.name.toString().replace(/%/g, '')
                                                                : ""
                                                        }
                                                        onChange={(value, name) => {
                                                            // Clean the input value - only allow numbers and decimal point
                                                            const cleanValue = value.replace(/%/g, '');

                                                            // Only proceed if empty or valid number pattern
                                                            if (cleanValue === '' || /^(\d+)?(\.\d*)?$/.test(cleanValue)) {
                                                                handleInputChange(cleanValue, name);
                                                            }
                                                        }}
                                                        InfoTooltip={
                                                            <InfoTooltip message="Indicate the percentage of hydrogen purity used in the inhalation method. Enter as a numerical value (e.g., 99%, 2.5%)." />
                                                        }
                                                        isSpecialAction={isSpecialAction}
                                                        customStatusComponent={
                                                            <div className="flex items-center space-x-4">
                                                                <label className="flex items-center">
                                                                    <input
                                                                        type="radio"
                                                                        name={`percentPurity-status-${index}`}
                                                                        value="Verified"
                                                                        checked={inhalationConcentration?.percentPurity?.status === "Verified"}
                                                                        onChange={() => handleStatusChangeSimpleInhalation("percentPurity", "Verified", index)}
                                                                        className="mr-1"
                                                                    />
                                                                    <span>Verified</span>
                                                                </label>
                                                                <label className="flex items-center">
                                                                    <input
                                                                        type="radio"
                                                                        name={`percentPurity-status-${index}`}
                                                                        value="Unverified"
                                                                        checked={inhalationConcentration?.percentPurity?.status === "Unverified"}
                                                                        onChange={() => handleStatusChangeSimpleInhalation("percentPurity", "Unverified", index)}
                                                                        className="mr-1"
                                                                    />
                                                                    <span>Unverified</span>
                                                                </label>
                                                            </div>
                                                        }

                                                    />
                                                </div>

                                                <div>
                                                    <ReuseableInput
                                                        label="Flow Rate of Hydrogen"
                                                        type="number"
                                                        name={`inhalationConcentration_${index}_flowRate`}
                                                        value={inhalationConcentration?.flowRate?.name || ""}
                                                        onChange={(value, name) =>
                                                            handleInputChange(value, `inhalationConcentration_${index}_flowRate`)
                                                        }
                                                        unit={inhalationConcentration?.unitFlowRate?.name || "mL/min"}
                                                        onUnitChange={(newUnit) =>
                                                            handleInputChange(newUnit, `inhalationConcentration_${index}_unitFlowRate`)
                                                        }
                                                        options={["mL/min"]}
                                                        InfoTooltip={
                                                            <InfoTooltip message="Specifies the rate at which hydrogen gas is delivered to the subject, measured in milliliters per minute (mL/min)" />
                                                        }
                                                        isSpecialAction={isSpecialAction}
                                                        customStatusComponent={
                                                            <div className="flex items-center space-x-4">
                                                                <label className="flex items-center">
                                                                    <input
                                                                        type="radio"
                                                                        name={`flowRate-status-${index}`}
                                                                        value="Verified"
                                                                        checked={inhalationConcentration?.flowRate?.status === "Verified"}
                                                                        onChange={() => handleStatusChangeSimpleInhalation("flowRate", "Verified", index)}
                                                                        className="mr-1"
                                                                    />
                                                                    <span>Verified</span>
                                                                </label>
                                                                <label className="flex items-center">
                                                                    <input
                                                                        type="radio"
                                                                        name={`flowRate-status-${index}`}
                                                                        value="Unverified"
                                                                        checked={inhalationConcentration?.flowRate?.status === "Unverified"}
                                                                        onChange={() => handleStatusChangeSimpleInhalation("flowRate", "Unverified", index)}
                                                                        className="mr-1"
                                                                    />
                                                                    <span>Unverified</span>
                                                                </label>
                                                            </div>
                                                        }

                                                    />
                                                </div>

                                                <div>
                                                    <Input
                                                        label="Frequency of Hydrogen Inhalation"
                                                        name={`inhalationConcentration_${index}_frequency`}
                                                        value={inhalationConcentration?.frequency?.name || ""}
                                                        onChange={handleInputChange}
                                                        InfoTooltip={<InfoTooltip message="How many times per day was the hydrogen administered?" />}
                                                        isSpecialAction={isSpecialAction}
                                                        customStatusComponent={
                                                            <div className="flex items-center space-x-4">
                                                                <label className="flex items-center">
                                                                    <input
                                                                        type="radio"
                                                                        name={`frequency-status-${index}`}
                                                                        value="Verified"
                                                                        checked={inhalationConcentration?.frequency?.status === "Verified"}
                                                                        onChange={() => handleStatusChangeSimpleInhalation("frequency", "Verified", index)}
                                                                        className="mr-1"
                                                                    />
                                                                    <span>Verified</span>
                                                                </label>
                                                                <label className="flex items-center">
                                                                    <input
                                                                        type="radio"
                                                                        name={`frequency-status-${index}`}
                                                                        value="Unverified"
                                                                        checked={inhalationConcentration?.frequency?.status === "Unverified"}
                                                                        onChange={() => handleStatusChangeSimpleInhalation("frequency", "Unverified", index)}
                                                                        className="mr-1"
                                                                    />
                                                                    <span>Unverified</span>
                                                                </label>
                                                            </div>
                                                        }

                                                    />
                                                </div>

                                                <div>
                                                    <InputWithUnit
                                                        type="number"
                                                        label="Duration per Frequency"
                                                        name={`inhalationConcentration_${index}_duration`}
                                                        value={inhalationConcentration?.duration?.name || ""}
                                                        onChange={handleInputChange}
                                                        InfoTooltip={<InfoTooltip message="How many minutes or hours did they inhale the hydrogen gas?" />}
                                                        unit={inhalationConcentration?.unitDuration?.name || "minutes"}
                                                        onUnitChange={(newUnit) =>
                                                            handleInputChange(newUnit, `inhalationConcentration_${index}_unitDuration`)
                                                        }
                                                        isSpecialAction={isSpecialAction}
                                                        customStatusComponent={
                                                            <div className="flex items-center space-x-4">
                                                                <label className="flex items-center">
                                                                    <input
                                                                        type="radio"
                                                                        name={`duration-status-${index}`}
                                                                        value="Verified"
                                                                        checked={inhalationConcentration?.duration?.status === "Verified"}
                                                                        onChange={() => handleStatusChangeSimpleInhalation("duration", "Verified", index)}
                                                                        className="mr-1"
                                                                    />
                                                                    <span>Verified</span>
                                                                </label>
                                                                <label className="flex items-center">
                                                                    <input
                                                                        type="radio"
                                                                        name={`duration-status-${index}`}
                                                                        value="Unverified"
                                                                        checked={inhalationConcentration?.duration?.status === "Unverified"}
                                                                        onChange={() => handleStatusChangeSimpleInhalation("duration", "Unverified", index)}
                                                                        className="mr-1"
                                                                    />
                                                                    <span>Unverified</span>
                                                                </label>
                                                            </div>
                                                        }

                                                    />
                                                </div>

                                            </div>
                                        </div>


                                    ))}

                                </div>}
                            </div>}


                            {/* ============================================ Inhalation ====================================== */}


                            {formData?.ConcentrationsQuestions?.map((item, index) => (
                                <div key={index} className="mb-4">
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        {item.question}
                                    </label>
                                    <input
                                        type={item.type === 'number' ? 'number' : 'text'}  // Use number type for specific question
                                        value={item.answer}
                                        onChange={(e) => {
                                            const updatedQuestions = [...formData.ConcentrationsQuestions];
                                            updatedQuestions[index].answer = e.target.value;
                                            setFormData((prevState) => ({
                                                ...prevState,
                                                ConcentrationsQuestions: updatedQuestions
                                            }));
                                        }}
                                        className="border w-full px-4 py-2 rounded"
                                        placeholder={item.type === 'number' ? "Enter volume in liters" : "Enter concentration"}
                                    />
                                </div>
                            ))}

                            {ShowConcernReportRedux && <>
                                <div className="border border-gray-300 rounded-lg shadow-sm mb-4">
                                    <button
                                        type="button"
                                        onClick={openSimpleConcentrationHandle}
                                        className="w-full text-left px-4 py-2 flex justify-between items-center bg-blue-100 rounded-t-lg hover:bg-blue-200 focus:outline-none"
                                        style={{ color: colorTheme.primary, fontWeight: 'bold' }}
                                    >
                                        <span>{"Concentration Report"}</span>
                                        <span>{showConcentrationForm.simple ? '-' : '+'}</span>
                                    </button>


                                    {showConcentrationForm.simple && (
                                        <div className=' px-4 py-2'>


                                            <div>

                                                <Input
                                                    type="number"
                                                    label="How many unique hydrogen concentrations were used in this study?"
                                                    name="HowManyConcentrations"
                                                    value={formData.HowManyConcentrations?.name}
                                                    min={1}
                                                    max={10}
                                                    onChange={handleInputChange}
                                                    InfoTooltip={
                                                        <InfoTooltip message="If the experiment used different groups with varied hydrogen concentrations, count each as a separate concentration." />
                                                    }
                                                    isCheck={false}
                                                    style={{
                                                        border: formData.HowManyConcentrations && "2px solid gray"
                                                    }}
                                                    isSpecialAction={isSpecialAction} // Pass isSpecialAction
                                                    status={formData?.HowManyConcentrations?.status} // Pass status
                                                    onStatusChange={handleStatusChange} // Pass status change handler
                                                />


                                                {formData.volumes?.map((volume, index) => (
                                                    <ReuseableInput
                                                        isCheck={false}
                                                        type='number'
                                                        key={index}
                                                        label={`Volume of water consumed per day ${index + 1}`}
                                                        value={volume.value?.name}
                                                        unit={volume.unit?.name}
                                                        options={["mL", "L"]}
                                                        onChange={(value) => handleInputChange(value, `volume_${index}_value`)}
                                                        onUnitChange={(unit) => handleInputChange(unit, `volume_${index}_unit`)}
                                                        paddingRight={"0px"}
                                                        width={"40px"}
                                                        InfoTooltip={
                                                            <InfoTooltip message="Specify the total volume of hydrogen water consumed daily. For animals, research the species to determine typical daily water intake if volume is not directly reported." />
                                                        }
                                                        style={{
                                                            border: volume.value && "2px solid gray"
                                                        }}
                                                        isSpecialAction={isSpecialAction}
                                                        customStatusComponent={
                                                            <div className="flex items-center space-x-4">
                                                                <label className="flex items-center">
                                                                    <input
                                                                        type="radio"
                                                                        name={`volume-status-${index}`}
                                                                        value="Verified"
                                                                        checked={volume?.value?.status === "Verified"}  // 🔹 FIXED HERE
                                                                        onChange={() => handleStatusSimpleConcentration("volumes", "Verified", index)}
                                                                    />
                                                                    <span className="ml-1">Verified</span>
                                                                </label>
                                                                <label className="flex items-center">
                                                                    <input
                                                                        type="radio"
                                                                        name={`volume-status-${index}`}
                                                                        value="Unverified"
                                                                        checked={volume?.value?.status === "Unverified"}  // 🔹 FIXED HERE
                                                                        onChange={() => handleStatusSimpleConcentration("volumes", "Unverified", index)}
                                                                    />
                                                                    <span className="ml-1">Unverified</span>
                                                                </label>
                                                            </div>
                                                        }

                                                    />
                                                ))}


                                                {formData.concentrations?.map((concentration, index) => (
                                                    <ReuseableInput
                                                        isCheck={false}
                                                        type='number'
                                                        key={index}
                                                        label={`Concentration ${index + 1}`}
                                                        value={concentration.value?.name}
                                                        unit={concentration.unit?.name}
                                                        options={unitOptions}
                                                        onChange={(value) =>
                                                            handleInputChange(value, `concentration_${index}_value`)
                                                        }
                                                        onUnitChange={(unit) =>
                                                            handleInputChange(unit, `concentration_${index}_unit`)
                                                        }
                                                        paddingRight={"0px"}
                                                        width={"60px"}
                                                        InfoTooltip={
                                                            <InfoTooltip message="Enter the hydrogen concentration used in the study." />
                                                        }
                                                        style={{
                                                            border: concentration.value && "2px solid gray"
                                                        }}
                                                        isSpecialAction={isSpecialAction}
                                                        customStatusComponent={
                                                            <div className="flex items-center space-x-4">
                                                                <label className="flex items-center">
                                                                    <input
                                                                        type="radio"
                                                                        name={`concentration-status-${index}`}
                                                                        value="Verified"
                                                                        checked={concentration?.value?.status === "Verified"}  // 🔹 FIXED HERE
                                                                        onChange={() => handleStatusSimpleConcentration("concentrations", "Verified", index)}
                                                                    />
                                                                    <span className="ml-1">Verified</span>
                                                                </label>
                                                                <label className="flex items-center">
                                                                    <input
                                                                        type="radio"
                                                                        name={`concentration-status-${index}`}
                                                                        value="Unverified"
                                                                        checked={concentration?.value?.status === "Unverified"}  // 🔹 FIXED HERE
                                                                        onChange={() => handleStatusSimpleConcentration("concentrations", "Unverified", index)}
                                                                    />
                                                                    <span className="ml-1">Unverified</span>
                                                                </label>
                                                            </div>
                                                        }
                                                    />
                                                ))}


                                                {formData.absoluteDoses?.map((dose, index) => (
                                                    <ReuseableInput
                                                        key={index}
                                                        label={`Absolute Dose per Day ${index + 1}`}
                                                        value={dose.value?.name}
                                                        unit={dose.unit?.name}
                                                        options={["mg/day"]}
                                                        onChange={(value) => handleInputChange(value, `absoluteDoses_${index}_value`)}
                                                        onUnitChange={(unit) => handleInputChange(unit, `absoluteDoses_${index}_unit`)}
                                                        isCheck={false}
                                                        InfoTooltip={
                                                                            <InfoTooltip message={
                                                                                `How to calculate Absolute Dose per Day:\n\n1. Ensure both concentration and volume are in compatible units (e.g., mg/L and L).\n2. Multiply the hydrogen concentration by the total volume consumed per day.\n3. Result is in mg/day.\n\nExample: If concentration = 0.5 mg/L and volume = 2 L/day, then Absolute Dose = 0.5 mg/L × 2 L = 1 mg/day.`}
                                                                            />
                                                                        }
                                                        style={{
                                                            border: dose.value && "2px solid gray"
                                                        }}

                                                        isSpecialAction={isSpecialAction}
                                                        customStatusComponent={
                                                            <div className="flex items-center space-x-4">
                                                                <label className="flex items-center">
                                                                    <input
                                                                        type="radio"
                                                                        name={`dose-status-${index}`}
                                                                        value="Verified"
                                                                        checked={dose?.value?.status === "Verified"}  // 🔹 FIXED HERE
                                                                        onChange={() => handleStatusSimpleConcentration("absoluteDoses", "Verified", index)}
                                                                    />
                                                                    <span className="ml-1">Verified</span>
                                                                </label>
                                                                <label className="flex items-center">
                                                                    <input
                                                                        type="radio"
                                                                        name={`dose-status-${index}`}
                                                                        value="Unverified"
                                                                        checked={dose?.value?.status === "Unverified"}  // 🔹 FIXED HERE
                                                                        onChange={() => handleStatusSimpleConcentration("absoluteDoses", "Unverified", index)}
                                                                    />
                                                                    <span className="ml-1">Unverified</span>
                                                                </label>
                                                            </div>
                                                        }
                                                    />
                                                ))}


                                                {formData.relativeDoses?.map((dose, index) => (
                                                    <ReuseableInput
                                                        isCheck={false}
                                                        key={index}
                                                        label={`Relative Dose per Day ${index + 1}`}
                                                        value={dose.value?.name}
                                                        unit={dose.unit?.name}
                                                        options={["mg/kg/day"]}
                                                        onChange={(value) => handleInputChange(value, `relativeDoses_${index}_value`)} // Handles value updates
                                                        onUnitChange={(unit) => handleInputChange(unit, `relativeDoses_${index}_unit`)} // Handles unit updates
                                                        InfoTooltip={
                                                            <InfoTooltip message="Calculate by taking the absolute dose divided by the average weight of the species in the study. Verify unit conversions for accuracy." />
                                                        }
                                                        style={{
                                                            border: dose.value && dose.value !== 0.0 ? "2px solid gray" : undefined,
                                                        }}
                                                        isSpecialAction={isSpecialAction}
                                                        customStatusComponent={
                                                            <div className="flex items-center space-x-4">
                                                                <label className="flex items-center">
                                                                    <input
                                                                        type="radio"
                                                                        name={`relative-dose-status-${index}`}
                                                                        value="Verified"
                                                                        checked={dose?.value?.status === "Verified"}  // 🔹 FIXED HERE
                                                                        onChange={() => handleStatusSimpleConcentration("relativeDoses", "Verified", index)}
                                                                    />
                                                                    <span className="ml-1">Verified</span>
                                                                </label>
                                                                <label className="flex items-center">
                                                                    <input
                                                                        type="radio"
                                                                        name={`relative-dose-status-${index}`}
                                                                        value="Unverified"
                                                                        checked={dose?.value?.status === "Unverified"}  // 🔹 FIXED HERE
                                                                        onChange={() => handleStatusSimpleConcentration("relativeDoses", "Unverified", index)}
                                                                    />
                                                                    <span className="ml-1">Unverified</span>
                                                                </label>
                                                            </div>
                                                        }
                                                    />
                                                ))}

                                                {formData?.absoluteDoses?.length > 0 && <ReuseableInput
                                                    label={"Weight of species"}
                                                    type="number"
                                                    name={"bodyWeight"}
                                                    value={formData.bodyWeight?.name || ''}
                                                    onChange={handleInputChange}
                                                    unit={formData.bodyWeight?.unit || 'g'}
                                                    onUnitChange={handleBodyWeightUnitChange}
                                                    options={weightUnitOptions}
                                                    InfoTooltip={
                                                        <InfoTooltip message="Please enter the weight and select the appropriate unit (g or kg)." />
                                                    }
                                                    isSpecialAction={isSpecialAction} // Pass isSpecialAction
                                                    isCheck={false}
                                                    customStatusComponent={
                                                        <div className="flex items-center space-x-4">
                                                            <label className="flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    name="bodyWeight-status"
                                                                    value="Verified"
                                                                    checked={formData?.bodyWeight?.status === "Verified"}
                                                                    onChange={() => handleStatusChange("bodyWeight", "Verified")}
                                                                    className="mr-1"
                                                                />
                                                                <span>Verified</span>
                                                            </label>
                                                            <label className="flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    name="bodyWeight-status"
                                                                    value="Unverified"
                                                                    checked={formData?.bodyWeight?.status === "Unverified"}
                                                                    onChange={() => handleStatusChange("bodyWeight", "Unverified")}
                                                                    className="mr-1"
                                                                />
                                                                <span>Unverified</span>
                                                            </label>
                                                        </div>
                                                    }
                                                />
                                                }

                                            </div>

                                        </div>
                                    )}


                                </div>
                            </>
                            }

                            {ShowIngestionRedux && <div className="border border-gray-300 rounded-lg shadow-sm mb-4">
                                <button
                                    type="button"
                                    onClick={openIngestionHandle}
                                    className="w-full text-left px-4 py-2 flex justify-between items-center bg-blue-100 rounded-t-lg hover:bg-blue-200 focus:outline-none"
                                    style={{ color: colorTheme.primary, fontWeight: 'bold' }}
                                >
                                    <span>{"Ingestion"}</span>
                                    <span>{isIngestionInformation ? '-' : '+'}</span>
                                </button>


                                {isIngestionInformation && <div className=' px-4 py-2'>
                                    <Input
                                        label="Peak breath hydrogen concentration?"
                                        name="Peakbreathhydrogen"
                                        value={formData.Peakbreathhydrogen?.name}
                                        onChange={handleInputChange}
                                        InfoTooltip={<InfoTooltip message="Enter the maximum hydrogen concentration in the breath measured during the study. Use units such as ppm (parts per million)." />}
                                        isSpecialAction={isSpecialAction} // Pass isSpecialAction
                                        status={formData?.Peakbreathhydrogen?.status} // Pass status
                                        onStatusChange={handleStatusChange} // Pass status change handler


                                    />
                                    <Input
                                        label="Frequency"
                                        name="Frequency"
                                        value={formData.Frequency?.name}
                                        onChange={handleInputChange}
                                        InfoTooltip={<InfoTooltip message="How many times per day did they take ingest it?" />}
                                        isSpecialAction={isSpecialAction} // Pass isSpecialAction
                                        status={formData?.Frequency?.status} // Pass status
                                        onStatusChange={handleStatusChange} // Pass status change handler

                                    />
                                    <Input
                                        type='number'
                                        label="Duration per frequency"
                                        name="IngestionDurationfrequency"
                                        value={formData.IngestionDurationfrequency?.name}
                                        onChange={handleInputChange}
                                        InfoTooltip={<InfoTooltip message="How long was breath hydrogen elevated?" />}
                                        isSpecialAction={isSpecialAction} // Pass isSpecialAction
                                        status={formData?.IngestionDurationfrequency?.status} // Pass status
                                        onStatusChange={handleStatusChange} // Pass status change handler

                                    />
                                </div>}
                            </div>}

                            {ShowCellCultureTissuesRedux && <div className="border border-gray-300 rounded-lg shadow-sm mb-4">
                                <button
                                    type="button"
                                    onClick={openCellCultureTissuesHandle}
                                    className="w-full text-left px-4 py-2 flex justify-between items-center bg-blue-100 rounded-t-lg hover:bg-blue-200 focus:outline-none"
                                    style={{ color: colorTheme.primary, fontWeight: 'bold' }}
                                >
                                    <span>{"Cell Culture / Tissues"}</span>
                                    <span>{isCellCultureTissuesInformation ? '-' : '+'}</span>
                                </button>


                                {isCellCultureTissuesInformation && <div className=' px-4 py-2'>

                                    <Input
                                        label="What is the concentration of hydrogen for the medium (μmoles/L)."
                                        name="concentrationOfHydrogenForMedium"
                                        value={(() => {
                                            const value = formData.concentrationOfHydrogenForMedium?.name;
                                            if (typeof value === 'object' && value !== null) {
                                                return String(value) === '[object Object]' ? '' : String(value);
                                            }
                                            return value || '';
                                        })()}
                                        onChange={handleInputChange}
                                        InfoTooltip={<InfoTooltip message="Enter the measured concentration of dissolved molecular hydrogen in the cell 
                                                                            culture medium, expressed in micromoles per liter (µmoles/L)." />}
                                        isSpecialAction={isSpecialAction} // Pass isSpecialAction
                                        status={formData?.concentrationOfHydrogenForMedium?.status} // Pass status
                                        onStatusChange={handleStatusChange} // Pass status change handler


                                    />

                                    <InputWithUnit
                                        type="number"
                                        label="Volume of Medium Used (mL) "
                                        name="FrequencyCellCultureTissues"
                                        value={(() => {
                                            const value = formData.FrequencyCellCultureTissues?.name;
                                            if (typeof value === 'object' && value !== null) {
                                                return String(value) === '[object Object]' ? '' : String(value);
                                            }
                                            return value || '';
                                        })()}
                                        onChange={handleInputChange}
                                        InfoTooltip={<InfoTooltip message="Enter the total volume of culture medium used in the experiment, measured in milliliters (mL)." />}
                                        error={validationErrors.FrequencyCellCultureTissues}
                                        unit={formData.unitFrequency?.name}
                                        options={["mL"]}
                                        onUnitChange={(newUnit) => setFormData({ ...formData, unitFrequency: newUnit })}
                                        isSpecialAction={isSpecialAction} // Pass isSpecialAction
                                        status={formData?.FrequencyCellCultureTissues?.status} // Pass status
                                        onStatusChange={handleStatusChange} // Pass status change handler
                                    />

                                    <InputWithUnit
                                        type="number"
                                        label=" Total Exposure Duration (hours/min)"
                                        name="DurationFrequencyCellCultureTissues"
                                        value={(() => {
                                            const value = formData.DurationFrequencyCellCultureTissues?.name;
                                            if (typeof value === 'object' && value !== null) {
                                                return String(value) === '[object Object]' ? '' : String(value);
                                            }
                                            return value || '';
                                        })()}
                                        onChange={handleInputChange}
                                        InfoTooltip={<InfoTooltip message="Indicate how long the cells were exposed to the hydrogen-enriched medium, measured in hours or minutes." />}
                                        error={validationErrors.DurationFrequencyCellCultureTissues}
                                        unit={formData.unitDuration?.name}
                                        onUnitChange={(newUnit) => setFormData({ ...formData, unitDuration: newUnit })}
                                        isSpecialAction={isSpecialAction} // Pass isSpecialAction
                                        status={formData?.DurationFrequencyCellCultureTissues?.status} // Pass status
                                        onStatusChange={handleStatusChange} // Pass status change handler
                                    />

                                </div>}
                            </div>}

                            {ShowTopicalApplicationsRedux && <CustomCreatableSelect
                                isCreate={false}
                                label="Method of topical application?"
                                name="topical_how"
                                options={["Bathing", "Soaking", "Cream", " Direct Application"]}
                                value={formData.topical_how}
                                onChange={handleInputChange}
                                InfoTooltip={<InfoTooltip message="Bathing is the entire body submerged, Soaking is a limb, Direct application of gas on the skin (not soaking or submerging, but the gas directly constantly applied to the skin)" />}
                                isSpecialAction={isSpecialAction} // Pass isSpecialAction
                                status={formData?.topical_how?.status} // Pass status
                                onStatusChange={handleStatusChange} // Pass status change handler
                            />
                            }

                        </>
                    }

                </Accordion>
           
            <div className="text-sm text-gray-500 mt-1  mb-2 font-extrabold">
              Note: Not required for review / non-experimental articles
            </div>
   

                <Accordion
                    title={isSpecialAction?"Were comparisons made (Y/N)" : "What Comparisons were Made"}
                    isOpen={isERWandComp}
                    onToggle={() => setIsERWandComp((prev) => !prev)}

                >

                    {/* Comparison of Methods of Administration */}

                    <CustomCreatableSelect
                        isCreate={false}
                        label="Comparison of Methods of Administration?"
                        name="CompMethodAdmin"
                        options={['True', 'False']}
                        customLabelMap={trueFalseLabelMap}
                        value={formData.CompMethodAdmin}
                        onChange={handleInputChange}
                        InfoTooltip={<InfoTooltip message={`Does the article use or compare different methods of administration? For example, if an article looks at or compares the effects of hydrogen inhalation vs ingestion of hydrogen water, then this would be true`} />}
                        isSpecialAction={isSpecialAction} // Pass isSpecialAction
                        status={formData?.CompMethodAdmin?.status}
                        onStatusChange={handleStatusChange} // Pass status change handler
                    />

                    {setCompMethodAdminState && <Input
                        label="Describe"
                        name="CompMethodAdminDesc"
                        value={formData.CompMethodAdminDesc?.name}
                        onChange={handleInputChange}
                        InfoTooltip={<InfoTooltip message={`Provide details on the methods of administration being compared in the study. Specify what is being tested, such as hydrogen inhalation vs. hydrogen water ingestion,`} />}
                        isSpecialAction={isSpecialAction} // Pass isSpecialAction
                        status={formData?.CompMethodAdminDesc?.status}
                        onStatusChange={handleStatusChange} // Pass status change handler

                    />
                    }

                    {/* Dose/Concentration Comparison */}
                    <CustomCreatableSelect
                        isCreate={false}
                        label="Dose/Concentration Comparison"
                        name="doseComparison"
                        options={['True', 'False']}
                        customLabelMap={trueFalseLabelMap}
                        value={formData.doseComparison}
                        onChange={handleInputChange}
                        InfoTooltip={<InfoTooltip message={`Did the study compare different doses or concentrations of hydrogen? `} />}
                        isSpecialAction={isSpecialAction} // Pass isSpecialAction
                        status={formData?.doseComparison?.status}
                        onStatusChange={handleStatusChange} // Pass status change handler
                    />

                    {DoseConcentrationComparison && <Input
                        label="Describe"
                        name="doseComparisonDesc"
                        value={formData.doseComparisonDesc?.name}
                        onChange={handleInputChange}
                        InfoTooltip={<InfoTooltip message="Provide a description of the comparison. Include details such as the specific doses or concentrations compared, the administration methods (e.g., hydrogen water, inhalation), and the outcomes of the comparisons." />}
                        isSpecialAction={isSpecialAction} // Pass isSpecialAction
                        status={formData?.doseComparisonDesc?.status}
                        onStatusChange={handleStatusChange} // Pass status change handler
                    />
                    }

                    {/* Drug Comparison */}
                    <CustomCreatableSelect
                        isCreate={false}
                        label="Drug/Therapy/Supplement Comparison"
                        name="drugComparison"
                        options={['True', 'False']}
                        customLabelMap={trueFalseLabelMap}
                        value={formData.drugComparison}
                        onChange={handleInputChange}
                        InfoTooltip={
                            <InfoTooltip
                                message={
                                    <span>
                                        Indicate whether the study compared <strong>molecular hydrogen</strong> with other substances. Other drugs (e.g., metformin, beta-blockers), therapies (e.g., red light therapy, physiotherapy) or supplements (e.g., Vitamin C, magnesium, red clover)
                                    </span>
                                }
                            />
                        }
                        isSpecialAction={isSpecialAction} // Pass isSpecialAction
                        status={formData?.drugComparison?.status}
                        onStatusChange={handleStatusChange} // Pass status change handler

                    />

                    {/* Conditionally render the input field for comparison details if True is selected */}
                    {showComparisonDetail && (
                        <Input
                            label="Describe"
                            name="comparisonDetail"
                            value={formData.comparisonDetail?.name}
                            onChange={handleInputChange}
                            InfoTooltip={<InfoTooltip message="Please provide a brief description of the comparison. Specify what was compared (e.g., different doses of hydrogen, comparisons with Vitamin C, other drugs, or therapies) and any relevant details from the study." />}
                            isSpecialAction={isSpecialAction} // Pass isSpecialAction
                            status={formData?.comparisonDetail?.status}
                            onStatusChange={handleStatusChange} // Pass status change handler
                        />
                    )}


                    {/* Pharmacokinetics */}
                    <CustomCreatableSelect
                        isCreate={false}
                        label="Pharmacokinetics (H₂ Concentration) | (absorption, distribution, metabolism and excretion) "
                        name="pharmacokinetics"
                        options={['True', 'False']}
                        customLabelMap={trueFalseLabelMap}
                        value={formData.pharmacokinetics}
                        onChange={handleInputChange}
                        InfoTooltip={<InfoTooltip message="Indicate whether the article reports specific measurements of hydrogen (H₂) concentration in the body, organs, tissues, breath, or other biological samples for human or animal studies. " />}
                        isSpecialAction={isSpecialAction} // Pass isSpecialAction
                        status={formData?.pharmacokinetics?.status}
                        onStatusChange={handleStatusChange} // Pass status change handler
                    />

                    {showPharmacokineticsDescription && (
                        <Input
                            label="Describe"
                            name="pharmacokineticsDescription"
                            value={formData.pharmacokineticsDescription?.name}
                            onChange={handleInputChange}
                            InfoTooltip={<InfoTooltip message="Provide a brief description of the hydrogen (H₂) concentration measurements. Specify where the measurements were taken (e.g., in the body, organs, tissues, breath) and any relevant details such as the method used or specific concentrations observed." />}
                            isSpecialAction={isSpecialAction} // Pass isSpecialAction
                            status={formData?.pharmacokineticsDescription?.status}
                            onStatusChange={handleStatusChange} // Pass status change handler
                        />
                    )}

                    {/* ERW Section */}
                    <CustomCreatableSelect
                        isCreate={false}
                        label="ERW?"
                        name="isERW"
                        options={['True', 'False']}
                        customLabelMap={trueFalseLabelMap}
                        value={formData.isERW}
                        onChange={handleInputChange}
                        InfoTooltip={<InfoTooltip message="Indicate whether the article is about Electrolyzed-Reduced Water (ERW), also known as ionized water or alkaline ionized water. " />}
                        isSpecialAction={isSpecialAction} // Pass isSpecialAction
                        status={formData?.isERW?.status}
                        onStatusChange={handleStatusChange} // Pass status change handler
                    />

                    {/* Conditionally render pH input if ERW is True */}
                    {showPH && (
                        <>

                            <Input
                                label="What was the pH"
                                name="ph"
                                type="number"
                                step="0.01" // Allows decimals
                                min={0}     // Minimum pH
                                max={14}    // Maximum pH
                                value={formData.ph?.name}
                                onChange={handleInputChange}
                                InfoTooltip={<InfoTooltip message={`Specify the pH of the water as reported in the article. If the pH is not mentioned, leave this field blank."`} />}
                                error={validationErrors.ph}
                                isSpecialAction={isSpecialAction} // Pass isSpecialAction
                                status={formData?.ph?.status}
                                onStatusChange={handleStatusChange} // Pass status change handler
                            />

                            <CustomCreatableSelect
                                isCreate={false}
                                label="Was ERW compared to hydrogen water?"
                                name="erwCompared"
                                options={['True', 'False']}
                                value={formData.erwCompared}
                                onChange={handleInputChange}
                                InfoTooltip={<InfoTooltip message="Indicate whether the study compared the effects of Electrolyzed Reduced Water (ERW) to hydrogen-rich water." />}
                                isSpecialAction={isSpecialAction} // Pass isSpecialAction
                                status={formData?.erwCompared?.status}
                                onStatusChange={handleStatusChange} // Pass status change handler

                            />

                        </>
                    )}

                </Accordion>

                <Accordion
                    title="Miscellaneous"
                    isOpen={isGeneExpression}
                    onToggle={() => setIsGeneExpression((prev) => !prev)}

                >

                    <div className="border border-gray-300 rounded-lg shadow-sm mb-4">
                        <button
                            type="button"
                            onClick={() => setIsAdverseEffects((prev) => !prev)}
                            className="w-full text-left px-4 py-2 flex justify-between items-center bg-blue-100 rounded-t-lg hover:bg-blue-200 focus:outline-none"
                            style={{ color: colorTheme.primary, fontWeight: 'bold' }}
                        >
                            <span>{"Safety & Adverse Effects"}</span>
                            <span>{isAdverseEffects ? '-' : '+'}</span>
                        </button>

                        {
                            isAdverseEffects && <div className=' px-4 py-2'>

                                {/* Adverse Effects */}
                                <CustomCreatableSelect
                                    isCreate={true}
                                    label="Are there any adverse effects?"
                                    name="adverseEffects"
                                    options={['True', 'False']}
                                    customLabelMap={{
                                        "True": "Yes",
                                        "False": "No",
                                        "N/A": "Not Applicable"
                                    }}
                                    value={formData.adverseEffects}
                                    onChange={handleInputChange}
                                    InfoTooltip={
                                        <InfoTooltip message="Does the study document any negative side effects or potential risks?" />
                                    }
                                    isSpecialAction={isSpecialAction} // Pass isSpecialAction
                                    status={formData?.adverseEffects?.status}
                                    onStatusChange={handleStatusChange} // Pass status change handler
                                />

                                {formData.adverseEffects?.name === 'True' && (
                                    <Input
                                        label={"Describe"}
                                        type="text"
                                        name={"adverseEffectsDescription"}
                                        value={formData.adverseEffectsDescription?.name || ''}
                                        onChange={handleInputChange}
                                        InfoTooltip={
                                            <InfoTooltip message="Provide details on the adverse effects observed during the study." />
                                        }
                                        isSpecialAction={isSpecialAction} // Pass isSpecialAction
                                        status={formData?.adverseEffectsDescription?.status}
                                        onStatusChange={handleStatusChange} // Pass status change handler
                                    />
                                )}

                                {/* Dose-Dependent Effect */}
                                <CustomCreatableSelect
                                    isCreate={false}
                                    label="Does the study suggest a dose-dependent or concentration-dependent effect?"
                                    name="doseDependentEffect"
                                    options={['True', 'False']}
                                    customLabelMap={{
                                        "True": "Yes",
                                        "False": "No",
                                        "N/A": "Not Applicable"
                                    }}
                                    value={formData.doseDependentEffect}
                                    onChange={handleInputChange}
                                    InfoTooltip={
                                        <InfoTooltip message="Are the therapeutic effects dependent on the dose of molecular hydrogen administered?" />
                                    }
                                    isSpecialAction={isSpecialAction} // Pass isSpecialAction
                                    status={formData?.doseDependentEffect?.status}
                                    onStatusChange={handleStatusChange} // Pass status change handler
                                />

                                {/* Safety Profile */}
                                <CustomCreatableSelect
                                    isCreate={false}
                                    // label="Was this study specifically on the safety of H2 or uniquely show its safety profile?"
                                    label="Did this study focus on the safety of hydrogen in humans, or provide new evidence about its biological safety profile?"
                                    name="safetyProfile"
                                    options={['True', 'False']}
                                    customLabelMap={{
                                        "True": "Yes",
                                        "False": "No",
                                        "N/A": "Not Applicable"
                                    }}
                                    value={formData.safetyProfile}
                                    onChange={handleInputChange}
                                    InfoTooltip={
                                        <InfoTooltip  message="this is asking whether the study looked at how safe hydrogen is for people, or if it added any new information about its safety in the body, or disease profiles." />
                                    }
                                    
                                    isSpecialAction={isSpecialAction} // Pass isSpecialAction
                                    status={formData?.safetyProfile?.status}
                                    onStatusChange={handleStatusChange} // Pass status change handler
                                />

                               <CustomCreatableSelect
    isCreate={false}
    label="Does the study use any novel or unusual methods regarding the application of hydrogen?"
    name="safetyofhydrogen"
    options={['True', 'False']}
    customLabelMap={{
        "True": "Yes",
        "False": "No",
        "N/A": "Not Applicable"
    }}
    value={formData.safetyofhydrogen}
    onChange={handleInputChange}
    InfoTooltip={
        <InfoTooltip message="Did the study use any new or different ways of giving or applying hydrogen that you might not normally see?" />
    }
    isSpecialAction={isSpecialAction}
    status={formData?.safetyofhydrogen?.status}
    onStatusChange={handleStatusChange}
/>

                            </div>
                        }
                    </div>

                    <div className="border border-gray-300 rounded-lg shadow-sm mb-4">
                        <button
                            type="button"
                            onClick={() => setIsBiologicalMechanistic((prev) => !prev)}
                            className="w-full text-left px-4 py-2 flex justify-between items-center bg-blue-100 rounded-t-lg hover:bg-blue-200 focus:outline-none"
                            style={{ color: colorTheme.primary, fontWeight: 'bold' }}
                        >
                            <span>{"Biological & Mechanistic Insights"}</span>
                            <span>{isBiologicalMechanistic ? '-' : '+'}</span>
                        </button>

                        {
                            isBiologicalMechanistic && <div className=' px-4 py-2'>

                                {/* Sex Difference */}
                                <CustomCreatableSelect
                                    isCreate={false}
                                    label="Was there a sex difference?"
                                    name="sexDifference"
                                    options={['True', 'False']}
                                    customLabelMap={{
                                        "True": "Yes",
                                        "False": "No",
                                        "N/A": "Not Applicable"
                                    }}
                                    value={formData.sexDifference}
                                    onChange={handleInputChange}
                                    InfoTooltip={
                                        <InfoTooltip message="Did the study identify differences between sexes (e.g., males versus females)? For instance, did one sex show greater therapeutic effects or side effects?" />
                                    }
                                    isSpecialAction={isSpecialAction} // Pass isSpecialAction
                                    status={formData?.sexDifference?.status}
                                    onStatusChange={handleStatusChange} // Pass status change handler
                                />

                                {/* Responder vs Non-responder */}
                                <CustomCreatableSelect
                                    isCreate={false}
                                    label="Does the study indicate a responder versus a non-responder?"
                                    name="responderDifference"
                                    options={['True', 'False']}
                                    customLabelMap={{
                                        "True": "Yes",
                                        "False": "No",
                                        "N/A": "Not Applicable"
                                    }}
                                    value={formData.responderDifference}
                                    onChange={handleInputChange}
                                    InfoTooltip={
                                        <InfoTooltip message="Did the study identify distinct responder and non-responder groups? For example, were certain populations or individuals more likely to benefit from the therapy than others?" />
                                    }
                                    isSpecialAction={isSpecialAction} // Pass isSpecialAction
                                    status={formData?.responderDifference?.status}
                                    onStatusChange={handleStatusChange} // Pass status change handler
                                />

                                {/* Pregnant/Breastfeeding */}
                                <CustomCreatableSelect
                                    isCreate={false}
                                    label="Were the species pregnant/breastfeeding?"
                                    name="pregnantBreastfeeding"
                                    options={['True', 'False']}
                                    customLabelMap={{
                                        "True": "Yes",
                                        "False": "No",
                                        "N/A": "Not Applicable"
                                    }}
                                    value={formData.pregnantBreastfeeding}
                                    onChange={handleInputChange}
                                    InfoTooltip={
                                        <InfoTooltip message="if the species used were pregnant, mark this as yes even if the study wasn’t specifically on pregnancy or breastfeeding." />
                                    }
                                    isSpecialAction={isSpecialAction} // Pass isSpecialAction
                                    status={formData?.pregnantBreastfeeding?.status}
                                    onStatusChange={handleStatusChange} // Pass status change handler
                                />

                                {/* Mechanistic Insights */}
                                <CustomCreatableSelect
                                    isCreate={false}
                                    label="Does the study provide mechanistic insights?"
                                    name="mechanisticInsights"
                                    options={['True', 'False']}
                                    customLabelMap={{
                                        "True": "Yes",
                                        "False": "No",
                                        "N/A": "Not Applicable"
                                    }}
                                    value={formData.mechanisticInsights}
                                    onChange={handleInputChange}
                                    InfoTooltip={
                                        <InfoTooltip message="Did the study explore or explain the underlying biological mechanisms of molecular hydrogen therapy?" />
                                    }
                                    isSpecialAction={isSpecialAction} // Pass isSpecialAction
                                    status={formData?.mechanisticInsights?.status}
                                    onStatusChange={handleStatusChange} // Pass status change handler
                                />
                                {formData.mechanisticInsights === 'True' && (
                                    <Input
                                        label="Describe"
                                        name="mechanisticInsightsDesc"
                                        value={formData.mechanisticInsightsDesc?.name || ''}
                                        onChange={handleInputChange}
                                        InfoTooltip={<InfoTooltip message="Provide a brief description of the mechanistic insights explored or explained in the study." />}
                                        isSpecialAction={isSpecialAction}
                                        status={formData?.mechanisticInsightsDesc?.status}
                                        onStatusChange={handleStatusChange}
                                    />
                                )}

                           
            <div className="container text-sm pr-4 text-gray-500 mt-1  mb-2 font-extrabold">
              Note: Not required for review / non-experimental articles
            </div>
        
                    <CustomCreatableSelect
                        isCreate={false}
                        label="Did the study measure changes in gene expression?"
                        name="geneExpression"
                        options={['True', 'False']}
                        customLabelMap={{
                            "True": "Yes",
                            "False": "No",
                            "N/A": "Not Applicable"
                        }}
                        value={formData.geneExpression}
                        onChange={handleInputChange}
                        InfoTooltip={<InfoTooltip message="Indicate whether the study measured changes in gene expression using techniques like microRNA analysis, transcriptomic analysis, differential gene expression analysis, or other common methods." />}
                        isSpecialAction={isSpecialAction} // Pass isSpecialAction
                        status={formData?.geneExpression?.status}
                        onStatusChange={handleStatusChange} // Pass status change handler
                    />

                    {geneExpressionDesciption && <Input
                        label="Describe"
                        name="geneExpressionDesc"
                        value={formData.geneExpressionDesc?.name}
                        onChange={handleInputChange}
                        InfoTooltip={<InfoTooltip message="Provide a brief description of the specific methods used (e.g., microRNA analysis, transcriptomic analysis) and list all gene markers or changes reported in the study. Include any relevant details from the article." />}
                        isSpecialAction={isSpecialAction} // Pass isSpecialAction
                        status={formData?.geneExpressionDesc?.status}
                        onStatusChange={handleStatusChange} // Pass status change handler
                    />
                    }

                            </div>}
                    </div>





                    <div className="border border-gray-300 rounded-lg shadow-sm mb-4">
                        <button
                            type="button"
                            onClick={() => setIsExternalReferences((prev) => !prev)}
                            className="w-full text-left px-4 py-2 flex justify-between items-center bg-blue-100 rounded-t-lg hover:bg-blue-200 focus:outline-none"
                            style={{ color: colorTheme.primary, fontWeight: 'bold' }}
                        >
                            <span>{"External References & Commercial Influence"}</span>
                            <span>{isExternalReferences ? '-' : '+'}</span>
                        </button>

                        {isExternalReferences && <div className=' px-4 py-2'>
                            <CustomCreatableSelect
                                isCreate={false}
                                label="Is there a Video / News Article / Blog Article for this paper?"
                                name="Video_WebpageLink"
                                options={['True', 'False']}
                                customLabelMap={{
                                    "True": "Yes",
                                    "False": "No",
                                    "N/A": "Not Applicable"
                                }}
                                value={formData.Video_WebpageLink || ''}
                                onChange={handleInputChange}
                                InfoTooltip={
                                    <InfoTooltip message="Is there a link to a video or webpage that you want to include?" />
                                }
                                isSpecialAction={isSpecialAction} // Pass isSpecialAction
                                status={formData?.Video_WebpageLink?.status}
                                onStatusChange={handleStatusChange} // Pass status change handler

                            />

                            {formData.Video_WebpageLink?.name === 'True' && <Input
                                type='url'
                                label="Paste Url"
                                name="PasteUrl"
                                value={formData.PasteUrl?.name || ''}
                                onChange={handleInputChange}
                                error={validationErrors.PasteUrl}
                                InfoTooltip={
                                    <InfoTooltip message="If this research paper has been discussed in a video, news article, or blog post, paste the direct URL here. Ensure the link is from a credible source and relevant to the study." />
                                }
                                isSpecialAction={isSpecialAction} // Pass isSpecialAction
                                status={formData?.PasteUrl?.status}
                                onStatusChange={handleStatusChange} // Pass status change handler

                            />

                            }

                            {/* commercial product */}
                            <CustomCreatableSelect
                                isCreate={false}
                                label="Was a commercial product used?"
                                name="commercialProduct"
                                options={['Yes', 'No']}
                                value={formData.commercialProduct}
                                onChange={handleInputChange}
                                InfoTooltip={
                                    <InfoTooltip message="Indicate whether a commercially available hydrogen-related product (e.g., hydrogen water, inhalation device, or supplement) was used in the study." />
                                }
                                isSpecialAction={isSpecialAction} // Pass isSpecialAction
                                status={formData?.commercialProduct?.status}
                                onStatusChange={handleStatusChange} // Pass status change handler
                            />

                            {formData.commercialProduct?.name === 'Yes' && (
                                <Input
                                    label={"What was the brand name?"}
                                    type="text"
                                    name={"brandName"}
                                    value={formData.brandName?.name || ''}
                                    onChange={handleInputChange}
                                    InfoTooltip={
                                        <InfoTooltip message="If a commercial hydrogen product was used in this study, enter the brand name here. Provide the exact name as listed in the study to ensure accuracy. " />
                                    }
                                    isSpecialAction={isSpecialAction} // Pass isSpecialAction
                                    status={formData?.brandName?.status}
                                    onStatusChange={handleStatusChange} // Pass status change handler
                                />
                            )}
                        </div>}
                    </div>

 


                </Accordion>

                {/* Confirmation Modal */}
                {/* {isConfirmationModalVisible && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70">
                        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 mx-4 md:mx-0">
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">Incomplete Information</h2>
                            <p className="text-gray-600 mb-6">
                                Some fields are missing. Are you sure you want to proceed without filling them?
                            </p>

                            {missingFields.length > 0 && (
                                <ul className="text-gray-600 mb-4">
                                    {missingFields.map((field, index) => (
                                        <li key={index} className="list-disc list-inside">
                                            {fieldNameMappings[field] || field.replace(/([A-Z])/g, ' $1')}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={confirmSubmit}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150"
                                >
                                    Yes, Proceed
                                </button>
                                <button
                                    onClick={() => setIsConfirmationModalVisible(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-150"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )} */}


                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleDraftSave}
                        style={{ backgroundColor: colorTheme.primary }}
                        className="text-white py-2 px-4 rounded hover:bg-blue-700 mr-2"
                    >
                        {add_article_status === asyncStatus.LOADING ? "Loading..." : "Save as Draft"}
                    </button>
                    <button
                        type="button"
                        onClick={() => onBack(formData)}
                        style={{ backgroundColor: colorTheme.primary }}
                        className="text-white py-2 px-4 rounded hover:bg-blue-700 mr-2"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        style={{ backgroundColor: colorTheme.primary }}
                        className="text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Next
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ResearcherForm;

