import React, { useState, useEffect } from "react";
import { Input } from "../../Input/Input";
import { CustomCreatableSelect } from "../../CustomSelect/CustomSelect";
import { useDispatch, useSelector } from "react-redux";
import { colorTheme } from "../../../Utils/colortheme";
import { FaInfoCircle } from "react-icons/fa";
import {
  add_research_topic_service_auth,
  add_specie_service_auth,
  add_study_type_service_auth,
  get_research_topic_service_auth,
  get_specie_service_auth,
  get_study_type_service_auth,
  get_systems_service_auth,
  get_organs_service_auth,
  add_systems_service_auth,
  add_organs_service_auth,
} from "../../../Services/SpecieService";
import {
  add_disease_service_auth,
  get_disease_service_auth,
} from "../../../Services/DiseaseService";
import { Accordion } from "../../Accordian/Accordian";
import {
  setBothStatus,
  setDefaultStatus,
  setNonExperimentalStatus,
} from "../../../Store/slices/Study_type_slice";
import { TimeDurationInput } from "../../DurationInput/TimeDurationInput";
import { ReuseableInput } from "../../DurationInput/ReuseableInput";
import { asyncStatus } from "../../../Utils/asyncStatus";

const ArticleGeneralData = ({
  onSubmit,
  initialData,
  onDraftSubmit,
  onBack,
  setShowDefault,
  isSpecialAction,
  onWeightChange,
}) => {
  const dispatch = useDispatch();

  const { get_study_type_data, showNonExperimental, BothTrueState } =
    useSelector((state) => state.StudyType);
  const { get_specie_data } = useSelector((state) => state.species);
  const { get_research_type_data } = useSelector((state) => state.ResearchType);
  const { get_systems_data } = useSelector((state) => state.systems);
  const { get_organs_data } = useSelector((state) => state.organs);
  const { get_disease_data } = useSelector((state) => state.diseases);
  const { add_article_status } = useSelector((state) => state.article);

  const [showHumanStudyInput, setShowHumanStudyInput] = useState(false);
  const [showReviewStudyInput, setShowReviewStudyInput] = useState(false);
  const [showInVivoInput, setShowInVivoInput] = useState(false);
  const [showExVivoInput, setShowExVivoInput] = useState(false);
  const [showInVitroInput, setShowInVitroInput] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [showInExVivoInput, setShowInExVivoInput] = useState(false);
  const [showCellCultureStudyInput, setShowCellCultureStudyInput] =
    useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [sliderValue, setSliderValue] = useState("50");
  const [speciesGetting, setSpeciesGetting] = useState([]);
  const [loadingg, setLoadingg] = useState(true);
  const [isStudyEvaluation, setIsStudyEvaluation] = useState();
  const [isStudyType, setIsStudyType] = useState();
  const [isVivoState, setIsVivoState] = useState();
  const [isVitroState, setIsVitroState] = useState();
  const [isExVivoState, setIsExVivoState] = useState();
  const [isOtherState, setIsOtherState] = useState();
  const [isNonExparimentalState, setIsNonExparimentalState] = useState();
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [skipSections, setSkipSections] = useState(false);

  const [formData, setFormData] = useState(
    initialData || {
      outcome: { name: "", status: "Unverified" },
      outcomeType: [],
      HighlightArticle: "",
      descHighArt: { name: "", status: "Unverified" },
      rankThisArticle: { name: "", status: "Unverified" },
      studyType: [],
      timingTreatmentInVivo: [],
      ReviewStudyType: { name: "", status: "Unverified" },
      Describestudytype: { name: "", status: "Unverified" },
      researchtopic: [],
      diseaseModel: [],
      system: [],
      organ: [],
      species: [],
      speciesDetails: {},
      inVivo: [],
      durationOfStudy: { name: "", status: "Unverified" },
      durationOfStudyInVivo: { name: "", status: "Unverified" },
      UnitOfStudyInVivo: { name: "", status: "Unverified" },

      durationOfStudyCellCulture: { name: "", status: "Unverified" },
      OpinionPiece: { name: "", status: "Unverified" },
      Hypothesis: { name: "", status: "Unverified" },
      TherapeuticDeliverySystems: { name: "", status: "Unverified" },

      exVivo: "",
      timingTreatmentExVivo: [],
      WhatCellTissueUsed: { name: "", status: "Unverified" },
      durationOfStudyExVivo: { name: "", status: "Unverified" },
      UnitOfStudyExVivo: { name: "", status: "Unverified" },

      inVitro: "",
      timingTreatmentInVitro: [],
      WhatKindCell: { name: "", status: "Unverified" },
      durationOfStudyinVitro: { name: "", status: "Unverified" },
      UnitOfStudyInVitro: { name: "", status: "Unverified" },

      NonExperimentalSelect: [],
      durationOfNonExperimental: { name: "", status: "Unverified" },
      UnitOfStudyNonExper: { name: "", status: "Unverified" },

      Other: { name: "", status: "Unverified" },
      durationOfOther: { name: "", status: "Unverified" },
      UnitOfOther: { name: "", status: "Unverified" },

      clinicalTrialDesign: [],
      observationalStudy: [],
      selectedStudyTypes: [],
    }
  );

  // Get All Feilds Data
  useEffect(() => {
    dispatch(get_specie_service_auth());
    dispatch(get_study_type_service_auth());
    dispatch(get_research_topic_service_auth());
    dispatch(get_organs_service_auth());
    dispatch(get_systems_service_auth());
    dispatch(get_disease_service_auth());
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {

    console.log(formData, "formData");

    console.log("initialData", initialData);
    // If initialData exists, populate the form with the initial data
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData); // Populate the form data with initial values

      // Extract studyType values from initialData
      const studyTypes = initialData?.studyType || [];
      // Update states dynamically based on the studyType array
      setShowInVivoInput(studyTypes?.find((item) => item.name === "In Vivo" || item.name === "in Vivo"));
      setShowExVivoInput(studyTypes?.find((item) => item.name === "Ex Vivo" || item.name === "ex Vivo"));
      setShowInVitroInput(studyTypes?.find((item) => item.name === "In Vitro" || item.name === "in Vitro"));
      setShowOtherInput(studyTypes?.find((item) => item.name === "Other" || item.name === "other"));
    setNonExperimentalStatus(studyTypes?.find((item) => item.name === "Non-experimental (Review)" || item.name === "non-experimental (Review)"));
    }
  }, [initialData]);

  console.log("formData", formData);

  const handleChange = (value, name) => {
    if (name === "species") {
      // Initialize speciesDetails for each selected species
      const updatedSpeciesDetails = { ...formData.speciesDetails };

      // value.forEach((species) => {
      //     if (!updatedSpeciesDetails[species]) {
      //         updatedSpeciesDetails[species] = {}; // Ensure initialization
      //     }
      // });
      value.forEach((species) => {
        if (!updatedSpeciesDetails[species]) {
          updatedSpeciesDetails[species] = { name: "", status: "Unverified" };
        }
      });

      // Remove any species from speciesDetails that are no longer selected
      Object.keys(updatedSpeciesDetails).forEach((key) => {
        if (!value.includes(key)) {
          delete updatedSpeciesDetails[key];
        }
      });
      setShowDefault(false);

      if (Object.values(updatedSpeciesDetails).length) {
        dispatch(setDefaultStatus(true));
      } else {
        dispatch(setDefaultStatus(false));
      }

      setFormData((prev) => ({
        ...prev,
        species: value,
        speciesDetails: updatedSpeciesDetails,
      }));
    } else if (name === "studyType") {
      const isNonExperimentalSelected = value.includes("Non-experimental");
      const isOtherSelected = value.length > 1; // Check if more than one option is selected

      // Update Redux state for `showNonExperimental`
      dispatch(setNonExperimentalStatus(isNonExperimentalSelected));

      // Update `BothTrueState` to determine button behavior
      // dispatch(setBothStatus(isNonExperimentalSelected && !isOtherSelected));

      // Show specific content when "Non-experimental" is selected alone
      if (isNonExperimentalSelected && !isOtherSelected) {
        setSkipSections(true);
      } else {
        setSkipSections(false);
      }

      // Handle additional state logic for other options
      // setShowHumanStudyInput(value.includes("Human Studies"));

      console.log("Selected study types:", value);  
      setShowReviewStudyInput(value.includes("Review") || value.includes("review"));
      setShowInVivoInput(value.includes("In Vivo") || value.includes("in Vivo"));
      setShowExVivoInput(value.includes("Ex Vivo") || value.includes("ex Vivo"));
      setShowInVitroInput(value.includes("In Vitro") || value.includes("in Vitro"));
      setShowOtherInput(value.includes("Other") || value.includes("other"));
    }
    // setFormData((prev) => ({
    //     ...prev,
    //     [name]: { name: value, status: 'Unverified' }
    // }));
    setFormData((prevState) => ({
      ...prevState,
      [name]: Array.isArray(value)
        ? value.map((item) =>
            typeof item === "string"
              ? { name: item, status: "Unverified" }
              : item
          ) // Ensure array values are objects
        : { name: value, status: "Unverified" }, // Ensure single values are objects
    }));

    setValidationErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const requiredFields = ["species"];
    let errors = {};

    requiredFields.forEach((field) => {
      if (
        !formData[field] ||
        (Array.isArray(formData[field]) && formData[field].length === 0)
      ) {
        errors[field] = `${field} is required`;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (formSubmitted) {
      validateForm();
    }
  }, [formData.species, formSubmitted]);

  const hasError = (fields) => fields.some((field) => validationErrors[field]);

  const isResearchBioInvalid = hasError(["species"]);
  const [isResearchBio, setIsResearchBio] = useState(isResearchBioInvalid);
  const [isDraft, setIsDraft] = useState(false); // State to check if "Save as Draft" is clicked

  const handleDraftSave = () => {
    setIsDraft(true); // Mark action as draft
    onDraftSubmit(formData);
    // console.log("Draft Submitted", formData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // If "Save as Draft" is clicked
    if (isDraft) {
      setIsDraft(false);
      return;
    }

    // Check if "Humans" or "Animal" is selected in species
    const selectedSpecies = formData.species || [];
    const isHumanSelected = selectedSpecies.includes("Humans");
    const isAnimalSelected = selectedSpecies.includes("Animal");

    const optionalFields = ["species"];

    const missing = optionalFields.filter((field) => !formData[field]);

    if (missing.length > 0) {
      setMissingFields(missing);
      setIsConfirmationModalVisible(true);
    } else {
      onSubmit(formData, skipSections, {
        specie: formData?.species,
        speciesDetails: formData?.speciesDetails,
      });
    }
  };
  const confirmSubmit = () => {
    onSubmit(formData, skipSections);
    setIsConfirmationModalVisible(false);
    dispatch(setDefaultStatus(false));
  };

  useEffect(() => {
    const fetchSpeciesData = async () => {
      try {
        const fetchedData = (await get_specie_data?.species) || [];
        const speciesNames = fetchedData.map((specie) => specie.name);
        setSpeciesGetting(speciesNames);
      } catch (error) {
        console.error("Error fetching species data: ", error);
      } finally {
        setLoadingg(false);
      }
    };

    fetchSpeciesData();
  }, [get_specie_data]);

  const handleAddSpecies = (newSpecies) => {
    const obj = {
      name: newSpecies,
    };
    dispatch(add_specie_service_auth(obj))
      .then(() => {
        setSpeciesGetting([...speciesGetting, newSpecies]);
      })
      .catch((error) => {
        console.error("Error adding species:", error);
      });
  };

  const handleAddResearchTopic = (newResearchTopic) => {
    const obj = { name: newResearchTopic };
    dispatch(add_research_topic_service_auth(obj))
      .then(() => {
        // Safeguard: Ensure `formData.researchtopic` is an array
        const existingResearchTopics = Array.isArray(formData.researchtopic)
          ? formData.researchtopic
          : [];

        const updatedResearchTopicList = [
          ...get_research_type_data.researchTopics,
          { name: newResearchTopic },
        ];

        handleChange(
          [...existingResearchTopics, newResearchTopic],
          "researchtopic"
        );
        dispatch(get_research_topic_service_auth()); // Fetch updated research topics
      })
      .catch((error) => {
        console.error("Error adding research topic:", error);
      });
  };

  const handleAddSystem = (newOrgan) => {
    const obj = { name: newOrgan };

    // Add new system to the backend
    dispatch(add_systems_service_auth(obj))
      .then(() => {
        // Ensure `formData.system` is an array
        const existingSystems = Array.isArray(formData.system)
          ? formData.system
          : [];

        // Update the formData with the new system
        const updatedSystems = [...existingSystems, newOrgan];
        handleChange(updatedSystems, "system"); // Update the input field with the newly added system

        // Optionally, refetch the system list from the backend
        dispatch(get_systems_service_auth());
      })
      .catch((error) => {
        console.error("Error adding organ:", error);
      });
  };

  const handleAddStudyType = (newStudyType) => {
    const obj = {
      name: newStudyType,
    };

    dispatch(add_study_type_service_auth(obj))
      .then(() => {
        // Ensure formData.studyType is an array
        const existingStudyTypes = Array.isArray(formData.studyType)
          ? formData.studyType
          : [];

        // Update the formData with the new study type
        const updatedStudyTypeList = [...existingStudyTypes, newStudyType];
        handleChange(updatedStudyTypeList, "studyType"); // Add new studyType to form

        // Optionally refetch study type list from backend
        dispatch(get_study_type_service_auth());
      })
      .catch((error) => {
        console.error("Error adding study type:", error);
      });
  };

  const handleAddOrgan = (newOrgan) => {
    const obj = { name: newOrgan };

    dispatch(add_organs_service_auth(obj))
      .then(() => {
        const updatedOrganList = [
          ...get_organs_data.organs,
          { name: newOrgan },
        ];

        // Ensure formData.organ is an array before spreading
        const organList = Array.isArray(formData.organ) ? formData.organ : [];

        handleChange([...organList, newOrgan], "organ");
        dispatch(get_organs_service_auth());
      })
      .catch((error) => {
        console.error("Error adding organ:", error);
      });
  };

  const handleAddDisease = (newDisease) => {
    const obj = { name: newDisease };

    dispatch(add_disease_service_auth(obj))
      .then(() => {
        // Ensure formData.diseaseModel is an array before spreading
        const diseaseList = Array.isArray(formData.diseaseModel) ? formData.diseaseModel : [];

        handleChange([...diseaseList, newDisease], "diseaseModel");
        dispatch(get_disease_service_auth());
      })
      .catch((error) => {
        console.error("Error adding disease:", error);
      });
  };

  const handleSliderChange = (event) => {
    const newValue = event.target.value;
    setSliderValue(newValue); // Update local slider state if needed for display
    setFormData((prevFormData) => ({
      ...prevFormData,
      rankThisArticle: { name: newValue, status: "Unverified" },
    })); // Update rankThisArticle in formData
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
    species: "Species",
  };

  // First, fix the handleAddSpeciesDetails function
  // const handleAddSpeciesDetails = (species, details) => {
  //     if (!species) return; // Guard against null species

  //     setFormData((prev) => {
  //         // Create a safe copy with default empty objects where needed
  //         const prevSpeciesDetails = prev.speciesDetails || {};
  //         const prevSpeciesData = prevSpeciesDetails[species] || {};

  //         // Processed details with null safety
  //         const processedDetails = {};

  //         // Process each field in the details object
  //         Object.entries(details).forEach(([key, value]) => {
  //             // Skip null/undefined fields completely
  //             if (value === null || value === undefined) {
  //                 processedDetails[key] = { name: "", status: "Unverified" };
  //                 return;
  //             }

  //             // For objects, extract name safely
  //             if (typeof value === 'object' && value !== null) {
  //                 processedDetails[key] = {
  //                     name: value.name || "",
  //                     status: (prevSpeciesData[key]?.status || "Unverified")
  //                 };
  //             } else {
  //                 // For primitive values like strings or numbers
  //                 processedDetails[key] = {
  //                     name: String(value),
  //                     status: (prevSpeciesData[key]?.status || "Unverified")
  //                 };
  //             }
  //         });

  //         // Return safely updated form data
  //         return {
  //             ...prev,
  //             speciesDetails: {
  //                 ...prevSpeciesDetails,
  //                 [species]: {
  //                     ...prevSpeciesData,
  //                     ...processedDetails
  //                 }
  //             }
  //         };
  //     });
  // };

  const handleAddSpeciesDetails = (species, details) => {
    if (!species) return; // Guard against null species

    setFormData((prev) => {
      // Create a safe copy with default empty objects where needed
      const prevSpeciesDetails = prev.speciesDetails || {};
      const prevSpeciesData = prevSpeciesDetails[species] || {};

      // Processed details with null safety
      const processedDetails = {};

      // Process each field in the details object
      Object.entries(details).forEach(([key, value]) => {
        if (key === "averageWeight") {
          // Merge unit and name/status for averageWeight
          const prevAvgWeight = prevSpeciesData.averageWeight || {};
          if (typeof value === "object" && value !== null) {
            processedDetails[key] = {
              ...prevAvgWeight,
              ...value,
              name: value.name !== undefined ? value.name : prevAvgWeight.name || "",
              status: value.status || prevAvgWeight.status || "Unverified",
              statusConcentration: value.statusConcentration || prevAvgWeight.statusConcentration || "estimated",
              unit: value.unit || prevAvgWeight.unit || "g"
            };
          } else {
            processedDetails[key] = {
              ...prevAvgWeight,
              name: String(value),
              status: prevAvgWeight.status || "Unverified",
              statusConcentration: prevAvgWeight.statusConcentration || "estimated",
              unit: prevAvgWeight.unit || "g"
            };
          }
        } else {
          // For other fields, keep existing logic
          if (value === null || value === undefined) {
            processedDetails[key] = { name: "", status: "Unverified" };
            return;
          }
          if (typeof value === "object" && value !== null) {
            processedDetails[key] = {
              name: value.name || "",
              status: prevSpeciesData[key]?.status || "Unverified",
              statusConcentration: value.statusConcentration || prevSpeciesData[key]?.statusConcentration || "estimated",
            };
          } else {
            processedDetails[key] = {
              name: String(value),
              status: prevSpeciesData[key]?.status || "Unverified",
              statusConcentration: prevSpeciesData[key]?.statusConcentration || "estimated",
            };
          }
        }
      });

      // Return safely updated form data
      const updatedFormData = {
        ...prev,
        speciesDetails: {
          ...prevSpeciesDetails,
          [species]: {
            ...prevSpeciesData,
            ...processedDetails,
          },
        },
      };

      // Check if weight-related fields were updated and call sync callback
      if (onWeightChange && (details.averageWeight !== undefined || details.weightUnit !== undefined)) {
        const speciesData = updatedFormData.speciesDetails[species];
        const weightData = {
          averageWeight: speciesData.averageWeight?.name || "",
          weightUnit: speciesData.averageWeight?.unit || ""
        };
        
        // Call the callback to sync with ResearcherForm
        setTimeout(() => {
          onWeightChange(species, weightData);
        }, 0);
      }

      return updatedFormData;
    });
  };

  console.log("formData.speciesDetails", formData.speciesDetails);
  console.log("speciesGetting", speciesGetting);


  const handleConcentrationChange = (species, fieldName, status) => {
    setFormData((prev) => {
      const prevSpeciesDetails = prev.speciesDetails || {};
      const prevSpeciesData = prevSpeciesDetails[species] || {};
      const fieldData = prevSpeciesData[fieldName] || {};

      return {
        ...prev,
        speciesDetails: {
          ...prevSpeciesDetails,
          [species]: {
            ...prevSpeciesData,
            [fieldName]: {
              ...fieldData,
              statusConcentration: status,
            },
          },
        },
      };
    });
  };
  // Fix each component rendering to handle null values

  // Update the renderSpeciesDetails function to safely access values
  const renderSpeciesDetails = (species) => {
    console.log("Rendering details for species:", species);
    if (!species) return null;

    // Ensure formData.speciesDetails exists
    const speciesDetails = formData?.speciesDetails || {};
    // Ensure formData.speciesDetails[species] exists
    const speciesData = speciesDetails[species] || {};

    // Safe access helper function
    const safeValue = (fieldName) => {
      const field = speciesData[fieldName];
      if (field === null || field === undefined) {
        return "";
      }
      
      if (typeof field === "object") {
        return field.name || "";
      }
      
      return field;
    };

    // Get status (estimated/assumed) safely
    const getStatusConcentration = (fieldName) => {
      return speciesData[fieldName]?.statusConcentration || "provided";
    };
    return (
      <div className="ml-4 border-l pl-4 mt-2">
       
          <div className="text-sm text-gray-500 mt-1 mb-2 font-extrabold">
            Note: Not required for review / non-experimental articles
          </div>
        

        <div style={{ width: "95%" }}>
          <Input
            label="Describe"
            value={safeValue("DescribeSpecies")}
            onChange={(selectedValue) =>
              handleAddSpeciesDetails(species, {
                ...(speciesData || {}),
                DescribeSpecies: selectedValue,
              })
            }
            name="DescribeSpecies"
            InfoTooltip={
              <InfoTooltip
                message={
                  "Provide the specific strains, breeds, or variants of the species when applicable (e.g., C57BL/6 mice, db/db mice, APO-KO mice, Sprague-Dawley rats, Wistar rats, thoroughbred horses, beagle dogs, Black-mottled pigs, and human populations distinguished by ethnicity, such as East Asian descent, African American populations, or Caucasian adults)."
                }
              />
            }
          />
         
            <div className="text-sm text-gray-500 mt-1 mb-2 font-extrabold">
              Note: Not required for review / non-experimental articles
            </div>
        
        </div>

        <div style={{ width: "95%" }}>
          <Input
            label="# of Subjects"
            value={safeValue("subjects")}
            onChange={(selectedValue) =>
              handleAddSpeciesDetails(species, {
                ...(speciesData || {}),
                subjects: selectedValue,
              })
            }
            name="subjects"
            type="number"
            InfoTooltip={
              <InfoTooltip
                message={
                  "Enter the total number of subjects included in the study."
                }
              />
            }
          />
         
            <div className="text-sm text-gray-500 mt-1 mb-2 font-extrabold">
              Note: Not required for review / non-experimental articles
            </div>
         
        </div>

        <CustomCreatableSelect
          isCreate={false}
          isMulti={false}
          label={"Health"}
          name="health"
          options={["Healthy", "Diseased"]}
          value={safeValue("health")}
          onChange={(selectedValue) =>
            handleAddSpeciesDetails(species, {
              ...(speciesData || {}),
              health: selectedValue,
            })
          }
          InfoTooltip={
            <InfoTooltip
              message={
                "Select the general health status of the subjects used in the study."
              }
            />
          }
        />
       
          <div className="text-sm text-gray-500 mt-1 mb-2 font-extrabold">
            Note: Not required for review / non-experimental articles
          </div>
       

        <CustomCreatableSelect
          isCreate={false}
          isMulti={false}
          label={"Sex"}
          name="gender"
          options={["Male", "Female", "Both"]}
          value={safeValue("gender")}
          onChange={(selectedValue) =>
            handleAddSpeciesDetails(species, {
              ...(speciesData || {}),
              gender: selectedValue,
            })
          }
          InfoTooltip={
            <InfoTooltip
              message={
                "Select the gender distribution of the subjects in the study (e.g., Male, Female, Mixed)."
              }
            />
          }
        />
   
          <div className="text-sm text-gray-500 mt-1 mb-2 font-extrabold">
            Note: Not required for review / non-experimental articles
          </div>
      
        <ReuseableInput
          type="number"
          label="Average Age"
          name="averageAge"
          value={safeValue("averageAge")}
          onChange={(value) =>
            handleAddSpeciesDetails(species, {
              ...(speciesData || {}),
              averageAge: value,
            })
          }
          unit={safeValue("ageUnit") || "years"}
          onUnitChange={(newUnit) =>
            handleAddSpeciesDetails(species, {
              ...(speciesData || {}),
              ageUnit: newUnit,
            })
          }
          options={["days", "weeks", "months", "years"]}
          placeholder="e.g., 2 years"
          width={"50px"}
          InfoTooltip={
            <InfoTooltip
              message={"Provide the average age of the subjects in the study."}
            />
          }
          child={
            <div className="mt-2 flex space-x-4">
              {/* --- Estimated --- */}
              <div style={{ display: "inline-flex", alignItems: "center" }}>
                <input
                  type="radio"
                  id={`estimated-${species}-age`}
                  name={`status-age-${species}`}
                  value="estimated"
                  checked={getStatusConcentration("averageAge") === "estimated"}
                  onChange={() =>
                    handleConcentrationChange(
                      species,
                      "averageAge",
                      "estimated"
                    )
                  }
                  style={{
                    marginRight: "5px",
                    accentColor: "#004c78",
                    cursor: "pointer",
                  }}
                />
                <label
                  htmlFor={`estimated-${species}-age`}
                  style={{ cursor: "pointer" }}
                >
                  Estimated/Assumed
                </label>
              </div>

                            {/* --- Provided (default) --- */}
              <div style={{ display: "inline-flex", alignItems: "center" }}>
                <input
                  type="radio"
                  id={`provided-${species}-age`}
                  name={`status-age-${species}`}
                  value="provided"
                  checked={
                    getStatusConcentration("averageAge") === "provided" ||
                    !["estimated", "assumed"].includes(
                      getStatusConcentration("averageAge")
                    )
                  }
                  onChange={() =>
                    handleConcentrationChange(species, "averageAge", "provided")
                  }
                  style={{
                    marginRight: "5px",
                    accentColor: "#004c78",
                    cursor: "pointer",
                  }}
                />
                <label
                  htmlFor={`provided-${species}-age`}
                  style={{ cursor: "pointer" }}
                >
                  Provided
                </label>
              </div>


              {/* --- Assumed ---
              <div style={{ display: "inline-flex", alignItems: "center" }}>
                <input
                  type="radio"
                  id={`assumed-${species}-age`}
                  name={`status-age-${species}`}
                  value="assumed"
                  checked={getStatusConcentration("averageAge") === "assumed"}
                  onChange={() =>
                    handleConcentrationChange(species, "averageAge", "assumed")
                  }
                  style={{
                    marginRight: "5px",
                    accentColor: "#004c78",
                    cursor: "pointer",
                  }}
                />
                <label
                  htmlFor={`assumed-${species}-age`}
                  style={{ cursor: "pointer" }}
                >
                  Assumed
                </label>
              </div> */}
            </div>
          }
        />
      
          <div className="text-sm text-gray-500 mt-1 mb-2 font-extrabold">
            Note: Not required for review / non-experimental articles
          </div>
   

        <ReuseableInput
          type="number"
          label="Average Weight"
          name="averageWeight"
          value={safeValue("averageWeight")}
          onChange={(value) =>
            handleAddSpeciesDetails(species, {
              ...(speciesData || {}),
              averageWeight: value,
            })
          }
         unit={speciesData?.averageWeight?.unit || (species && species.toLowerCase().includes('human') ? 'kg' : 'g')}
          onUnitChange={(newUnit) =>
           handleAddSpeciesDetails(species, {
  ...(speciesData || {}),
  averageWeight: {
    ...(speciesData?.averageWeight || {}),
    unit: newUnit,
  },
})
          }
          options={["g", "kg", "Lbs"]}
          placeholder="e.g., 20 Kg"
          width={"40px"}
          InfoTooltip={
            <InfoTooltip
              message={"Provide the average weight of the subjects in the study."}
            />
          }
          child={
            <div className="mt-2 flex space-x-4">

              {/* Estimated */}
              <div style={{ display: "inline-flex", alignItems: "center" }}>
                <input
                  type="radio"
                  id={`estimated-${species}-weight`}
                  name={`status-weight-${species}`}
                  value="estimated"
                  checked={
                    getStatusConcentration("averageWeight") === "estimated"
                  }
                  onChange={() =>
                    handleConcentrationChange(
                      species,
                      "averageWeight",
                      "estimated"
                    )
                  }
                  style={{
                    marginRight: "5px",
                    accentColor: "#004c78",
                    cursor: "pointer",
                  }}
                />
                <label
                  htmlFor={`estimated-${species}-weight`}
                  style={{ cursor: "pointer" }}
                >
                  Estimated/Assumed
                </label>
              </div>

              {/* Provided */}
              <div style={{ display: "inline-flex", alignItems: "center" }}>
                <input
                  type="radio"
                  id={`provided-${species}-weight`}
                  name={`status-weight-${species}`}
                  value="provided"
                  checked={
                    getStatusConcentration("averageWeight") === "provided" ||
                    !["estimated", "assumed"].includes(
                      getStatusConcentration("averageWeight")
                    )
                  }
                  onChange={() =>
                    handleConcentrationChange(
                      species,
                      "averageWeight",
                      "provided"
                    )
                  }
                  style={{
                    marginRight: "5px",
                    accentColor: "#004c78",
                    cursor: "pointer",
                  }}
                />
                <label
                  htmlFor={`provided-${species}-weight`}
                  style={{ cursor: "pointer" }}
                >
                  Provided
                </label>
              </div>

              {/* Assumed
              <div style={{ display: "inline-flex", alignItems: "center" }}>
                <input
                  type="radio"
                  id={`assumed-${species}-weight`}
                  name={`status-weight-${species}`}
                  value="assumed"
                  checked={getStatusConcentration("averageWeight") === "assumed"}
                  onChange={() =>
                    handleConcentrationChange(
                      species,
                      "averageWeight",
                      "assumed"
                    )
                  }
                  style={{
                    marginRight: "5px",
                    accentColor: "#004c78",
                    cursor: "pointer",
                  }}
                />
                <label
                  htmlFor={`assumed-${species}-weight`}
                  style={{ cursor: "pointer" }}
                >
                  Assumed
                </label>
              </div> */}
            </div>
          }
        />
      
          <div className="text-sm text-gray-500 mt-1 mb-2 font-extrabold">
            Note: Not required for review / non-experimental articles
          </div>
    
      </div>
    );
  };
  const humanStudy = formData?.inVivo?.find(
    (item) => item.name === "Human Study"
  );

  const handleStatusChange = (fieldName, newStatus) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: Array.isArray(prev[fieldName])
        ? prev[fieldName].map((item) => ({ ...item, status: newStatus }))
        : { ...prev[fieldName], status: newStatus },
    }));
  };

  const handleStatusChangeRank = (fieldName, newStatus) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName], // Preserve existing values
        status: newStatus, // Update status only
      },
    }));
  };

  const handleStatusChangeOpinion = (fieldName, newStatus) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName], // Preserve existing values
        status: newStatus, // Update status only
      },
    }));
  };

  // console.log("formData", formData);

  const highlightArticleValue =
    formData.HighlightArticle?.name === true
      ? { name: "True", status: formData.HighlightArticle.status }
      : formData.HighlightArticle?.name === false
      ? { name: "False", status: formData.HighlightArticle.status }
      : formData.HighlightArticle;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-6">
      <h1 className="text-2xl font-bold mb-6">Article General Information</h1>

      <form onSubmit={handleSubmit}>
        <Accordion
          title="Study Evaluation"
          isOpen={isStudyEvaluation}
          onToggle={() => setIsStudyEvaluation((prev) => !prev)}
        >
          <Input
            label="Outcome"
            value={formData.outcome?.name}
            onChange={handleChange}
            name="outcome"
            InfoTooltip={
              <InfoTooltip message="Briefly summarize the outcome of the article. State whether there were null (neutral), positive, or negative effects. Mark all that apply. (Note: multiple outcomes may be possible. For example, if the study did not offer the positive effects in the hypothesized outcome, but had secondary positive effects, this could be marked as neutral and positive.)" />
            }
            isSpecialAction={isSpecialAction} // Pass isSpecialAction
            status={formData.outcome?.status} // Pass status
            onStatusChange={handleStatusChange} // Pass status change handler
          />

          {/* Outcome Checkboxes */}
          <label className="block font-bold mb-2">
            Mark the outcome (primary, secondary, etc.) of the article (Mark all
            that apply)
          </label>
          <div className="flex items-center space-x-4 mb-2">
            <div>
              <input
                type="checkbox"
                id="outcome-positive"
                name="outcomeType"
                value="Positive"
                // checked={formData.outcomeType?.includes("Positive")}
                checked={formData.outcomeType?.some((item) =>
                  typeof item === "string"
                    ? item.toLowerCase() === "positive".toLowerCase()
                    : item.name?.toLowerCase() === "positive".toLowerCase()
                )}
                onChange={(e) => {
                  const selectedOutcomes = formData.outcomeType || [];
                  if (e.target.checked) {
                    setFormData({
                      ...formData,
                      outcomeType: [...selectedOutcomes, e.target.value],
                    });
                  } else {
                    setFormData({
                      ...formData,
                      outcomeType: selectedOutcomes.filter(
                        (outcome) => outcome !== e.target.value
                      ),
                    });
                  }
                }}
              />
              <label htmlFor="outcome-positive" className="ml-2">
                😊 Positive
              </label>
            </div>

            <div>
              <input
                type="checkbox"
                id="outcome-neutral"
                name="outcomeType"
                value="Neutral"
                // checked={formData.outcomeType?.includes("Neutral")}
                checked={formData.outcomeType?.some((item) =>
                  typeof item === "string"
                    ? item.toLowerCase() === "neutral".toLowerCase()
                    : item.name?.toLowerCase() === "neutral".toLowerCase()
                )}
                onChange={(e) => {
                  const selectedOutcomes = formData.outcomeType || [];
                  if (e.target.checked) {
                    setFormData({
                      ...formData,
                      outcomeType: [...selectedOutcomes, e.target.value],
                    });
                  } else {
                    setFormData({
                      ...formData,
                      outcomeType: selectedOutcomes.filter(
                        (outcome) => outcome !== e.target.value
                      ),
                    });
                  }
                }}
              />
              <label htmlFor="outcome-neutral" className="ml-2">
                🙂 Neutral
              </label>
            </div>

            <div>
              <input
                type="checkbox"
                id="outcome-negative"
                name="outcomeType"
                value="Negative"
                // checked={formData.outcomeType?.includes("Negative")}
                checked={formData.outcomeType?.some((item) =>
                  typeof item === "string"
                    ? item.toLowerCase() === "negative".toLowerCase()
                    : item.name?.toLowerCase() === "negative".toLowerCase()
                )}
                onChange={(e) => {
                  const selectedOutcomes = formData.outcomeType || [];
                  if (e.target.checked) {
                    setFormData({
                      ...formData,
                      outcomeType: [...selectedOutcomes, e.target.value],
                    });
                  } else {
                    setFormData({
                      ...formData,
                      outcomeType: selectedOutcomes.filter(
                        (outcome) => outcome !== e.target.value
                      ),
                    });
                  }
                }}
              />
              <label htmlFor="outcome-negative" className="ml-2">
                ☹️ Negative
              </label>
            </div>
          </div>

          <div className="mb-4">
            <div
              className="block text-gray-700 font-semibold mb-2"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                <span>Rank this Article</span>
                <span>
                  <InfoTooltip message="This is subjective ranking. Things to consider are study design, journal credibility, impressive effects, etc." />
                </span>
              </span>

              <span>
                <div className="text-center mt-2 font-semibold">
                  {formData?.rankThisArticle?.name}
                </div>
              </span>

              {isSpecialAction && formData.rankThisArticle && (
                <span>
                  {isSpecialAction && formData.rankThisArticle && (
                    <div className="ml-4 flex items-center space-x-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="rankThisArticle-status"
                          value="Verified"
                          checked={
                            formData.rankThisArticle?.status === "Verified"
                          }
                          onChange={() =>
                            handleStatusChangeRank(
                              "rankThisArticle",
                              "Verified"
                            )
                          }
                          className="mr-1"
                        />
                        <span>Verified</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="rankThisArticle-status"
                          value="Unverified"
                          checked={
                            formData.rankThisArticle?.status === "Unverified"
                          }
                          onChange={() =>
                            handleStatusChangeRank(
                              "rankThisArticle",
                              "Unverified"
                            )
                          }
                          className="mr-1"
                        />
                        <span>Unverified</span>
                      </label>
                    </div>
                  )}
                </span>
              )}
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={formData?.rankThisArticle?.name}
              onChange={handleSliderChange}
              className="w-full"
            />
          </div>

          <CustomCreatableSelect
            isCreate={false}
            label="Highlight Article?"
            name="HighlightArticle"
            options={["True", "False"]}
            value={highlightArticleValue}
            onChange={handleChange}
            InfoTooltip={
              <InfoTooltip message="Should this article be highlighted for notable outcomes or significant benefits?" />
            }
            isSpecialAction={isSpecialAction} // Pass isSpecialAction
            status={formData.HighlightArticle?.status} // Pass status
            onStatusChange={handleStatusChange} // Pass status change handler
            showNaOption={false} // Hide "N/A" option
          />

          {formData.HighlightArticle?.name === "True" && (
            <Input
              label="Describe"
              value={formData.descHighArt?.name}
              onChange={handleChange}
              name="descHighArt"
              InfoTooltip={
                <InfoTooltip message="What was noteworthy about this article?" />
              }
              isSpecialAction={isSpecialAction} // Pass isSpecialAction
              status={formData.descHighArt?.status} // Pass status
              onStatusChange={handleStatusChange} // Pass status change handler
            />
          )}
        </Accordion>

        <Accordion
          title="Study Details"
          isOpen={isStudyType}
          onToggle={() => setIsStudyType((prev) => !prev)}
        >
          <CustomCreatableSelect
            isCreate={true}
            label="Article type"
            options={
              (get_study_type_data?.studyTypes?.map(type => type.name) || []).sort((a, b) => a.localeCompare(b))
            }

            value={formData.studyType}
            onChange={handleChange}
            name="studyType"
            isMulti
            handleAddSpecies={handleAddStudyType}
            InfoTooltip={
              <InfoTooltip
                width={"600px"}
                message={
                  <span>
                    <strong>Choose from the following Article Types:</strong>{" "}
                    <br />
                    <br />
                    <strong> In Vivo:</strong> Studies conducted in living
                    organisms. <br />
                    <strong>In Vitro:</strong> Studies conducted outside a
                    living organism (e.g., in a petri dish).
                    <br />
                    <strong>In Silico:</strong> Computational studies (e.g.,
                    simulations, modeling, bioinformatics).
                    <br />
                    <strong>Ex Vivo:</strong> Studies when the tissues/cells are
                    taken from the organism
                    <br />
                    <strong>Non-experimental:</strong> Studies such as review,
                    opinion pieces, hypothesis, and therapeutic delivery systems
                    <br />
                    <strong>Chemical/Physicochemical Study:</strong> Research
                    exploring H₂ solubility in different solvents, reaction
                    kinetics, or the effects of temperature and pressure on H₂
                    stability.
                    <br />
                    <strong>Other:</strong> Choose if the study type does not
                    fit into the categories above
                    <br />
                  </span>
                }
              />
            }
          />

          {(formData?.studyType?.find(
            (item) => item.name === "Non-experimental (Review)"
          ) ||
            showNonExperimental ||
            BothTrueState) && (
            <div className="border border-gray-300 rounded-lg shadow-sm mb-4">
              <button
                type="button"
                onClick={() => setIsNonExparimentalState((prev) => !prev)}
                className="w-full text-left px-4 py-2 flex justify-between items-center bg-blue-100 rounded-t-lg hover:bg-blue-200 focus:outline-none"
                style={{ color: colorTheme.primary, fontWeight: "bold" }}
              >
                <span>{"Non Experimental"}</span>
                <span>{isNonExparimentalState ? "-" : "+"}</span>
              </button>

              {isNonExparimentalState && (
                <div className=" px-4 py-2">
                  <>
                    <CustomCreatableSelect
                      isCreate={false}
                      isMulti
                      label="Choose which kind of Non-experimental Article"
                      options={[
                        "Literature",
                        "Systematic",
                        "Meta analysis",
                        "Hypothesis",
                        "Opinion Piece",
                      ].sort((a, b) =>
                        a.localeCompare(b)
                      )}

                    
                      value={formData.NonExperimentalSelect}
                      onChange={handleChange}
                      name="NonExperimentalSelect"
                      InfoTooltip={
                        <InfoTooltip
                          message={
                            <span>
                              <strong>
                                Studies such as review, opinion pieces,
                                hypothesis, and therapeutic delivery systems
                              </strong>
                            </span>
                          }
                        />
                      }
                      isSpecialAction={isSpecialAction} // Pass isSpecialAction
                      status={
                        Array.isArray(formData?.NonExperimentalSelect) &&
                        formData.NonExperimentalSelect.length > 0
                          ? formData.NonExperimentalSelect[0].status
                          : undefined
                      }
                      onStatusChange={handleStatusChange} // Pass status change handler
                    />

                    {formData?.NonExperimentalSelect?.find(
                      (item) => item.name === "Review Study Type"
                    ) && (
                      <CustomCreatableSelect
                        isCreate={false}
                        label="Review Study Type"
                        options={[
                          "Clinical Studies",
                          "Molecular Mechanisms",
                          "Systematic Review",
                          "Meta-analysis",
                          "General",
                        ].sort((a, b) => a.localeCompare(b))
                        }
                        value={
                          formData?.ReviewStudyType ||
                          formData?.ReviewStudyType?.name
                        }
                        onChange={handleChange}
                        name="ReviewStudyType"
                        InfoTooltip={
                          <InfoTooltip
                            message={
                              <span>
                                <strong>
                                  Select the type of review study from the
                                  following:
                                </strong>
                              </span>
                            }
                          />
                        }
                        isSpecialAction={isSpecialAction} // Pass isSpecialAction
                        status={formData?.ReviewStudyType?.status}
                        onStatusChange={handleStatusChange} // Pass status change handler
                      />
                    )}

                    {formData?.NonExperimentalSelect?.find(
                      (item) => item.name === "Opinion Piece"
                    ) && (
                      <div className="mb-4">
                        <div className="mb-4 relative">
                          <div className="block text-gray-700 font-semibold mb-2 flex justify-between items-center w-full">
                            {/* Left Section: Label & Tooltip */}
                            <div className="flex items-center">
                              <span>Opinion Piece</span>
                              <span>
                                <InfoTooltip message="Editorials, perspectives, commentaries." />
                              </span>
                            </div>

                            {/* Right Section: Radio Buttons */}
                            {isSpecialAction && formData.OpinionPiece && (
                              <div className="ml-4 flex items-center space-x-2">
                                <label className="flex items-center">
                                  <input
                                    type="radio"
                                    name="OpinionPiece-status"
                                    value="Verified"
                                    checked={
                                      formData.OpinionPiece?.status ===
                                      "Verified"
                                    }
                                    onChange={() =>
                                      handleStatusChangeOpinion(
                                        "OpinionPiece",
                                        "Verified"
                                      )
                                    }
                                    className="mr-1"
                                  />
                                  <span>Verified</span>
                                </label>

                                <label className="flex items-center">
                                  <input
                                    type="radio"
                                    name="OpinionPiece-status"
                                    value="Unverified"
                                    checked={
                                      formData.OpinionPiece?.status ===
                                      "Unverified"
                                    }
                                    onChange={() =>
                                      handleStatusChangeOpinion(
                                        "OpinionPiece",
                                        "Unverified"
                                      )
                                    }
                                    className="mr-1"
                                  />
                                  <span>Unverified</span>
                                </label>
                              </div>
                            )}
                          </div>

                          {/* Textarea Field */}
                          <textarea
                            value={formData.OpinionPiece?.name}
                            onChange={(e) =>
                              handleChange(e.target.value, "OpinionPiece")
                            }
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                              validationErrors.OpinionPiece?.name
                                ? "border-red-500"
                                : "focus:ring-2 focus:ring-blue-500"
                            }`}
                            rows="4"
                            placeholder="Enter Opinion Piece"
                            style={{
                              border: formData.OpinionPiece && "2px solid gray",
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {formData?.NonExperimentalSelect?.find(
                      (item) => item.name === "Hypothesis"
                    ) && (
                      <Input
                        label="Hypothesis"
                        value={formData.Hypothesis?.name}
                        onChange={handleChange}
                        name="Hypothesis"
                        InfoTooltip={
                          <InfoTooltip
                            message={
                              "Articles proposing a theory or explanation."
                            }
                          />
                        }
                        isSpecialAction={isSpecialAction} // Pass isSpecialAction
                        status={formData.Hypothesis?.status} // Pass status
                        onStatusChange={handleStatusChange} // Pass status change handler
                      />
                    )}

                    {formData?.NonExperimentalSelect?.find(
                      (item) => item.name === "Therapeutic Delivery Systems"
                    ) && (
                      <Input
                        label="Therapeutic Delivery Systems"
                        value={formData.TherapeuticDeliverySystems?.name}
                        onChange={handleChange}
                        name="TherapeuticDeliverySystems"
                        InfoTooltip={
                          <InfoTooltip
                            message={
                              "Research on systems designed to deliver therapeutic agents to specific tissues or organs (e.g., nanoparticles, liposomes)."
                            }
                          />
                        }
                        isSpecialAction={isSpecialAction} // Pass isSpecialAction
                        status={formData.TherapeuticDeliverySystems?.status} // Pass status
                        onStatusChange={handleStatusChange} // Pass status change handler
                      />
                    )}
                  </>
                </div>
              )}
            </div>
          )}

          {showInVivoInput && (
            <div className="border border-gray-300 rounded-lg shadow-sm mb-4">
              <button
                type="button"
                onClick={() => setIsVivoState((prev) => !prev)}
                className="w-full text-left px-4 py-2 flex justify-between items-center bg-blue-100 rounded-t-lg hover:bg-blue-200 focus:outline-none"
                style={{ color: colorTheme.primary, fontWeight: "bold" }}
              >
                <span>{"In Vivo"}</span>
                <span>{isVivoState ? "-" : "+"}</span>
              </button>

              {isVivoState && (
                <div className=" px-4 py-2">
                  <>
                    <CustomCreatableSelect
                      isMulti
                      isCreate={false}
                      label="Is it a Human Study, Animal Study or Plant Study?"
                      options={[ "Animal Study", "Human Study", "Plant Study"]}
                      value={formData?.inVivo}
                      onChange={handleChange}
                      name="inVivo"
                      InfoTooltip={
                        <InfoTooltip
                          message={
                            <span>
                              <strong>
                                In Vivo Studies are conducted in living
                                organisms. Please select whether it was human or
                                animal study.
                              </strong>
                            </span>
                          }
                        />
                      }
                      isSpecialAction={isSpecialAction} // Pass isSpecialAction
                      status={
                        Array.isArray(formData?.inVivo) &&
                        formData.inVivo.length > 0
                          ? formData.inVivo[0].status
                          : undefined
                      }
                      onStatusChange={handleStatusChange} // Pass status change handler
                    />

                    {humanStudy && (
                      <div className="mt-4">
                        <h4 className="text-md font-semibold mb-2">
                          Human Study Type:
                        </h4>
                        <div className="mb-4">
                          <label className="block font-bold mb-1">
                            Select Study Type:
                          </label>
                          <div className="flex items-center space-x-4">
                            <div>
                              <input
                                type="checkbox"
                                id="clinical-trial"
                                name="studyType"
                                value="Clinical Trial"
                                checked={formData.selectedStudyTypes?.includes(
                                  "Clinical Trial"
                                )} // यहां `selectedStudyTypes` का उपयोग करें
                                onChange={(e) => {
                                  const selectedTypes =
                                    formData.selectedStudyTypes || []; // यहां `selectedStudyTypes` का उपयोग करें
                                  if (e.target.checked) {
                                    setFormData({
                                      ...formData,
                                      selectedStudyTypes: [
                                        ...selectedTypes,
                                        e.target.value,
                                      ],
                                    }); // यहां `selectedStudyTypes` का उपयोग करें
                                  } else {
                                    setFormData({
                                      ...formData,
                                      selectedStudyTypes: selectedTypes.filter(
                                        (type) => type !== e.target.value
                                      ), // यहां `selectedStudyTypes` का उपयोग करें
                                    });
                                  }
                                }}
                              />
                              <label htmlFor="clinical-trial" className="ml-2">
                                Clinical Trial Design
                              </label>
                            </div>
                            <div>
                              <input
                                type="checkbox"
                                id="observational-study"
                                name="studyType"
                                value="Observational Study"
                                checked={formData.selectedStudyTypes?.includes(
                                  "Observational Study"
                                )} // यहां `selectedStudyTypes` का उपयोग करें
                                onChange={(e) => {
                                  const selectedTypes =
                                    formData.selectedStudyTypes || []; // यहां `selectedStudyTypes` का उपयोग करें
                                  if (e.target.checked) {
                                    setFormData({
                                      ...formData,
                                      selectedStudyTypes: [
                                        ...selectedTypes,
                                        e.target.value,
                                      ],
                                    }); // यहां `selectedStudyTypes` का उपयोग करें
                                  } else {
                                    setFormData({
                                      ...formData,
                                      selectedStudyTypes: selectedTypes.filter(
                                        (type) => type !== e.target.value
                                      ), // यहां `selectedStudyTypes` का उपयोग करें
                                    });
                                  }
                                }}
                              />
                              <label
                                htmlFor="observational-study"
                                className="ml-2"
                              >
                                Observational Study
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Clinical Trial Design */}
                        {formData.selectedStudyTypes?.includes(
                          "Clinical Trial"
                        ) && (
                          <div>
                            <label className="block font-bold mb-1">
                              Clinical Trial Design:
                            </label>
                            <div className="space-y-1">
                              {[
                                "Non-Randomized Trial",
                                "Randomized",
                                "Double-Blinded",
                                "Single-Blinded",
                                "Unblinded",
                                "Placebo-Controlled",
                                "Non-Placebo-Controlled",
                                "Crossover",
                                "Pilot / Feasibility",
                              ].map((option, index) => (
                                <div key={index}>
                                  <input
                                    type="checkbox"
                                    id={`clinical-${index}`}
                                    checked={formData.clinicalTrialDesign?.includes(
                                      option
                                    )}
                                    onChange={(e) => {
                                      const updatedTypes = e.target.checked
                                        ? [
                                            ...(formData.clinicalTrialDesign ||
                                              []),
                                            option,
                                          ]
                                        : formData.clinicalTrialDesign.filter(
                                            (type) => type !== option
                                          );
                                      setFormData({
                                        ...formData,
                                        clinicalTrialDesign: updatedTypes,
                                      });
                                    }}
                                  />
                                  <label
                                    htmlFor={`clinical-${index}`}
                                    className="ml-2"
                                  >
                                    {option}
                                  </label>
                                </div>
                              ))}
                              <div>
                                <input
                                  type="checkbox"
                                  id="clinical-other"
                                  name="clinical-other"
                                  checked={formData.clinicalTrialDesign?.includes(
                                    "Other"
                                  )}
                                  onChange={(e) => {
                                    const updatedTypes = e.target.checked
                                      ? [
                                          ...(formData.clinicalTrialDesign ||
                                            []),
                                          "Other",
                                        ]
                                      : formData.clinicalTrialDesign.filter(
                                          (type) => type !== "Other"
                                        );
                                    setFormData({
                                      ...formData,
                                      clinicalTrialDesign: updatedTypes,
                                      otherClinicalStudy: "",
                                    });
                                  }}
                                />
                                <label
                                  htmlFor="clinical-other"
                                  className="ml-2"
                                >
                                  Other
                                </label>
                              </div>
                              {formData.clinicalTrialDesign?.includes(
                                "Other"
                              ) && (
                                <input
                                  type="text"
                                  className="w-full mt-2 p-2 border rounded"
                                  placeholder="Describe"
                                  value={formData.otherClinicalStudy || ""}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      otherClinicalStudy: e.target.value,
                                    })
                                  }
                                />
                              )}
                            </div>
                          </div>
                        )}

                        {/* Observational Study */}
                        {formData.selectedStudyTypes?.includes(
                          "Observational Study"
                        ) && (
                          <div>
                            <label className="block font-bold mb-1">
                              Observational Study:
                            </label>
                            <div className="space-y-1">
                              {[
                                "Cohort",
                                "Cross-Sectional",
                                "Case-Control",
                                "Longitudinal",
                                "Case Report",
                                "Survey",
                              ].map((option, index) => (
                                <div key={index}>
                                  <input
                                    type="checkbox"
                                    id={`observational-${index}`}
                                    checked={formData.observationalStudy?.includes(
                                      option
                                    )}
                                    onChange={(e) => {
                                      const updatedTypes = e.target.checked
                                        ? [
                                            ...(formData.observationalStudy ||
                                              []),
                                            option,
                                          ]
                                        : formData.observationalStudy.filter(
                                            (type) => type !== option
                                          );
                                      setFormData({
                                        ...formData,
                                        observationalStudy: updatedTypes,
                                      });
                                    }}
                                  />
                                  <label
                                    htmlFor={`observational-${index}`}
                                    className="ml-2"
                                  >
                                    {option}
                                  </label>
                                </div>
                              ))}
                              <div>
                                <input
                                  type="checkbox"
                                  id="observational-other"
                                  name="observational-other"
                                  checked={formData.observationalStudy?.includes(
                                    "Other"
                                  )}
                                  onChange={(e) => {
                                    const updatedTypes = e.target.checked
                                      ? [
                                          ...(formData.observationalStudy ||
                                            []),
                                          "Other",
                                        ]
                                      : formData.observationalStudy.filter(
                                          (type) => type !== "Other"
                                        );
                                    setFormData({
                                      ...formData,
                                      observationalStudy: updatedTypes,
                                      otherObservationalStudy: "",
                                    });
                                  }}
                                />
                                <label
                                  htmlFor="observational-other"
                                  className="ml-2"
                                >
                                  Other
                                </label>
                              </div>
                              {formData.observationalStudy?.includes(
                                "Other"
                              ) && (
                                <input
                                  type="text"
                                  className="w-full mt-2 p-2 border rounded"
                                  placeholder="Describe"
                                  value={formData.otherObservationalStudy || ""}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      otherObservationalStudy: e.target.value,
                                    })
                                  }
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Duration of Study */}
                    {formData?.inVivo?.length ? (
                      <div className="mt-4">
                        <TimeDurationInput
                          type="number"
                          label="Duration of Study"
                          name="durationOfStudy"
                          value={
                            formData.durationOfStudy?.name ||
                            formData.durationOfStudy
                          }
                          onChange={handleChange}
                          InfoTooltip={
                            <InfoTooltip
                              message="Enter the total duration of the study in hours, weeks, months, or years. This should reflect the 
                                                                            full period over which data was collected, including any follow-ups or extended 
                                                                            observation periods."
                            />
                          }
                          error={validationErrors.durationOfStudy?.name}
                          unit={formData.studyDurationUnit}
                          onUnitChange={(newUnit) =>
                            setFormData({
                              ...formData,
                              studyDurationUnit: newUnit,
                            })
                          }
                          isSpecialAction={isSpecialAction} // Pass isSpecialAction
                          status={formData.durationOfStudy?.status} // Pass status
                          onStatusChange={handleStatusChange} // Pass status change handler
                        />
                      </div>
                    ) : null}

                    <CustomCreatableSelect
                      isMulti
                      isCreate={false}
                      label="What was the timing of the treatment?"
                      options={["Post-treatment",
                        "Pre-treatment",
                        "Simultaneous",
                        
                      ]}
                      value={formData?.timingTreatmentInVivo}
                      onChange={handleChange}
                      name="timingTreatmentInVivo"
                      isSpecialAction={isSpecialAction}
                      status={
                        Array.isArray(formData?.timingTreatmentInVivo) &&
                        formData.timingTreatmentInVivo.length > 0
                          ? formData.timingTreatmentInVivo[0].status
                          : undefined
                      }
                      onStatusChange={handleStatusChange} // Pass status change handler
                    />
                  </>
                </div>
              )}
            </div>
          )}

          {showInVitroInput && (
            <div className="border border-gray-300 rounded-lg shadow-sm mb-4">
              <button
                type="button"
                onClick={() => setIsVitroState((prev) => !prev)}
                className="w-full text-left px-4 py-2 flex justify-between items-center bg-blue-100 rounded-t-lg hover:bg-blue-200 focus:outline-none"
                style={{ color: colorTheme.primary, fontWeight: "bold" }}
              >
                <span>{"In Vitro"}</span>
                <span>{isVitroState ? "-" : "+"}</span>
              </button>

              {isVitroState && (
                <div className=" px-4 py-2">
                  <>
                    {/* {formData?.inVitro && ( */}
                    <Input
                      label="What kind of cell?"
                      value={formData.WhatKindCell?.name}
                      onChange={handleChange}
                      name="WhatKindCell"
                      InfoTooltip={
                        <InfoTooltip
                          message={`Research involving cells grown in controlled conditions.`}
                        />
                      }
                      isSpecialAction={isSpecialAction} // Pass isSpecialAction
                      status={formData.WhatKindCell?.status} // Pass status
                      onStatusChange={handleStatusChange} // Pass status change handler
                    />

                    <TimeDurationInput
                      type="number"
                      label="Duration of Study? ( In Vitro )"
                      name="durationOfStudyinVitro"
                      value={formData.durationOfStudyinVitro?.name}
                      onChange={handleChange}
                      InfoTooltip={
                        <InfoTooltip message="How long was the study conducted for? 1 week? 15 minutes? etc." />
                      }
                      error={validationErrors.durationOfStudyinVitro?.name}
                      unit={formData.UnitOfStudyInVitro}
                      onUnitChange={(newUnit) =>
                        setFormData({
                          ...formData,
                          UnitOfStudyInVitro: newUnit,
                        })
                      }
                      isSpecialAction={isSpecialAction} // Pass isSpecialAction
                      status={formData.durationOfStudyinVitro?.status} // Pass status
                      onStatusChange={handleStatusChange} // Pass status change handler
                    />

                    <CustomCreatableSelect
                      isMulti
                      isCreate={false}
                      label="What was the timing of the treatment? ( In Vitro )"
                      options={[
                           "Post-treatment",
                        "Pre-treatment",
                        "Simultaneous",
                     
                      ]}
                      value={formData?.timingTreatmentInVitro}
                      onChange={handleChange}
                      name="timingTreatmentInVitro"
                      isSpecialAction={isSpecialAction}
                      status={
                        Array.isArray(formData?.timingTreatmentInVitro) &&
                        formData.timingTreatmentInVitro.length > 0
                          ? formData.timingTreatmentInVitro[0].status
                          : undefined
                      }
                      onStatusChange={handleStatusChange} // Pass status change handler
                    />
                  </>
                </div>
              )}
            </div>
          )}

          {showExVivoInput && (
            <div className="border border-gray-300 rounded-lg shadow-sm mb-4">
              <button
                type="button"
                onClick={() => setIsExVivoState((prev) => !prev)}
                className="w-full text-left px-4 py-2 flex justify-between items-center bg-blue-100 rounded-t-lg hover:bg-blue-200 focus:outline-none"
                style={{ color: colorTheme.primary, fontWeight: "bold" }}
              >
                <span>{"Ex Vivo"}</span>
                <span>{isExVivoState ? "-" : "+"}</span>
              </button>

              {isExVivoState && (
                <div className=" px-4 py-2">
                  <>
                    <Input
                      label="What kind of cell / Tissue was used?"
                      value={formData.WhatCellTissueUsed?.name}
                      onChange={handleChange}
                      name="WhatCellTissueUsed"
                      InfoTooltip={
                        <InfoTooltip
                          message="Specify the type of cell line, primary cell, or tissue sample used in the study (e.g., human 
                                    lung epithelial cells, rat liver tissue, stem cells, etc.)."
                        />
                      }
                      isSpecialAction={isSpecialAction} // Pass isSpecialAction
                      status={formData.WhatCellTissueUsed?.status} // Pass status
                      onStatusChange={handleStatusChange} // Pass status change handler
                    />

                    <TimeDurationInput
                      type="number"
                      label="Duration of Study? ( Ex Vivo )"
                      name="durationOfStudyExVivo"
                      value={formData.durationOfStudyExVivo?.name}
                      onChange={handleChange}
                      InfoTooltip={
                        <InfoTooltip
                          message="Enter the total time the ex vivo study was 
                                        conducted. This typically refers to the duration the tissue or cells were maintained and 
                                        observed outside the organism, usually measured in hours or days."
                        />
                      }
                      error={validationErrors.durationOfStudyExVivo?.name}
                      unit={formData.UnitOfStudyExVivo}
                      onUnitChange={(newUnit) =>
                        setFormData({ ...formData, UnitOfStudyExVivo: newUnit })
                      }
                      isSpecialAction={isSpecialAction} // Pass isSpecialAction
                      status={formData.durationOfStudyExVivo?.status} // Pass status
                      onStatusChange={handleStatusChange} // Pass status change handler
                    />

                    <CustomCreatableSelect
                      isMulti
                      isCreate={false}
                      label="What was the timing of the treatment? ( Ex Vivo )"
                      options={[
                          "Post-treatment",
                        "Pre-treatment",
                        "Simultaneous",
                      
                      ]}
                      value={formData?.timingTreatmentExVivo}
                      onChange={handleChange}
                      name="timingTreatmentExVivo"
                      isSpecialAction={isSpecialAction}
                      status={
                        Array.isArray(formData?.timingTreatmentExVivo) &&
                        formData.timingTreatmentExVivo.length > 0
                          ? formData.timingTreatmentExVivo[0].status
                          : undefined
                      }
                      onStatusChange={handleStatusChange} // Pass status change handler
                    />
                  </>
                </div>
              )}
            </div>
          )}

          {showOtherInput && (
            <div className="border border-gray-300 rounded-lg shadow-sm mb-4">
              <button
                type="button"
                onClick={() => setIsOtherState((prev) => !prev)}
                className="w-full text-left px-4 py-2 flex justify-between items-center bg-blue-100 rounded-t-lg hover:bg-blue-200 focus:outline-none"
                style={{ color: colorTheme.primary, fontWeight: "bold" }}
              >
                <span>{"Other"}</span>
                <span>{isOtherState ? "-" : "+"}</span>
              </button>

              {isOtherState && (
                <div className=" px-4 py-2">
                  <>
                    <Input
                      label={"Describe Study Type"}
                      value={formData.Other?.name}
                      onChange={handleChange}
                      name="Other"
                      InfoTooltip={
                        <InfoTooltip
                          message="If the study type does not fit into the any of the predefined categories, please describe 
                                                                the study methodology here."
                        />
                      }
                      isSpecialAction={isSpecialAction} // Pass isSpecialAction
                      status={formData.Other?.status} // Pass status
                      onStatusChange={handleStatusChange} // Pass status change handler
                    />
                  </>
                </div>
              )}
            </div>
          )}
        </Accordion>

        <Accordion
          title="Research Focus & Biological Context"
          isOpen={isResearchBio}
          onToggle={() => setIsResearchBio((prev) => !prev)}
        >
          <CustomCreatableSelect
            isMulti
            options={speciesGetting.length > 0 ? speciesGetting.sort((a, b) => a.localeCompare(b)) : []}
            value={formData.species}
            onChange={(selectedOptions) =>
              handleChange(selectedOptions, "species")
            }
            name="species"
            label="Species"
            handleAddSpecies={handleAddSpecies}
            InfoTooltip={
              <InfoTooltip
                message={
                  <span>
                    <strong>Select the species studied in the article.</strong>{" "}
                    <br />
                    <br />
                    If needed, you may specify additional details (e.g., "adult
                    pig"). If the species studied is not listed, please type it
                    in manually. For multiple species, list all that apply
                  </span>
                }
              />
            }
            isSpecialAction={isSpecialAction} // Pass isSpecialAction
            status={
              Array.isArray(formData?.species) && formData.species.length > 0
                ? formData.species[0].status
                : undefined
            }
            onStatusChange={handleStatusChange} // Pass status change handler
          />

          {/* Species More Details */}
          <div className="mb-4">
            {formData?.species?.map((species, index) => {
              // Skip rendering details for "Not Applicable (N/A)" or "N/A" species
              const speciesName = species?.name;
              if (speciesName === "Not Applicable (N/A)" || speciesName === "N/A") {
                return null;
              }
              
              return (
                <div key={index} className="mt-4">
                  <details className="bg-gray-100 p-4 rounded-lg shadow">
                    <summary className="cursor-pointer font-semibold">
                      {species?.name}
                    </summary>
                    {renderSpeciesDetails(species?.name)}
                  </details>
                </div>
              );
            })}
          </div>

          {/* Research Topic - Fetching from get_research_type_data */}
          <CustomCreatableSelect
            isCreate={true}
            label="Research Topic"
            options={
              get_research_type_data?.researchTopics?.map(
                (topic) => topic.name
              ).sort((a, b) => a.localeCompare(b)) || []
            }
            value={formData.researchtopic}
            onChange={handleChange}
            name="researchtopic"
            isMulti
            handleAddSpecies={handleAddResearchTopic}
            InfoTooltip={
              <InfoTooltip
                message={
                 <span>
  <strong>
    Select the primary topic(s) studied in the article.
  </strong>
  <br />
  <br />
  The topic refers to the main subject area the article focuses on (e.g., inflammation, disease studied, redox status, etc.).<br />
  <br />
  If the study investigates mechanisms, select whether it involves a direct or indirect mechanism:
  <ul>
    <li>
      <strong>Direct Mechanism</strong> – The study examines hydrogen's direct interaction with specific biological targets such as enzymes, proteins, or cell membranes.
    </li>
    <li>
      <strong>Indirect Mechanism</strong> – The study investigates hydrogen's effects through secondary approaches like gene-knockout studies, iRNA, or pharmacological inhibition to infer the mechanism.
    </li>
  </ul>
</span>
                }
              />
            }
            isSpecialAction={isSpecialAction} // Pass isSpecialAction
            status={
              Array.isArray(formData?.researchtopic) &&
              formData.researchtopic.length > 0
                ? formData.researchtopic[0].status
                : undefined
            }
            onStatusChange={handleStatusChange} // Pass status change handler
          />

          <CustomCreatableSelect
            isMulti
            isCreate={true}
            label="Disease Model"
            options={
              get_disease_data?.diseases?.map((disease) => disease.name).sort((a, b) => a.localeCompare(b)) || []
            }
            value={formData.diseaseModel}
            onChange={handleChange}
            name="diseaseModel"
            handleAddSpecies={handleAddDisease}
            InfoTooltip={
              <InfoTooltip message="Select or enter the specific disease model(s) used in the study." />
            }
            isSpecialAction={isSpecialAction}
            status={
              Array.isArray(formData?.diseaseModel) &&
              formData.diseaseModel.length > 0
                ? formData.diseaseModel[0].status
                : undefined
            }
            onStatusChange={handleStatusChange}
          />

          <CustomCreatableSelect
            isMulti
            isCreate={true}
            label="Physiological Systems"
            options={
              get_systems_data?.systems?.map((system) => system.name).sort((a, b) => a.localeCompare(b)) || []
            }
            value={formData.system}
            onChange={handleChange}
            name="system"
            handleAddSpecies={handleAddSystem}
            InfoTooltip={
              <InfoTooltip
                message={
                  <span>
                    <strong>
                      Select the physiological system(s) studied in the article.
                    </strong>
                  </span>
                }
              />
            }
            isSpecialAction={isSpecialAction} // Pass isSpecialAction
            status={
              Array.isArray(formData?.system) && formData.system.length > 0
                ? formData.system[0].status
                : undefined
            }
            onStatusChange={handleStatusChange} // Pass status change handler
          />

          {/* Organs/Tissues - Fetching from get_organs_data */}
          <CustomCreatableSelect
            isCreate={true}
            label="Organs/Tissues"
            options={get_organs_data?.organs?.map((organ) => organ.name).sort((a, b) => a.localeCompare(b)) || []}
            value={formData.organ}
            onChange={handleChange}
            name="organ"
            isMulti
            handleAddSpecies={handleAddOrgan}
            InfoTooltip={
              <InfoTooltip
                message={
                  <span>
                    <strong>
                      Please select the specific organ(s) or tissue(s) studied
                      in the article.
                    </strong>
                  </span>
                }
              />
            }
            isSpecialAction={isSpecialAction} // Pass isSpecialAction
            status={
              Array.isArray(formData?.organ) && formData.organ.length > 0
                ? formData.organ[0].status
                : undefined
            }
            onStatusChange={handleStatusChange} // Pass status change handler
          />
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
                    Some fields are missing. Are you sure you want to proceed
                    without filling them?
                  </p>
                </div>

                {/* List Missing Fields */}
                {missingFields.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Missing fields:
                    </h3>
                    <div className="bg-gray-50 rounded-md p-3">
                      <ul className="space-y-1">
                        {missingFields.map((field, index) => (
                          <li
                            key={index}
                            className="flex items-start text-gray-600 text-sm"
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
                              {fieldNameMappings[field] ||
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

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleDraftSave}
            style={{ backgroundColor: colorTheme.primary }}
            className="text-white py-2 px-4 rounded hover:bg-blue-700 mr-2"
          >
            {add_article_status === asyncStatus.LOADING
              ? "Loading..."
              : "Save as Draft"}
          </button>
          <button
            type="button"
            onClick={onBack}
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
            {/* {
                            showNonExperimental ? "Submit" : "Next"
                        } */}
            {/* {BothTrueState ? "Submit" : "Next"} */}
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleGeneralData;
