import React, { useEffect, useMemo, useRef, useState } from "react";
import MhidImage from "../../assets/icons/mhid.png";
import PmidImage from "../../assets/icons/pmid.png";
import { useNavigate, useParams } from "react-router-dom";
import { FaCopy, FaDownload, FaEye, FaFacebook, FaFileImage, FaInfoCircle, FaLink, FaLinkedin, FaQuoteLeft, FaShareAlt, FaStar, FaTwitter } from "react-icons/fa";
import FirstImage from "../../assets/icons/01.png";
import SecondImage from "../../assets/icons/02.png";
import ThirdImage from "../../assets/icons/03.png";
import ForthImage from "../../assets/icons/04.png";
import FiveImage from "../../assets/icons/05.png";
import SixImage from "../../assets/icons/06.png";
import { Oval } from "react-loader-spinner";
import { CloseOutlined, FeedbackOutlined, FireExtinguisher } from "@mui/icons-material";
import { error_toast_message, success_toast_message } from "../../Utils/toast_message";
import { apiHandle } from "../../Config/ApiHandle/apiHandle";
import { MdFeedback } from 'react-icons/md';
import { citationFormats, generateXML } from "../../Utils/citationFormats";

const GeographicInfo = ({ country, setIsModalFeedBackOpen }) => {
  // Get all unique country names from all three sources
  const allCountries = useMemo(() => {
    const countryNames = new Set();

    // Add Author Countries
    country?.AuthorCountry?.forEach((elem) => {
      if (elem?.name) countryNames.add(elem.name);
    });

    // Add Grant Country
    if (country?.GrantCountry?.name) {
      countryNames.add(country.GrantCountry.name);
    }

    // Add Research Countries
    country?.ResearchCountry?.forEach((elem) => {
      if (elem?.name) countryNames.add(elem.name);
    });

    return Array.from(countryNames);
  }, [country]);

  const hasGeoInfo =
    (country?.AuthorCountry?.length ?? 0) > 0 ||
    Boolean(country?.GrantCountry?.name) ||
    (country?.ResearchCountry?.length ?? 0) > 0;

  return (
    <>
      {hasGeoInfo && (
        <div className="w-full mt-16">
          {/* Heading */}
          <div className="flex items-center gap-2 text-black font-bold text-xl mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M17.9 17.39C17.64 16.59 16.89 16 16 16H15V13C15 12.7348 14.8946 12.4804 14.7071 12.2929C14.5196 12.1054 14.2652 12 14 12H8V10H10C10.2652 10 10.5196 9.89464 10.7071 9.70711C10.8946 9.51957 11 9.26522 11 9V7H13C13.5304 7 14.0391 6.78929 14.4142 6.41421C14.7893 6.03914 15 5.53043 15 5V4.59C16.1965 5.07237 17.2582 5.83747 18.0944 6.81983C18.9306 7.8022 19.5163 8.97255 19.8013 10.2307C20.0864 11.4889 20.0623 12.7974 19.7312 14.0442C19.4001 15.291 18.7717 16.4391 17.9 17.39ZM11 19.93C7.05 19.44 4 16.08 4 12C4 11.38 4.08 10.78 4.21 10.21L9 15V16C9 16.5304 9.21071 17.0391 9.58579 17.4142C9.96086 17.7893 10.4696 18 11 18M12 2C10.6868 2 9.38642 2.25866 8.17317 2.7612C6.95991 3.26375 5.85752 4.00035 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 14.6522 3.05357 17.1957 4.92893 19.0711C5.85752 19.9997 6.95991 20.7362 8.17317 21.2388C9.38642 21.7413 10.6868 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2Z"
                fill="black"
              />
            </svg>
            <span>Geographic Information</span>
          </div>

          {/* Country buttons - display below the heading */}
          {(() => {
            // Collect country names from all sources
            const authorCountries =
              country?.AuthorCountry?.map((c) => c.name) || [];
            const grantCountries =
              country?.GrantCountry?.name !== "N/A"
                ? [country?.GrantCountry?.name]
                : [];
            const researchCountries =
              country?.ResearchCountry?.map((c) => c.name) || [];

            // Combine all countries and remove duplicates
            const allUniqueCountries = [
              ...new Set([
                ...authorCountries,
                ...grantCountries,
                ...researchCountries,
              ]),
            ];

            // Remove "N/A" if it exists
            const filteredCountries = allUniqueCountries.filter(
              (name) => name && name !== "N/A"
            );

            return filteredCountries.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-4">
                {filteredCountries.map((countryName, index) => (
                  <button
                    key={index}
                    className="py-2 px-4 bg-[#346896] text-white rounded-full text-sm font-medium cursor-context-menu"
                  >
                    {countryName}
                  </button>
                ))}
              </div>
            ) : null;
          })()}

          {/* Table Container */}
          <div className="grid grid-flow-col text-start p-2">
            <table className="w-full text-left">
              <tbody>
                {country?.AuthorCountry?.length > 0 && (
                  <tr className="border-b">
                    <td className="font-bold text-[14px] p-2 border-r min-w-[150px] md:w-[200px]">
                      Author Country
                    </td>
                    <td className="text-[#767676] text-[15px] p-2">
                      {country?.AuthorCountry?.map((elem) => elem?.name).join(
                        ", "
                      )}
                    </td>
                  </tr>
                )}

                {country?.GrantCountry?.name && (
                  <tr className="border-b">
                    <td className="font-bold text-[14px] p-2 border-r min-w-[150px] md:w-[200px]">
                      Grant Country
                    </td>
                    <td className="text-[#767676] text-[15px] p-2">
                      {country?.GrantCountry?.name}
                    </td>
                  </tr>
                )}

                {country?.ResearchCountry?.length > 0 && (
                  <tr>
                    <td className="font-bold text-[14px] p-2 border-r min-w-[150px] md:w-[200px]">
                      Research Country
                    </td>
                    <td className="text-[#767676] text-[15px] p-2">
                      {country?.ResearchCountry?.map((elem) => elem?.name).join(
                        ", "
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

const Modal = ({ onClose, children }) => {
    return (
        <div  className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div  className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
                <button
                     className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                    onClick={onClose}
                >
                    <CloseOutlined size={24} />
                </button>
                {children}
            </div>
        </div>
    );
};


function StudyDetails({ articleGeneralData, setIsModalFeedBackOpen }) {
  // State for active tab - will be set to the first tab that has data
  const [activeTab, setActiveTab] = useState("");

  // Check if a study type has details
  const hasDetails = (studyType) => {
    switch (studyType.toLowerCase()) {
      case "in vivo":
        return (
          articleGeneralData?.inVivo?.length > 0 ||
          articleGeneralData?.durationOfStudy?.name
        );

      case "in vitro":
        return (
          articleGeneralData?.WhatKindCell?.name ||
          articleGeneralData?.durationOfStudyinVitro?.name
        );

      case "ex vivo":
        return (
          articleGeneralData?.WhatCellTissueUsed?.name ||
          articleGeneralData?.durationOfStudyExVivo?.name
        );

      case "non-experimental":
      case "non-experimental (review)":
        return (
          articleGeneralData?.ReviewStudyType?.name ||
          articleGeneralData?.OpinionPiece?.name ||
          articleGeneralData?.Hypothesis?.name ||
          articleGeneralData?.TherapeuticDeliverySystems?.name
        );

      case "other":
        return articleGeneralData?.Other?.name;

      default:
        return false;
    }
  };

  // List of disabled study types
  const disabledStudyTypes = new Set([
    "Chemical/Physicochemical Study",
    "In Silico",
  ]);

  // Filter study types to only those with data and not disabled
  const validStudyTypes = useMemo(() => {
    return (
      articleGeneralData?.studyType
        ?.filter(
          (st) => !disabledStudyTypes.has(st.name) && hasDetails(st.name)
        )
        .map((st) => st.name) || []
    );
  }, [articleGeneralData]);

  // Set active tab when data loads - use the first valid study type
  useEffect(() => {
    if (validStudyTypes.length > 0) {
      setActiveTab(validStudyTypes[0]);
    } else {
      setActiveTab("");
    }
  }, [validStudyTypes]);

  // Get details based on active tab
  const getCurrentDetails = () => {
    switch (activeTab.toLowerCase()) {
      case "in vivo":
        const vivoDetails = [];
        const hasHuman = articleGeneralData?.inVivo?.some(
          (item) => item.name === "Human Study"
        );
        const hasAnimal = articleGeneralData?.inVivo?.some(
          (item) => item.name === "Animal Study"
        );

        if (hasHuman) {
          if (articleGeneralData?.clinicalTrialDesign?.length) {
            vivoDetails.push({
              label: "Clinical Trial Design",
              value: articleGeneralData?.clinicalTrialDesign?.join(", "),
            });
          }

          if (articleGeneralData?.observationalStudy?.length) {
            vivoDetails.push({
              label: "Observational Study",
              value: articleGeneralData?.observationalStudy?.join(", "),
            });
          }
        }

        console.log('articleGeneralData?.studyDurationUnit',articleGeneralData?.studyDurationUnit);
        if (articleGeneralData?.durationOfStudy?.name) {
          vivoDetails.push({
            label: "Duration of Study",
            value: `${articleGeneralData?.durationOfStudy?.name} ${
              articleGeneralData?.studyDurationUnit?.name ?? "hours"
            }`,
          });
        }

        return {
          title: hasHuman ? "Human" : "Animal",
          details: vivoDetails,
        };

      case "in vitro":
        const vitroDetails = [];

        if (articleGeneralData?.WhatKindCell?.name) {
          vitroDetails.push({
            label: "Cell Type",
            value: articleGeneralData?.WhatKindCell?.name,
          });
        }

        if (articleGeneralData?.durationOfStudyinVitro?.name) {
          vitroDetails.push({
            label: "Duration",
            value: `${articleGeneralData?.durationOfStudyinVitro?.name} ${
              articleGeneralData?.studyDurationUnit ?? "hour"
            }`,
          });
        }

        return {
          title: "In Vitro",
          details: vitroDetails,
        };

      case "ex vivo":
        const exVivoDetails = [];

        if (articleGeneralData?.WhatCellTissueUsed?.name) {
          exVivoDetails.push({
            label: "Cell/Tissue",
            value: articleGeneralData?.WhatCellTissueUsed?.name,
          });
        }

        if (articleGeneralData?.durationOfStudyExVivo?.name) {
          exVivoDetails.push({
            label: "Duration",
            value: `${articleGeneralData?.durationOfStudyExVivo?.name} ${
              articleGeneralData?.UnitOfStudyExVivo ?? ""
            }`,
          });
        }

        return {
          title: "Ex Vivo",
          details: exVivoDetails,
        };

      case "non-experimental":
      case "non-experimental (review)":
        const nonExpDetails = [];

        if (articleGeneralData?.ReviewStudyType?.name) {
          nonExpDetails.push({
            label: "Review Type",
            value: articleGeneralData?.ReviewStudyType?.name,
          });
        }

        if (articleGeneralData?.OpinionPiece?.name) {
          nonExpDetails.push({
            label: "Opinion Piece",
            value: articleGeneralData?.OpinionPiece?.name,
          });
        }

        if (articleGeneralData?.Hypothesis?.name) {
          nonExpDetails.push({
            label: "Hypothesis",
            value: articleGeneralData?.Hypothesis?.name,
          });
        }

        if (articleGeneralData?.TherapeuticDeliverySystems?.name) {
          nonExpDetails.push({
            label: "Therapeutic Delivery Systems",
            value: articleGeneralData?.TherapeuticDeliverySystems?.name,
          });
        }

        return {
          title: "Non Experimental",
          details: nonExpDetails,
        };

      case "other":
        const otherDetails = [];

        if (articleGeneralData?.Other?.name) {
          otherDetails.push({
            label: "Other",
            value: articleGeneralData?.Other?.name,
          });
        }

        return {
          title: "Other",
          details: otherDetails,
        };

      default:
        return { title: activeTab, details: [] };
    }
  };

  const currentStudy = getCurrentDetails();

  // Don't render anything if there are no valid study types
  if (validStudyTypes.length === 0) {
    return null;
  }

  return (
    <div className="w-full mt-16">
      {/* Heading */}
      <div className="flex items-center gap-2 text-black font-bold text-xl mb-4">
        <img src={FirstImage} alt="Study" />
        <span>Study Details</span>
      </div>

      <div className="w-full flex mt-8 items-center">
        {/* Tabs - Only show tabs that have data */}
        <div className="w-40">
          <div className="flex flex-col gap-2">
            {validStudyTypes.map((name) => (
              <button
                key={name}
                onClick={() => setActiveTab(name)}
                className={`px-1 py-1 text-[15px] text-center rounded-full border w-full 
                ${
                  activeTab === name
                    ? "bg-[#346896] text-white"
                    : "border-[#346896] text-[#346896]"
                }
                truncate`}
                title={name} // Show full name on hover
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Content - Only show if the current tab has details */}
        {currentStudy.details.length > 0 && (
          <div className="pl-4 flex-1">
            <div className="border-l">
              <h3 className="text-3xl font-bold pl-2 pb-2 text-[#346896]">
                {currentStudy.title}
              </h3>

              <div className="grid grid-flow-col text-start">
                <table className="w-full text-left">
                  <tbody>
                    {currentStudy.details.map((row, index) => (
                      <tr
                        key={index}
                        className={
                          index === currentStudy.details.length - 1
                            ? ""
                            : "border-b"
                        }
                      >
                        <td className="font-bold text-[14px] p-2 border-r min-w-[150px] md:w-[200px]">
                          {row.label}
                        </td>
                        <td className="text-[#767676] text-[15px] p-2">
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ResearchDetails({ articleGeneralData, setIsModalFeedBackOpen }) {
  // Helper function to extract values from nested objects
  const getValue = (valueObj) => {
    if (!valueObj) return "";

    if (typeof valueObj === "object") {
      if (valueObj.name !== undefined) return valueObj.name;
      if (valueObj.value !== undefined) return valueObj.value;
      return "";
    }

    return valueObj;
  };

  // Helper function to get consistent weight data (same as HydrogenAdministration)
  const getSpeciesWeight = (speciesName, speciesData) => {
    if (speciesData?.averageWeight) {
      const weightValue = getValue(speciesData.averageWeight);
      let weightUnit = getValue(speciesData.averageWeight.unit) || 
                       getValue(speciesData.weightUnit);
      
      // If no unit is found, use kg for humans and g for all other species
      if (!weightUnit || weightUnit === "") {
        if (speciesName.toLowerCase().includes("human")) {
          weightUnit = "kg";
        } else {
          weightUnit = "g";
        }
      }
      
      // Convert "kilograms" to "kg" for display consistency, keep "g" as is
      const displayUnit = weightUnit === "kilograms" ? "kg" : weightUnit;
      
      if (weightValue && weightValue !== "" && weightValue !== "0") {
        return `${weightValue} ${displayUnit}`;
      }
    }
    return "";
  };

  // Check if a species has data
  const hasSpeciesData = (speciesName) => {
    const speciesData = articleGeneralData?.speciesDetails?.[speciesName] || {};

    // Check if any of these fields have data
    return !!(
      getValue(speciesData?.DescribeSpecies) ||
      getValue(speciesData?.subjects) ||
      getValue(speciesData?.health) ||
      getValue(speciesData?.gender) ||
      getValue(speciesData?.averageAge) ||
      getValue(speciesData?.averageWeight)
    );
  };

  // Filter species that have data
  const validSpecies = useMemo(() => {
    return (
      articleGeneralData?.species?.filter((species) =>
        hasSpeciesData(species.name)
      ) || []
    );
  }, [articleGeneralData?.species, articleGeneralData?.speciesDetails]);

  // Set the active tab to the first valid species
  const [activeTab, setActiveTab] = useState("");

  // Update active tab when data loads
  useEffect(() => {
    if (validSpecies.length > 0) {
      setActiveTab(validSpecies[0].name);
    } else {
      setActiveTab("");
    }
  }, [validSpecies]);

  // Get species data for the active tab
  const getSpeciesData = () => {
    return articleGeneralData?.speciesDetails?.[activeTab] || {};
  };

  // Format details for the active tab
  const formatDetails = () => {
    const speciesData = getSpeciesData();

    // Create the list of fields
    const details = [
      { label: "Description", value: getValue(speciesData?.DescribeSpecies) },
      { label: "n", value: getValue(speciesData?.subjects) },
      { label: "Health", value: getValue(speciesData?.health) },
      { label: "Gender", value: getValue(speciesData?.gender) },
    ];

    // Only add age if it has a value
    if (getValue(speciesData?.averageAge)) {
      details.push({
        label: "Average Age",
        value: `${getValue(speciesData?.averageAge)} ${
          getValue(speciesData?.ageUnit) || "year"
        }`,
      });
    }

    // Only add weight if it has a value - use the same logic as HydrogenAdministration
    const weightDisplay = getSpeciesWeight(activeTab, speciesData);
    if (weightDisplay) {
      details.push({
        label: "Average Weight",
        value: weightDisplay,
      });
    }

    // Filter out empty values
    return details.filter(
      (item) => item.value && item.value !== "N/A" && item.value !== ""
    );
  };

  // Format additional data (research topics, disease model, etc.)
  const formatAdditionalData = () => {
    const additionalData = [
      {
        label: "Research Topics",
        value:
          articleGeneralData?.researchtopic?.map((t) => t.name).join(", ") ||
          "",
      },
      {
        label: "Disease Model Studied",
        value: getValue(articleGeneralData?.diseaseModel),
      },
      {
        label: "Physiological Systems",
        value: articleGeneralData?.system?.map((s) => s.name).join(", ") || "",
      },
      {
        label: "Organs/Tissues",
        value: articleGeneralData?.organ?.map((o) => o.name).join(", ") || "",
      },
    ];

    // Filter out empty values
    return additionalData.filter(
      (item) => item.value && item.value !== "N/A" && item.value !== ""
    );
  };

  const hasAdditionalData = formatAdditionalData().length > 0;
  const formattedDetails = formatDetails();
  const hasSpeciesDetails = formattedDetails.length > 0;

  // Don't render anything if there's no data to show
  if (!hasAdditionalData && validSpecies.length === 0) {
    return null;
  }

  return (
    <div className="w-full mt-16">
      {/* Heading */}
      <div className="flex items-center gap-2 text-black font-bold text-xl mb-4">
        <img src={SecondImage} alt="SecondImage" />
        <span>Research Focus & Biological Context</span>
      </div>

      {validSpecies.length > 0 ? (
        <div className="w-full flex mt-8 items-start">
          {/* Left Sidebar Tabs - Only show valid species */}
          <div className="w-40">
            <div className="flex flex-col gap-2">
              {validSpecies.map((species) => (
                <button
                  key={species.name}
                  onClick={() => setActiveTab(species.name)}
                  className={`px-1 py-1 text-[15px] text-center rounded-full border w-full ${
                    activeTab === species.name
                      ? "bg-[#346896] text-white"
                      : "border-[#346896] text-[#346896]"
                  } ${
                    validSpecies.length > 1
                      ? "cursor-pointer"
                      : "cursor-context-menu"
                  }`}
                >
                  {species.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right Content Table */}
          <div className="pl-4 flex-1">
            <div className="border-l">
              <div>
                {/* Only render the table if there are details to show */}
                {hasSpeciesDetails && (
                  <table className="w-full text-left">
                    <tbody>
                      {formattedDetails.map((row, index, arr) => (
                        <tr
                          key={index}
                          className={index === arr.length - 1 ? "" : "border-b"}
                        >
                          <td className="font-bold text-[14px] p-2 border-r min-w-[150px] md:w-[200px]">
                            {row.label}
                          </td>
                          <td className="text-[#767676] text-[15px] p-2">
                            {row.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="w-full flex mt-0 items-start">
        {/* Left Sidebar Tabs - Only show valid species */}
        <div className="w-40">
          <div className="flex flex-col gap-2">
            {hasAdditionalData && (
              <button
                className={`px-1 py-1 text-[15px] cursor-context-menu text-center rounded-full border w-full  bg-[#346896] text-white`}
              >
                Context
              </button>
            )}
          </div>
        </div>
        <div className="pl-4 flex-1">
          {/* Additional data is always shown if it exists */}
          {hasAdditionalData && (
            <table className="w-full text-left">
              <tbody>
                {formatAdditionalData().map((row, index) => (
                  <tr
                    key={index}
                    className="w-full p-4 border-l-2 border-[#346896] bg-gradient-to-r from-[#3468961A] to-transparent"
                  >
                    <td className="font-bold text-[14px] text-[#346896] p-2 border-r min-w-[150px] md:w-[200px]">
                      {row.label}
                    </td>
                    <td className="text-[#585858] text-[15px] p-2">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function ComparativeInformation({ researcherData, setIsModalFeedBackOpen }) {
  return (
    <div className="w-full mt-16">
      {/* Heading */}
      {(researcherData?.CompMethodAdminDesc?.name ||
        researcherData?.doseComparisonDesc?.name) && (
        <>
          <div className="flex items-center gap-2 text-black font-bold text-xl mb-4">
            <img src={ThirdImage} alt="ThirdImage" />
            <span>Comparative information</span>
          </div>
          <div className="pl-6 mt-8">
            {researcherData?.CompMethodAdminDesc?.name && (
              <div className="mt-4">
                <h4 className="font-semibold mb-4">
                  Comparison of Methods of Administration
                </h4>
                {researcherData?.CompMethodAdminDesc?.name && (
                  <p className="text-[#346896] w-full p-4 border-l-2 border-[#346896] bg-gradient-to-r from-[#3468961A] to-transparent">
                    {researcherData?.CompMethodAdminDesc?.name}
                  </p>
                )}
              </div>
            )}

            {researcherData?.doseComparisonDesc?.name && (
              <div className="mt-4">
                <h4 className="font-semibold mb-4">
                  Dose/Concentration Comparison
                </h4>
                {researcherData?.doseComparisonDesc?.name && (
                  <p className="text-[#346896] w-full p-4 border-l-2 border-[#346896] bg-gradient-to-r from-[#3468961A] to-transparent">
                    {researcherData?.doseComparisonDesc?.name}
                  </p>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function HydrogenAdministration({ researcherData, articleGeneralData, setIsModalFeedBackOpen }) {
  // Check if speciesData exists and has species (it's an object, not an array)
  const hasSpeciesData = Boolean(
    researcherData?.speciesData && 
    typeof researcherData.speciesData === 'object' && 
    Object.keys(researcherData.speciesData).length > 0
  );
  
  // Helper function to get consistent weight data from articleGeneralData (same as ResearchDetails)
  const getSpeciesWeight = (speciesName) => {
    const speciesData = articleGeneralData?.speciesDetails?.[speciesName];
    if (speciesData?.averageWeight) {
      // Use the same getValue logic as ResearchDetails component
      const getValueForWeight = (valueObj) => {
        if (!valueObj) return "";
        if (typeof valueObj === "object") {
          if (valueObj.name !== undefined) return valueObj.name;
          if (valueObj.value !== undefined) return valueObj.value;
          return "";
        }
        return valueObj;
      };
      
      const weightValue = getValueForWeight(speciesData.averageWeight);
      let weightUnit = getValueForWeight(speciesData.averageWeight.unit) || 
                       getValueForWeight(speciesData.weightUnit);
      
      // If no unit is found, use kg for humans and g for all other species
      if (!weightUnit || weightUnit === "") {
        if (speciesName.toLowerCase().includes("human")) {
          weightUnit = "kg";
        } else {
          weightUnit = "g";
        }
      }
      
      // Convert "kilograms" to "kg" for display consistency, keep "g" as is
      const displayUnit = weightUnit === "kilograms" ? "kg" : weightUnit;
      
      if (weightValue && weightValue !== "" && weightValue !== "0") {
        return { value: weightValue, unit: displayUnit };
      }
    }
    
    // Default weights: 75kg for humans, 75g for other species
    return {
      value: speciesName.toLowerCase().includes("human") ? "75" : "75",
      unit: speciesName.toLowerCase().includes("human") ? "kg" : "g"
    };
  };
  
  const normalizedData = hasSpeciesData
    ? researcherData
    : { speciesData: { General: researcherData } };

  const [activeTab, setActiveTab] = useState(
    Object.keys(normalizedData?.speciesData || {})[0] || ""
  );
  const [selectedMethod, setSelectedMethod] = useState("");

  console.log("researcherData", researcherData);

  const speciesData = normalizedData?.speciesData?.[activeTab] || {};

  // Enhanced method extraction for both species and non-species cases
  const methods = [
    ...(speciesData?.methods || []),
    ...(speciesData?.methodOfAdmin?.map((m) => m.name) || []),
    // For non-species data, also check direct methodOfAdmin in researcherData
    ...(hasSpeciesData ? [] : (researcherData?.methodOfAdmin?.map((m) => m.name) || [])),
  ].filter((v, i, a) => a.indexOf(v) === i);

  console.log("methods", methods);
  console.log("hasSpeciesData", hasSpeciesData);
  console.log("speciesData?.methods", speciesData?.methods);
  console.log("researcherData?.methodOfAdmin", researcherData?.methodOfAdmin);

  useEffect(() => {
    if (methods.length > 0 && !methods.includes(selectedMethod)) {
      setSelectedMethod(methods[0]);
    }
  }, [activeTab, methods]);

  const getNestedValue = (obj, keys) =>
    keys.reduce((acc, key) => (acc && acc[key] ? acc[key] : null), obj);

  const getValue = (obj) => {
    if (!obj) return "N/A";
    if (typeof obj === "string") return obj;
    return (
      obj.name || obj.value || getNestedValue(obj, ["value", "name"]) || "N/A"
    );
  };

  // const getUnit = (obj) => {
  //     if (!obj) return "";
  //     if (typeof obj === 'string') return obj;
  //     return obj.unit || getNestedValue(obj, ['unit', 'name']) || "";
  // };
  const getUnit = (obj) => {
    if (!obj) return "";

    // grab raw unit (either a string or obj.unit/name)
    let unit =
      typeof obj === "string"
        ? obj
        : obj.unit || getNestedValue(obj, ["unit", "name"]) || "";

    // normalize and map "Hr" → "hour"
    if (unit.toLowerCase() === "hr") {
      return "hour";
    }

    return unit;
  };
 // Helper function to convert concentration to mg/L
  const convertToMgPerL = (val, unit) => {
    const numVal = parseFloat(val) || 0;
    const conversions = {
      mM: numVal * 2,
      ppm: numVal,
      ppb: numVal / 1000,
      µM: numVal * 0.002,
      'mg/L': numVal,
      default: numVal
    };
    return conversions[unit] || conversions.default;
  };

  // Helper function to convert volume to liters
  const convertToLiters = (val, unit) => {
    const numVal = parseFloat(val) || 0;
    const conversions = {
      mL: numVal / 1000,
      L: numVal,
      µL: numVal / 1000000,
      default: numVal
    };
    return conversions[unit] || conversions.default;
  };

  // Helper function to convert weight to kg
  const convertToKg = (val, unit) => {
    const numVal = parseFloat(val) || 0;
    const conversions = {
      g: numVal / 1000,
      kg: numVal,
      Lbs: numVal * 0.453592,
      kilograms: numVal,
      default: numVal
    };
    return conversions[unit] || conversions.default;
  };
  // Enhanced concentration data extraction for both species and non-species cases
   // Enhanced concentration data extraction with dose calculations
  const getConcentrationData = () => {

    console.log("speciesData in getConcentrationData", speciesData);
    const volumes = speciesData?.volumes || (hasSpeciesData ? [] : researcherData?.volumes || []);
    const concentrations = speciesData?.concentrations || (hasSpeciesData ? [] : researcherData?.concentrations || []);
    const absoluteDoses = speciesData?.absoluteDoses || (hasSpeciesData ? [] : researcherData?.absoluteDoses || []);
    const relativeDoses = speciesData?.relativeDoses || (hasSpeciesData ? [] : researcherData?.relativeDoses || []);
    
    // Get weight data
    const weightData = speciesData?.weight || speciesData?.bodyWeight || (hasSpeciesData ? null : researcherData?.bodyWeight);
    const weightValue = getValue(weightData);
    const weightUnit = getUnit(weightData?.unit) || 'kg';
    const weightInKg = convertToKg(weightValue, weightUnit);

    
    
    console.log("volumes", volumes);
    return volumes?.map((volume, index) => {
      const volumeValue = getValue(volume.value || volume);
      const volumeUnit = getUnit(volume.unit?.name || volume.unit) || 'mL';
      const volumeInL = convertToLiters(volumeValue, volumeUnit);
      
      const concentrationValue = getValue(concentrations?.[index]?.value);
      const concentrationUnit = getUnit(concentrations?.[index]?.unit?.name || concentrations?.[index]?.unit) || 'mg/L';
      const concentrationInMgL = convertToMgPerL(concentrationValue, concentrationUnit);
      
      // Calculate absolute dose: volume (L) × concentration (mg/L) = mg/day
      const calculatedAbsoluteDose = volumeInL * concentrationInMgL;
      
      // Calculate relative dose: absolute dose (mg/day) / weight (kg) = mg/kg/day
      const calculatedRelativeDose = weightInKg > 0 ? calculatedAbsoluteDose / weightInKg : 0;
      
      // Use calculated values if stored values are empty or invalid
      const absoluteDoseValue = 
                               (calculatedAbsoluteDose > 0 ? calculatedAbsoluteDose.toFixed(2) : "-");
      const relativeDoseValue =  
                               (calculatedRelativeDose > 0 ? calculatedRelativeDose.toFixed(2) : "-");
      
      return {
        label: `Concentration ${index + 1}`,
        details: {
          volume: `${volumeValue || "-"} ${volumeUnit}`,
          concentration: `${concentrationValue || "-"} ${concentrationUnit}`,
          absoluteDose: `${absoluteDoseValue} ${absoluteDoseValue !== "-" ? "mg/day" : ""}`,
          relativeDose: `${relativeDoseValue} ${relativeDoseValue !== "-" ? "mg/kg/day" : ""}`,
        },
      };
    });
  };

  const concentrationData = getConcentrationData();

  const getWeight = () =>
    getValue(speciesData.weight || speciesData.bodyWeight) || "N/A";

  return (
    <>
      {methods?.length > 0 && (
        <div className="w-full mt-16">
          <div className="flex items-center gap-2 text-black font-bold text-xl mb-4">
            <img src={ForthImage} alt="ForthImage" />
            <span>Hydrogen Administration Details</span>
          </div>

           {Object.keys(normalizedData.speciesData).length > 0 && (
            <div className="flex gap-4 mb-4 border-b flex-wrap">
              {Object.keys(normalizedData.speciesData)
                .filter((species) => species !== "N/A" && !species.includes("N/A"))
                .map((species) => (
                <button
                  key={species}
                  onClick={() => setActiveTab(species)}
                  className={`px-4 text-start py-2 text-[15px] border-b-2 ${
                    activeTab === species
                      ? "border-[#346896]"
                      : "border-transparent text-gray-500"
                  }`}
                >
                  Method of Administration for {species} <br />
                  <span
                    className={`${
                      activeTab === species
                        ? "text-[#346896] font-bold"
                        : "text-gray-500"
                    }`}
                  >
                    {species} (
                    {(() => {
                      const weightData = getSpeciesWeight(species);
                      return `${weightData.value} ${weightData.unit}`;
                    })()}
                    )
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="space-y-6">
            <div className="mb-6">
              <p className="text-[#132B38] text-sm font-extrabold mb-3">
                Administration Methods
              </p>
              {/* Tabs */}
              <div className="flex flex-wrap gap-2">
                {methods
                  .filter(
                    (m) =>
                      ![
                        "Ingestion of H2-producing bacteria",
                        // "Hydrogen-rich Saline",
                        "Subcutaneous injection of hydrogen",
                      ].includes(m)
                  )
                  .map((method) => (
                    <button
                      key={method}
                      onClick={() => setSelectedMethod(method)}
                      className={`px-4 py-2 rounded-full text-sm ${
                        selectedMethod === method
                          ? "bg-[#346896] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {method}
                    </button>
                  ))}

                {methods
                  .filter((m) =>
                    [
                      "Ingestion of H2-producing bacteria",
                      // "Hydrogen-rich Saline",
                      "Subcutaneous injection of hydrogen",
                    ].includes(m)
                  )
                  .map((method) => (
                    <button
                      key={method}
                      className="px-4 py-2 rounded-full text-sm bg-gray-200 text-gray-500 cursor-not-allowed"
                      disabled
                    >
                      {method}
                    </button>
                  ))}
              </div>
            </div>

            {/* Renders */}
            {selectedMethod && (
              <div className="space-y-8">
                {/* Gavage / Oral Hydrogen Water */}
                {(selectedMethod === "Oral Hydrogen Water" ||
                  selectedMethod === "Gavage" ||
                  selectedMethod === "Hydrogen-rich Saline") && (
                  <div className="bg-white rounded-lg shadow-md">
                    {/* NEW: Display from methodsData if available */}
                    {speciesData?.methodsData?.[selectedMethod]?.length > 0 ? (
                      <>
                        <div className="bg-[#346896] text-white px-4 py-2 rounded-t-lg">
                          <h3 className="font-semibold">
                            {selectedMethod} Concentration Details
                          </h3>
                        </div>
                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {speciesData.methodsData[selectedMethod].map((concData, index) => (
                              <div
                                key={index}
                                className="bg-gray-50 rounded-xl p-5 shadow-sm border border-gray-200 hover:border-[#346896] transition-colors"
                              >
                                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                                  <h4 className="text-lg font-semibold text-[#346896]">
                                    Concentration #{index + 1}
                                  </h4>
                                </div>
                                <div className="space-y-4">
                                  {concData?.volume && (
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-600 font-medium">Volume</span>
                                      <span className="text-gray-800 font-medium">
                                        {concData.volume.value} {concData.volume.unit || "mL"}
                                      </span>
                                    </div>
                                  )}
                                  {concData?.concentration && (
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-600 font-medium">Concentration</span>
                                      <span className="text-gray-800 font-medium">
                                        {concData.concentration.value} {concData.concentration.unit || "mg/L"}
                                      </span>
                                    </div>
                                  )}
                                  {concData?.absoluteDose && (
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-600 font-medium">Absolute Dose</span>
                                      <span className="text-gray-800 font-medium">
                                        {concData.absoluteDose.value} {concData.absoluteDose.unit || "mg/day"}
                                      </span>
                                    </div>
                                  )}
                                  {concData?.relativeDose && (
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-600 font-medium">Relative Dose</span>
                                      <span className="text-gray-800 font-medium">
                                        {concData.relativeDose.value} {concData.relativeDose.unit || "mg/kg/day"}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : concentrationData?.length > 0 ? (
                      /* Fallback to old concentrationData display */
                      <>
                        <div className="bg-[#346896] text-white px-4 py-2 rounded-t-lg">
                          <h3 className="font-semibold">
                            Concentration Details
                          </h3>
                        </div>
                        <div className="p-4 ">
                          <table className="w-full rounded-lg overflow-hidden shadow-sm">
                            <thead className="bg-[#346896] text-white">
                              <tr>
                                <th className="text-left py-2 px-4 font-semibold">
                                  Parameter
                                </th>
                                <th className="text-left py-2 px-4 font-semibold">
                                  Details
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {concentrationData.map((data, index) => (
                                <tr key={index} className=" transition-colors">
                                  <td className="py-3 px-4 font-medium text-gray-700">
                                    {data.label}
                                  </td>
                                  <td className="py-3 px-4 space-y-1.5">
                                    <div className="flex justify-between items-center py-1.5 px-3 bg-gray-50 rounded">
                                      <span className="text-sm text-gray-600">
                                        Volume:
                                      </span>
                                      <span className="font-medium text-gray-800">
                                        {data.details.volume}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center py-1.5 px-3 bg-gray-50 rounded">
                                      <span className="text-sm text-gray-600">
                                        Concentration:
                                      </span>
                                      <span className="font-medium text-gray-800">
                                        {data.details.concentration}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center py-1.5 px-3 bg-gray-50 rounded">
                                      <span className="text-sm text-gray-600">
                                        Absolute Dose:
                                      </span>
                                      <span className="font-medium text-gray-800">
                                        {data.details.absoluteDose}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center py-1.5 px-3 bg-gray-50 rounded">
                                      <span className="text-sm text-gray-600">
                                        Relative Dose:
                                      </span>
                                      <span className="font-medium text-gray-800">
                                        {data.details.relativeDose}
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : null}
                  </div>
                )}

                {/* Inhalation - matches any method containing "inhalation" */}
                {selectedMethod?.toLowerCase().includes("inhalation") && (
                  <>
                    {((speciesData.methodsData?.[selectedMethod]?.length > 0) ||
                      (speciesData.inhalationConcentrations?.length > 0) || 
                      (!hasSpeciesData && researcherData?.inhalationConcentrations?.length > 0)) && (
                      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#346896] to-[#2a5075] px-6 py-2">
                          <h3 className="font-semibold text-white">
                            {selectedMethod}
                          </h3>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {((speciesData.methodsData?.[selectedMethod] || []).length > 0 ? 
                              speciesData.methodsData[selectedMethod] :
                              (speciesData.inhalationConcentrations || []).length > 0 ? 
                              speciesData.inhalationConcentrations : 
                              researcherData?.inhalationConcentrations || []).map(
                              (inhale, index) => {
                                // console.log(" inhale?.unitDuration", inhale);
                                // console.log("speciesData", speciesData);

                                return (
                                  <div
                                    key={index}
                                    className="bg-gray-50 rounded-xl p-5 shadow-sm border border-gray-200 hover:border-[#346896] transition-colors"
                                  >
                                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                                      <h4 className="text-lg font-semibold text-[#346896]">
                                        Concentration #{index + 1}
                                      </h4>
                                    </div>

                                    <div className="space-y-4">
                                      {/* Oxyhydrogen Used - now inside each concentration */}
                                      {inhale?.wasOxyhydrogenUsed?.value && (
                                        <div className="flex justify-between items-center">
                                          <span className="text-gray-600 font-medium flex items-center gap-2">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="h-4 w-4"
                                              viewBox="0 0 20 20"
                                              fill="currentColor"
                                            >
                                              <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                clipRule="evenodd"
                                              />
                                            </svg>
                                            Oxyhydrogen Used
                                          </span>
                                          <span className="text-gray-800 font-medium">
                                            {inhale.wasOxyhydrogenUsed.value}
                                          </span>
                                        </div>
                                      )}

                                      {/* Delivery Method - now inside each concentration */}
                                      {inhale?.deliveryMethod?.value && (
                                        <div className="flex justify-between items-center">
                                          <span className="text-gray-600 font-medium flex items-center gap-2">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="h-4 w-4"
                                              viewBox="0 0 20 20"
                                              fill="currentColor"
                                            >
                                              <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
                                            </svg>
                                            Delivery Method
                                          </span>
                                          <span className="text-gray-800 font-medium">
                                            {inhale.deliveryMethod.value}
                                          </span>
                                        </div>
                                      )}

                                      {inhale?.percentPurity && (
                                        <div className="flex justify-between items-center">
                                          <span className="text-gray-600 font-medium flex items-center gap-2">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="h-4 w-4"
                                              viewBox="0 0 20 20"
                                              fill="currentColor"
                                            >
                                              <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                                                clipRule="evenodd"
                                              />
                                            </svg>
                                            Purity
                                          </span>
                                          <span className="text-gray-800 font-medium">
                                            {getValue(inhale.percentPurity) }%
                                          </span>
                                        </div>
                                      )}

                                      {inhale?.flowRate && (
                                        <div className="flex justify-between items-center">
                                          <span className="text-gray-600 font-medium flex items-center gap-2">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="h-4 w-4"
                                              viewBox="0 0 20 20"
                                              fill="currentColor"
                                            >
                                              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                            </svg>
                                            Flow Rate
                                          </span>
                                          <span className="text-gray-800 font-medium">
                                            {getValue(inhale.flowRate)}{" "}
                                            {getUnit(inhale.flowRate) && (
                                              <span className="text-gray-500 ml-1">
                                                {getUnit(inhale.flowRate)}
                                              </span>
                                            )}
                                          </span>
                                        </div>
                                      )}

                                      {inhale.frequency && (
                                        <div className="flex justify-between items-center">
                                          <span className="text-gray-600 font-medium flex items-center gap-2">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="h-4 w-4"
                                              viewBox="0 0 20 20"
                                              fill="currentColor"
                                            >
                                              <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                                clipRule="evenodd"
                                              />
                                            </svg>
                                            Frequency
                                          </span>
                                          <span className="text-gray-800 font-medium">
                                            {getValue(inhale.frequency)}
                                          </span>
                                        </div>
                                      )}

                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-600 font-medium flex items-center gap-2">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                          Duration
                                        </span>
                                        <span className="text-gray-800 font-medium">
                                          {/* {getValue(inhale.duration)} */}
                                          {getValue(inhale.duration)}{" "}
                                          {inhale?.unitDuration?.name ? 
                                            inhale.unitDuration.name :
                                           "minutes"}
                                        </span>
                                      </div>
                                        {inhale?.estimatedFiH2 && (
                                        <div className="flex justify-between items-center">
                                          <span className="text-gray-600 font-medium flex items-center gap-2">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="h-4 w-4"
                                              viewBox="0 0 20 20"
                                              fill="currentColor"
                                            >
                                              <path
                                                fillRule="evenodd"
                                                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                                clipRule="evenodd"
                                              />
                                            </svg>
                                            Estimated FiH2
                                          </span>
                                          <span className="text-gray-800 font-medium">
                                            {getValue(inhale.estimatedFiH2)} %
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Ingestion - matches any method containing "ingestion" */}
                {selectedMethod?.toLowerCase().includes("ingestion") && (
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#346896] to-[#2a5075] px-6 py-2 flex items-center gap-3">
                      <h3 className="font-semibold text-white">
                        {selectedMethod}
                      </h3>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {speciesData?.methodsData?.[selectedMethod] ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {speciesData.methodsData[selectedMethod]?.peakBreathHydrogen?.value && (
                            <div className="bg-[#E5EDF1] p-4 w-full border-l-2 border-[#346896] bg-gradient-to-r from-[#3468961A] to-transparent">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold text-[#132B38]">
                                  Peak Breath Hydrogen
                                </span>
                              </div>
                              <p className="text-[#346896]">
                                {speciesData.methodsData[selectedMethod].peakBreathHydrogen.value}
                              </p>
                            </div>
                          )}
                          {speciesData.methodsData[selectedMethod]?.frequency?.value && (
                            <div className="bg-[#E5EDF1] p-4 w-full border-l-2 border-[#346896] bg-gradient-to-r from-[#3468961A] to-transparent">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold text-[#132B38]">
                                  Frequency
                                </span>
                              </div>
                              <p className="text-[#346896]">
                                {speciesData.methodsData[selectedMethod].frequency.value}
                              </p>
                            </div>
                          )}
                          {speciesData.methodsData[selectedMethod]?.duration?.value && (
                            <div className="bg-[#E5EDF1] p-4 w-full border-l-2 border-[#346896] bg-gradient-to-r from-[#3468961A] to-transparent">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold text-[#132B38]">
                                  Duration per Frequency
                                </span>
                              </div>
                              <p className="text-[#346896]">
                                {speciesData.methodsData[selectedMethod].duration.value}{" "}
                                {speciesData.methodsData[selectedMethod].duration.unit || "minutes"}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500">No ingestion data available.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Topical applications - matches any method containing "topical" */}
                {selectedMethod?.toLowerCase().includes("topical") && (
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#346896] to-[#2a5075] px-6 py-2 flex items-center gap-3">
                      <h3 className="font-semibold text-white">
                        {selectedMethod}
                      </h3>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* NEW: Display from methodsData if available */}
                      {speciesData?.methodsData?.[selectedMethod]?.topicalMethod?.value ? (
                        <div className="flex items-start gap-4 p-4 w-full border-l-2 border-[#346896] bg-gradient-to-r from-[#3468961A] to-transparent">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mt-0.5 text-[#346896]"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-[#132B38] mb-1">
                              Application Method
                            </p>
                            <p className="text-[#346896] text-sm leading-relaxed">
                              {speciesData.methodsData[selectedMethod].topicalMethod.value}
                            </p>
                          </div>
                        </div>
                      ) : (
                        /* Fallback to old display */
                        <div className="flex items-start gap-4 p-4 w-full border-l-2 border-[#346896] bg-gradient-to-r from-[#3468961A] to-transparent">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mt-0.5 text-[#346896]"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-[#132B38] mb-1">
                              Application Method
                            </p>
                            <p className="text-[#346896] text-sm leading-relaxed">
                              {getValue(
                                speciesData.topicalMethod ||
                                  speciesData.topical_how
                              )}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Cell Culture / Tissues - matches any method containing "cell" */}
                {(selectedMethod?.toLowerCase().includes("cell") || selectedMethod?.toLowerCase().includes("tissue")) && (
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#346896] to-[#2a5075] px-6 py-2 flex items-center gap-3">
                      <h3 className="font-semibold text-white">
                        {selectedMethod}
                      </h3>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* NEW: Display from methodsData if available */}
                        {speciesData?.methodsData?.[selectedMethod]?.concentrationOfHydrogenForMedium?.value ? (
                          <>
                            {/* Concentration Card */}
                            <div className="bg-[#E5EDF1] p-4 w-full border-l-2 border-[#346896] bg-gradient-to-r from-[#3468961A] to-transparent">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold text-[#132B38]">
                                  Concentration of Hydrogen
                                </span>
                              </div>
                              <p className="text-[#346896]">
                                {speciesData.methodsData[selectedMethod].concentrationOfHydrogenForMedium.value}{" "}
                                {speciesData.methodsData[selectedMethod].concentrationOfHydrogenForMedium.unit || "μmoles/L"}
                              </p>
                            </div>

                            {/* Volume of Medium Card */}
                            {speciesData.methodsData[selectedMethod]?.volumeOfMedium?.value && (
                              <div className="bg-[#E5EDF1] p-4 w-full border-l-2 border-[#346896] bg-gradient-to-r from-[#3468961A] to-transparent">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-semibold text-[#132B38]">
                                    Volume of Medium
                                  </span>
                                </div>
                                <p className="text-[#346896]">
                                  {speciesData.methodsData[selectedMethod].volumeOfMedium.value}{" "}
                                  {speciesData.methodsData[selectedMethod].volumeOfMedium.unit || "mL"}
                                </p>
                              </div>
                            )}

                            {/* Exposure Duration Card */}
                            {speciesData.methodsData[selectedMethod]?.exposureDuration?.value && (
                              <div className="bg-[#E5EDF1] p-4 w-full border-l-2 border-[#346896] bg-gradient-to-r from-[#3468961A] to-transparent">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-semibold text-[#132B38]">
                                    Total Exposure Duration
                                  </span>
                                </div>
                                <p className="text-[#346896]">
                                  {speciesData.methodsData[selectedMethod].exposureDuration.value}{" "}
                                  {speciesData.methodsData[selectedMethod].exposureDuration.unit || "minutes"}
                                </p>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {/* Concentration Card */}
                            {speciesData.concentrationOfHydrogenForMedium && (
                              <div className="bg-[#E5EDF1] p-4 w-full border-l-2 border-[#346896] bg-gradient-to-r from-[#3468961A] to-transparent">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-semibold text-[#132B38]">
                                    Concentration
                                  </span>
                                </div>
                                <p className="text-[#346896] ">
                                  {getValue(
                                    speciesData.concentrationOfHydrogenForMedium
                                  )}{" "}
                                  μmoles/L
                                </p>
                              </div>
                            )}

                            {/* Duration Card */}
                            {speciesData.DurationFrequencyCellCultureTissues && (
                              <div className="bg-[#E5EDF1] p-4 w-full border-l-2 border-[#346896] bg-gradient-to-r from-[#3468961A] to-transparent">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-semibold text-[#132B38]">
                                    Total Exposure Duration
                                  </span>
                                </div>
                                <p className="text-[#346896]">
                                  {getValue(
                                    speciesData.DurationFrequencyCellCultureTissues
                                  )}
                                  {getUnit(
                                    speciesData.DurationFrequencyCellCultureTissues
                                  ) && (
                                    <span className="">
                                      {" "}
                                      {getUnit(
                                        speciesData.DurationFrequencyCellCultureTissues
                                      )}
                                    </span>
                                  )}
                                </p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function MiscellaneousDetails({ researcherData, setIsModalFeedBackOpen }) {
  // Helper function to safely get values
  const getValue = (obj) => obj?.name || obj?.value || "N/A";

  // Create dynamic details array based on data
  const details = [
    {
      condition: researcherData?.isERW?.name === "True",
      text: "This study specifically focused on ERW.",
    },
    {
      condition: researcherData?.sexDifference?.name === "True",
      text: "This study identified differences in effects based on sex.",
    },
    {
      condition: researcherData?.responderDifference?.name === "True",
      text: "This study indicated a difference between responders and non-responders.",
    },
    {
      condition: researcherData?.safetyProfile?.name === "True",
      text: "This study uniquely demonstrated the safety profile of H₂.",
    },
    {
      condition: researcherData?.pregnantBreastfeeding?.name === "True",
      text: "This study involved pregnant or breastfeeding subjects.",
    },
    {
      condition: researcherData?.safetyofhydrogen?.name === "True",
      text: "This study showed unique methods for assessing the safety of hydrogen.",
    },
    {
      condition: researcherData?.adverseEffects?.name === "True",
      text: "This study reported adverse effects.",
      description: getValue(researcherData?.adverseEffectsDescription),
    },
    {
      condition: researcherData?.doseDependentEffect?.name === "True",
      text: "This study suggested a dose-dependent effect of hydrogen.",
    },
    {
      condition: researcherData?.mechanisticInsights?.name === "True",
      text: "This study provided mechanistic insights into the effects of hydrogen.",
    },
    {
      condition: researcherData?.geneExpression?.name === "True",
      text: "This study measured changes in gene expression.",
      description: getValue(researcherData?.geneExpressionDesc),
    },
    {
      condition: researcherData?.Video_WebpageLink?.name === "True",
      text: "A video, news article, or blog is available for this study.",
    },
  ].filter((item) => item.condition);

  // Don't render if no data
  if (details.length === 0 && !researcherData?.PasteUrl) return null;

  return (
    <div className="w-full mt-16">
      <div className="flex items-center gap-2 text-black font-bold text-xl mb-4">
        <img src={FiveImage} alt="Miscellaneous" />
        <span>Miscellaneous</span>
      </div>

      <table className="w-full text-left mt-8">
        <tbody>
          {/* Dynamic Details */}
          {details.map((row, index) => (
            <tr
              key={index}
              className={index === details.length - 1 ? "" : "border-b"}
            >
              <td className="text-[#222222] border-l text-[15px] p-4 space-y-1">
                <div>{row.text}</div>
                {row.description && (
                  <div className="text-[#346896] p-2 border-l-2 border-l-[#346896] mt-2">
                    {row.description}
                  </div>
                )}
              </td>
            </tr>
          ))}

          {/* External Link */}
          {researcherData?.PasteUrl?.name && (
            <tr>
              <td className="text-[#222222] border-l text-[15px] p-4">
                <button
                  onClick={() =>
                    window.open(getValue(researcherData.PasteUrl), "_blank")
                  }
                  className="bg-[#346896] text-white px-4 py-2 rounded-full text-sm hover:bg-[#2a5075] transition-colors"
                >
                  Read more about this here
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function BiomarkerDetails({ biomakerData, setIsModalFeedBackOpen }) {
  const [activeTab, setActiveTab] = useState("");

  // Process data to organize by categories
  const processedData = useMemo(() => {
    const categoryMap = new Map();

      if (!biomakerData || biomakerData.length === 0) {
      return [];
    }

    
    categoryMap.set("All Categories", 
      biomakerData?.map((biomarker) => ({
        marker: biomarker?.marker,
        change: biomarker?.Change?.[0] || "",
        protein: biomarker?.Protein,
      }))
    );

    biomakerData?.forEach((biomarker) => {
      const categories = biomarker?.category || [];

      categories.forEach((category) => {
        if (!categoryMap.has(category)) {
          categoryMap.set(category, []);
        }

        categoryMap.get(category).push({
          marker: biomarker?.marker,
          change: biomarker?.Change?.[0] || "",
          protein: biomarker?.Protein,
        });
      });
    });

    return Array.from(categoryMap).map(([title, markers]) => ({
      title,
      markers,
    }));
  }, [biomakerData]);

  // Set initial active tab when data loads
  useEffect(() => {
    if (processedData.length > 0 && !activeTab) {
      setActiveTab(processedData[0].title);
    }
  }, [processedData, activeTab]);

  // Don't render anything if no data
  if (processedData.length === 0) {
    return null;
  }

  // Get change icon based on value
  const getChangeIcon = (change) => {
    let color = "text-gray-600";
    let rotation = "";

    if (change.toLowerCase().includes("increased")) {
      color = "text-green-600";
    } else if (change.toLowerCase().includes("decreased")) {
      color = "text-red-600";
      rotation = "rotate-90";
    }

    return {
      color,
      rotation,
      tooltip: change || "No change",
    };
  };

  return (
    <div className="w-full mt-16">
      {/* Heading */}
      <div className="flex items-center gap-2 text-black font-bold text-xl mb-4">
        <img src={SixImage} alt="SixImage" />
        <span>Biomarker/Function Tests</span>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-4">
        <div className="flex flex-wrap">
          {processedData.map((category) => (
            <button
              key={category.title}
              onClick={() => setActiveTab(category.title)}
              className={`py-2 px-4 text-sm font-medium border-b-2 ${
                activeTab === category.title
                  ? "border-[#346896] text-[#346896]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>
      </div>

      {/* Active Tab Content */}
      {processedData.map((category) => (
        <div
          key={category.title}
          className={`${activeTab === category.title ? "block" : "hidden"}`}
        >
          {category.markers.map((item, index) => {
            const changeIconData = getChangeIcon(item.change);

            return (
              <div
                key={index}
                className="border-b w-[50%] border-gray-100 last:border-b-0 bg-gray-50"
              >
                <div className="flex items-center px-4 py-3">
                  {/* Change icon */}
                  <div className="tooltip-container cursor-pointer">
                    {(() => {
                      const change = (changeIconData.tooltip || '').toLowerCase();
                      if (change.includes('increased')) {
                        return (
                          <svg
                            className={`${changeIconData.color} ${changeIconData.rotation}`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.5361 5.25H18.3933V10.1071"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M18.3931 5.25L11.5324 12.1107C11.4189 12.222 11.2663 12.2843 11.1074 12.2843C10.9485 12.2843 10.7959 12.222 10.6824 12.1107L7.88956 9.31786C7.77607 9.20661 7.62349 9.1443 7.46456 9.1443C7.30564 9.1443 7.15306 9.20661 7.03956 9.31786L2.60742 13.75"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        );
                      } else if (change.includes('decreased')) {
                        return (
                          <svg
                            className={`${changeIconData.color} rotate-90`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.5361 5.25H18.3933V10.1071"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M18.3931 5.25L11.5324 12.1107C11.4189 12.222 11.2663 12.2843 11.1074 12.2843C10.9485 12.2843 10.7959 12.222 10.6824 12.1107L7.88956 9.31786C7.77607 9.20661 7.62349 9.1443 7.46456 9.1443C7.30564 9.1443 7.15306 9.20661 7.03956 9.31786L2.60742 13.75"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        );
                      } else {
                        return (
                          <svg
                            className="text-gray-400"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect x="4" y="9" width="12" height="2" rx="1" fill="currentColor" />
                          </svg>
                        );
                      }
                    })()}
                    <span className="tooltip">{changeIconData.tooltip}</span>
                  </div>

                  {/* Marker */}
                  <div className="flex-1 flex text-start items-center justify-start ml-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="text-[#346896] mx-1"
                    >
                      <path
                        d="M3.5 1.75H5.25V3.5C5.25 4.76 5.845 5.78375 6.895 6.8075C7.6475 7.53375 8.65375 8.23375 9.70375 8.925L8.1025 9.96625C7.23625 9.38 6.39625 8.75 5.6875 8.05875C4.43625 6.8425 3.5 5.3375 3.5 3.5V1.75ZM15.75 1.75H17.5V3.5C17.5 5.3375 16.5638 6.8425 15.3125 8.05875C14.0787 9.26625 12.5037 10.2638 10.9725 11.235C9.44125 12.215 7.95375 13.1687 6.895 14.1925C5.845 15.2162 5.25 16.24 5.25 17.5V19.25H3.5V17.5C3.5 15.6625 4.43625 14.1575 5.6875 12.9412C6.92125 11.7338 8.49625 10.7362 10.0275 9.765C11.5588 8.785 13.0463 7.83125 14.105 6.8075C15.155 5.78375 15.75 4.76 15.75 3.5V1.75ZM12.8975 11.0337C13.7638 11.62 14.6038 12.25 15.3125 12.9412C16.5638 14.1575 17.5 15.6625 17.5 17.5V19.25H15.75V17.5C15.75 16.24 15.155 15.2162 14.105 14.1925C13.3525 13.4662 12.3462 12.7663 11.2962 12.075L12.8975 11.0337ZM6.125 2.625H14.875V3.5L14.8225 3.9375H6.1775L6.125 3.5V2.625ZM6.72 5.25H14.28C14.07 5.5475 13.825 5.85375 13.4925 6.1775L13.0462 6.5625H7.93625L7.5075 6.1775C7.175 5.85375 6.93 5.5475 6.72 5.25ZM7.95375 14.4375H13.0638L13.4925 14.8225C13.825 15.1463 14.07 15.4525 14.28 15.75H6.72C6.93 15.4525 7.175 15.1463 7.5075 14.8225L7.95375 14.4375ZM6.1775 17.0625H14.8225L14.875 17.5V18.375H6.125V17.5L6.1775 17.0625Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="text-gray-700 mx-1">{item.marker}</span>
                  </div>

                  {/* Protein */}
                  <div className="tooltip-container cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="text-[#346896]"
                    >
                      <path
                        d="M18.375 10.4999H15.7833C15.5995 10.4999 15.5067 10.4999 15.4289 10.5366C15.3577 10.5703 15.2969 10.6226 15.253 10.688C15.1996 10.765 15.1725 10.8674 15.1174 11.073L13.5275 17.0633C13.3236 17.8289 13.2221 18.2121 13.069 18.311C13.0061 18.3529 12.9321 18.3751 12.8565 18.3748C12.781 18.3745 12.7072 18.3517 12.6446 18.3093C12.4915 18.2086 12.3926 17.8245 12.1949 17.058L8.806 3.94176C8.60738 3.17526 8.5085 2.79114 8.35537 2.69051C8.2928 2.64812 8.21903 2.62531 8.14345 2.625C8.06788 2.62469 7.99392 2.64689 7.931 2.68876C7.77788 2.78764 7.67637 3.17001 7.4725 3.93651L5.88263 9.92589C5.8275 10.1324 5.80037 10.2348 5.74787 10.3109C5.70382 10.3767 5.64274 10.4293 5.57113 10.4631C5.49325 10.4999 5.40137 10.4999 5.21675 10.4999H2.625"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="tooltip tooltip-right">
                      {item.protein || "Protein Expression/Activity Level"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {/* CSS for tooltips */}
      <style jsx>{`
        .tooltip-container {
          position: relative;
          display: inline-block;
        }

        .tooltip {
          visibility: hidden;
          position: absolute;
          bottom: 125%;
          z-index: 100;
          background-color: #333;
          color: white;
          text-align: center;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .tooltip-right {
          right: 0;
        }

        .tooltip-container:hover .tooltip {
          visibility: visible;
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

const FeedbackModal = ({ data, onClose }) => {
  const articleData = data;
  const [sections, setSections] = useState([
    { screenshot: null, explanation: "", revision: "" },
  ]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
  });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  // Create refs for file inputs
  const fileInputRefs = useRef([]);

  // Initialize refs when sections change
  React.useEffect(() => {
    fileInputRefs.current = fileInputRefs.current.slice(0, sections.length);
  }, [sections.length]);

  // Section Management
  const handleAddSection = () => {
    setSections([
      ...sections,
      { screenshot: null, explanation: "", revision: "" },
    ]);
  };

  const handleRemoveSection = (index) => {
    if (sections.length === 1) return;
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
  };

  const handleFileUpload = async (index, file) => {
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      error_toast_message("Please upload only image files");
      return;
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      error_toast_message("Image file is too large (max 5MB)");
      return;
    }

    setIsUploading(true);
    setUploadingIndex(index);

    try {
      const result = await uploadToCloudinary(file);
      const newSections = [...sections];
      newSections[index].screenshot = result?.url;
      setSections(newSections);
      success_toast_message("Image uploaded successfully");
    } catch (error) {
      error_toast_message("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadingIndex(null);
    }
  };

  // Handle file selection through the input
  const handleFileSelect = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(index, file);
    }
  };

  // Handle clipboard paste events
  const handlePaste = (e, index) => {
    const clipboardItems = e.clipboardData.items;
    const items = [...clipboardItems];

    const imageItem = items.find((item) => item.type.startsWith("image"));

    if (imageItem) {
      const file = imageItem.getAsFile();
      if (file) {
        handleFileUpload(index, file);
      }
    } else {
      error_toast_message(
        "No image found in clipboard. Please copy a screenshot first."
      );
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    e.stopPropagation();

    // Add highlight class or state to the drop zone
    const dropZone = document.getElementById(`dropzone-${index}`);
    if (dropZone) {
      dropZone.classList.add('border-blue-400', 'bg-blue-50');
    }
  };

  const handleDragLeave = (e, index) => {
    e.preventDefault();
    e.stopPropagation();

    // Remove highlight class or state
    const dropZone = document.getElementById(`dropzone-${index}`);
    if (dropZone) {
      dropZone.classList.remove('border-blue-400', 'bg-blue-50');
    }
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    e.stopPropagation();

    // Remove highlight class or state
    const dropZone = document.getElementById(`dropzone-${index}`);
    if (dropZone) {
      dropZone.classList.remove('border-blue-400', 'bg-blue-50');
    }

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileUpload(index, file);
    }
  };

  const uploadToCloudinary = async (fileToUpload) => {
    const formData = new FormData();
    formData.append("image", fileToUpload);

    try {
      const response = await apiHandle.post("upload-images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response.data?.image_url) {
        throw new Error("Invalid response format");
      }

      return { url: response.data.image_url };
    } catch (error) {
      throw new Error("Upload failed: " + error.message);
    }
  };

  // Field Change Handler
  const handleFieldChange = (index, field, value) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };

  // Form Submission Flow
  const handleSubmit = () => {
    // Check if any section has a screenshot
    const hasScreenshot = sections.some(section => section.screenshot);

    if (!hasScreenshot) {
      error_toast_message("Please upload at least one screenshot");
      return;
    }

    setShowUserForm(true);
  };

  const handleUserDetailsSubmit = async () => {
    try {
      // API Call - note that name and email are now optional
      const obj = {
        user: {
          name: userDetails.name || "Anonymous",
          email: userDetails.email || "anonymous@example.com",
        },
        feedback: sections,
        article_id: articleData?.id,
        status: "In Progress",
      };

      await apiHandle
        .post("add-feedback", obj)
        .then((res) => {
          onClose();
          success_toast_message("Feedback submitted successfully!");
        })
        .catch((err) => {
          error_toast_message(err);
        });
    } catch (error) {
      error_toast_message("Failed to submit feedback");
    }
  };

  // Minimize and restore modal
  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleRestore = () => {
    setIsMinimized(false);
  };

  // Return minimized sticky button if minimized
  // <button
  //   onClick={handleRestore}
  //    className="fixed bottom-4 right-4 bg-[#346896] text-white rounded-full shadow-lg z-50 hover:bg-[#2a5478] transition-all flex items-center gap-2 px-5 py-3 group animate-fadeIn"
  //   style={{
  //     boxShadow: "0 4px 14px rgba(0, 0, 0, 0.25)",
  //   }}
  // >
  //   <div  className="relative">
  //     <div  className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
  //     <MdFeedback
  //       size={20}
  //        className="text-white group-hover:scale-110 transition-transform"
  //     />
  //   </div>
  //   <span  className="font-medium">Resume Feedback</span>
  //   <span  className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#346896] text-xs ml-1">
  //     <svg
  //       xmlns="http://www.w3.org/2000/svg"
  //        className="h-3.5 w-3.5"
  //       viewBox="0 0 20 20"
  //       fill="currentColor"
  //     >
  //       <path
  //         fillRule="evenodd"
  //         d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
  //         clipRule="evenodd"
  //       />
  //     </svg>
  //   </span>
  // </button>
  if (isMinimized) {
    return (
      <button
        onClick={handleRestore}
        className="fixed bottom-24 right-7 bg-[#346896] text-white rounded-full shadow-lg z-50 hover:bg-[#2a5478] transition-all duration-300 w-16 h-16 flex items-center justify-center group animate-fadeIn hover:scale-110"
        style={{
          boxShadow: "0 8px 25px rgba(52, 104, 150, 0.3)",
        }}
        title="Resume Feedback" // Tooltip on hover
      >
        {/* Icon with Notification Dot */}
        <div className="relative">
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
          <MdFeedback
            size={26}
            className="text-white group-hover:rotate-12 transition-transform duration-200"
          />
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col"
        style={{ maxHeight: "90vh" }}
      >
        {/* Main Feedback Form */}
        {!showUserForm ? (
          <>
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-2xl font-bold">Submit Feedback</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMinimize}
                  className="text-gray-500 hover:text-gray-700 p-1"
                  title="Minimize"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 12H6"
                    />
                  </svg>
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 p-1"
                  title="Close"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div
              className="flex-1 overflow-auto p-6"
              style={{ maxHeight: "calc(90vh - 130px)" }}
            >
              {sections.map((section, index) => (
                <div key={index} className="mb-6 border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">
                      Please provide your suggestion to improve this article
                    </h3>
                    {sections.length > 1 && (
                      <button
                        onClick={() => handleRemoveSection(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Screenshot Upload - Enhanced with multiple methods */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Upload Screenshot
                    </label>
                    <div
                      id={`dropzone-${index}`}
                      className={`relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-[#346896] transition-colors ${isUploading && uploadingIndex === index
                        ? "bg-gray-50"
                        : ""
                        }`}
                      onPaste={(e) => handlePaste(e, index)}
                      onDragOver={(e) => handleDragOver(e)}
                      onDragEnter={(e) => handleDragEnter(e, index)}
                      onDragLeave={(e) => handleDragLeave(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      tabIndex="0" // Make div focusable for better keyboard access
                    >
                      {isUploading && uploadingIndex === index ? (
                        // Loading state
                        <div className="flex flex-col items-center py-4">
                          <div className="w-10 h-10 border-4 border-[#346896] border-t-transparent rounded-full animate-spin mb-3"></div>
                          <p className="text-sm text-gray-600">Uploading image...</p>
                        </div>
                      ) : section.screenshot ? (
                        // Image preview state
                        <div className="relative">
                          <img
                            src={section?.screenshot}
                            alt="Preview"
                            className="h-32 object-contain mb-2"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newSections = [...sections];
                              newSections[index].screenshot = null;
                              setSections(newSections);
                            }}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                            title="Remove image"
                          >
                            <FireExtinguisher />
                          </button>
                        </div>
                      ) : (
                        // Empty state with multiple upload options
                        <>
                          <FaFileImage className="w-8 h-8 text-gray-400 mb-3" />
                          <p className="text-sm text-gray-700 font-medium mb-1">
                            Add your screenshot
                          </p>
                          <div className="flex flex-wrap justify-center gap-2 mb-2">
                            <span className="inline-flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                              <span className="font-semibold mr-1">CTRL+V</span> Paste
                            </span>
                            <span className="inline-flex items-center text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                              <span className="font-semibold mr-1">Drop</span> Image
                            </span>
                            <button
                              onClick={() => fileInputRefs.current[index].click()}
                              className="inline-flex items-center text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded"
                            >
                              <span className="font-semibold mr-1">Browse</span> Files
                            </button>
                          </div>
                          <span className="text-xs text-gray-500 text-center">
                            Supports JPG, PNG, GIF up to 5MB
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={(el) => (fileInputRefs.current[index] = el)}
                            onChange={(e) => handleFileSelect(e, index)}
                          />
                        </>
                      )}
                    </div>
                  </div>

                  {/* Explanation Field */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Explain what's wrong
                    </label>
                    <textarea
                      value={section.explanation}
                      onChange={(e) =>
                        handleFieldChange(index, "explanation", e.target.value)
                      }
                      className="w-full p-2 border rounded-md focus:ring-[#346896] focus:border-[#346896]"
                      rows="3"
                      placeholder="Describe the issue in detail..."
                    />
                  </div>

                  {/* Suggested Revision Field */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Suggested Revision
                    </label>
                    <textarea
                      value={section.revision}
                      onChange={(e) =>
                        handleFieldChange(index, "revision", e.target.value)
                      }
                      className="w-full p-2 border rounded-md focus:ring-[#346896] focus:border-[#346896]"
                      rows="3"
                      placeholder="Provide your suggested correction..."
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={handleAddSection}
                className="w-full py-2 text-[#346896] hover:text-[#346896] border border-dashed rounded-lg"
              >
                + Add Another Feedback
              </button>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 border-t flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-[#346896] text-white rounded-md hover:bg-[#2a5478] transition-colors"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          /* User Details Form - Now optional fields */
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Enter Your Details (Optional)</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMinimize}
                  className="text-gray-500 hover:text-gray-700 p-1"
                  title="Minimize"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 12H6"
                    />
                  </svg>
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 p-1"
                  title="Close"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name <span className="text-gray-500 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md focus:ring-[#346896] focus:border-[#346896]"
                  value={userDetails.name}
                  onChange={(e) =>
                    setUserDetails((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email <span className="text-gray-500 font-normal">(optional)</span>
                </label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-md focus:ring-[#346896] focus:border-[#346896]"
                  value={userDetails.email}
                  onChange={(e) =>
                    setUserDetails((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="your.email@example.com"
                />
                <p className="text-xs text-gray-500 mt-1">
                  We'll use this to contact you if we need more information
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowUserForm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Back
              </button>
              <button
                onClick={handleUserDetailsSubmit}
                className="px-6 py-2 bg-[#346896] text-white rounded-md hover:bg-[#2a5478]"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SectionOneNew = () => {
  //
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [articleData, setArticleData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true); // Start loading
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/get-article/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch article data");
        }
        const data = await response.json();
        setArticleData(data?.article);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  //
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalFeedBackOpen, setIsModalFeedBackOpen] = useState(false);

  const [selectedFormat, setSelectedFormat] = useState("NLM");

   const handleDownload = () => {
    const xmlContent = generateXML(articleData);

    // Use a safer MIME type
    const blob = new Blob([xmlContent], { type: "text/xml;charset=utf-8" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "citation.xml";
    link.style.display = "none";
    link.rel = "noopener"; // helps avoid some browser safety warnings

    document.body.appendChild(link);
    link.click();

    // Cleanup
    setTimeout(() => {
        URL.revokeObjectURL(url);
        link.remove();
    }, 100);
};

    const handleCopy = () => {
        const citation = citationFormats[selectedFormat]({
          ...articleData?.publicData,
          authors: articleData?.publicData?.authors || [],
          issue: articleData?.publicData?.issue || null,
          articleData: articleData
        });
        navigator.clipboard.writeText(citation);
        success_toast_message("Citation copied to clipboard!");
    };

    const formatAuthors = () => {
        if (!Array.isArray(articleData?.publicData?.authors)) return articleData?.publicData?.authors;
        return articleData?.publicData?.authors.map(author => author.name).join(", ");
    };

  const publicData = articleData?.publicData;
  const articleGeneralData = articleData?.articleGeneralData;
  const researcherData = articleData?.researcherData;
  const biomakerData = articleData?.biomaker;

  const countryData = {
    AuthorCountry: publicData?.country,
    GrantCountry: publicData?.grantCountry,
    ResearchCountry: publicData?.researchCountry,
  };

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  console.log("Article Data:", articleData);

   const doiUrl = articleData?.doi?.startsWith("http")
    ? articleData?.doi
    : `https://doi.org/${articleData?.doi}`;

   const PDFHandle = () => {
    if (articleData?.publicData?.pdf_url?.[0]?.isPaywall === true) {
      window.open(`/ArticleDetails/${articleData?.mhid}/view-pdf`, "_blank");
    } else {
      window.open(doiUrl, "_blank", "noopener,noreferrer");
    }
  };

  

  const AuthorItem = ({ author, index, arr, isTouchDevice }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const authorRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (authorRef.current && !authorRef.current.contains(event.target)) {
          setShowTooltip(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    

    return (
      <span
        key={author.name}
        className="relative inline-flex items-center"
        ref={authorRef}
      >
        {/* Author Name */}

        <a
          className={`text-[#346896] ml-3 cursor-pointer hover:underline ${
            isTouchDevice ? "no-hover" : ""
          }`}
          onClick={(e) => {
            e.preventDefault();
            navigate(`/articles?author=${encodeURIComponent(author.name)}`);
          }}
        >
          {author.name}
        </a>

        {/* Asterisk instead of Article Count */}
        {author?.affiliation && (
          <sup
            className="text-[#346896] ml-1 cursor-pointer font-bold"
            onClick={() => setShowTooltip(!showTooltip)}
          >
            *
          </sup>
        )}

        {/* Affiliation Tooltip */}
        {showTooltip && author?.affiliation && (
          <div className="absolute bottom-full left-0 mb-2 px-3 py-1 w-[220px] text-xs bg-gray-700 text-white rounded-lg shadow-lg z-50">
            <div className="relative">
              <p className="font-medium">{author.name}:</p>
              <p>{author.affiliation}</p>
              <div className="absolute top-full left-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-700"></div>
            </div>
          </div>
        )}

        {/* Comma Separator */}
        {index !== arr.length - 1 && <span>, </span>}
      </span>
    );
  };
  const [showAffiliations, setShowAffiliations] = useState(false);


  


  function ShareButton() {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleSocialShare = (platform) => {
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        currentUrl
      )}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        currentUrl
      )}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        currentUrl
      )}`,
    };
    window.open(shareUrls[platform], "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      alert("Link copied to clipboard!");
    } catch (err) {

    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: currentUrl,
        });
      } catch (err) {
      }
    } else {
      setIsShareOpen(!isShareOpen);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className="flex items-center min-w-[91px] text-[14px] text-center justify-center gap-2 px-4 py-2 border border-[#CFDAE5] rounded-md text-[#132B38] font-medium bg-[#E7ECF0] hover:bg-gray-200"
      >
        <FaShareAlt color="#346896" /> Share
      </button>

      {isShareOpen && !navigator.share && (
        <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Share via</span>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => handleSocialShare("facebook")}
              className="text-[#3b5998] hover:text-[#2d4373] transition-colors"
            >
              <FaFacebook size={24} />
            </button>

            <button
              onClick={() => handleSocialShare("twitter")}
              className="text-[#1da1f2] hover:text-[#0d8ecf] transition-colors"
            >
              <FaTwitter size={24} />
            </button>

            <button
              onClick={() => handleSocialShare("linkedin")}
              className="text-[#0077b5] hover:text-[#005582] transition-colors"
            >
              <FaLinkedin size={24} />
            </button>

            <button
              onClick={handleCopyLink}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FaLink size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <Oval
          height={50}
          width={50}
          color="#346896"
          secondaryColor="#346896"
          visible={true}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <p className="text-red-500 font-semibold">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] 1366px:max-w-[1000px] 1440px:max-w-[1200px] 1920px:max-w-[1200px] mx-auto p-4 mt-10">
      <button
        onClick={() => window.history.back()}
        className="flex items-center text-blue-500 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg px-4 py-2 transition duration-300 ease-in-out mb-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 12H5"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>
      {/* Title */}
      {publicData?.title?.name && (
        <h1
          class="text-black text-xl md:text-2xl lg:text-3xl xl:text-3xl font-bold mt-10"
          style={{ lineHeight: "normal" }}
        >
          {publicData?.title?.name}
        </h1>
      )}

      {/* Authors Section */}
      {publicData?.authors?.length > 0 && (
        <div className="mt-7 mb-10">
          <p className="text-[#132B38] text-[16px] font-medium leading-normal">
            Published in {publicData?.year?.name}.{" "}
            {publicData?.authors?.map((author, index, arr) => (
              <AuthorItem
                key={author.name}
                author={author}
                index={index}
                arr={arr}
                isTouchDevice={isTouchDevice}
              />
            ))}
          </p>

          {/* MHID && DOI && Volume && Pages && Journal */}
          <div className="flex gap-6  text-1xl mt-7 flex-wrap">
            {articleData?.mhid && (
              <div className="flex items-center gap-1">
                <span>
                  <img src={MhidImage} alt="MhidImage" />
                </span>
                <span className="font-bold mr-1">MHID:</span>
                <span>{articleData?.mhid?.split("-")[1]}</span>
              </div>
            )}

            {articleData?.pmid && (
              <div className="flex items-center gap-1">
                <span>
                  <img src={PmidImage} alt="PmidImage" />
                </span>
                <span className="font-bold mr-1">PMID:</span>
                <span>{articleData?.pmid}</span>
              </div>
            )}

            {articleData?.doi && (
              <div>
                <span className="font-bold mr-1">DOI:</span>
                {/* <span className='text-[#346896] underline cursor-pointer' onClick={}>{articleData?.doi}</span> */}
                <span
                  className="text-[#346896] underline cursor-pointer"
                  onClick={() => {
                    if (articleData?.doi) {
                      const doiUrl = articleData?.doi?.startsWith("http")
                        ? articleData.doi
                        : `https://pubmed.ncbi.nlm.nih.gov/${articleData.doi}`;
                      window.open(doiUrl, "_blank", "noopener,noreferrer");
                    }
                  }}
                >
                  {articleData?.doi}
                </span>
              </div>
            )}

            {publicData?.journal?.name && (
              <div>
                <span className="font-bold mr-1">Journal:</span>
                <a
                  className="text-black "
                  style={{ textDecoration: "none" }}
                >
                  {publicData?.journal?.name}
                </a>
              </div>
            )}

            {/* {publicData?.sciMAGO?.name && (
              <div>
                <span className="font-bold mr-1">SJR:</span>
                <span className="text-[#346896] ">
                  {publicData?.sciMAGO?.name}
                </span>
              </div>
            )} */}
            {publicData?.sciMAGO?.name && (
              <div className="flex flex-col">
                {/* <div className="font-bold mr-1">SJR:</div> */}
                <div className="flex flex-col">
                  {/* Extract the quartile from sciMAGO name (e.g., "Q1", "Q2", etc.) */}
                  {(() => {
                    const sjrText = publicData?.sciMAGO?.name || "";
                    const quartileMatch = sjrText.match(/Q[1-4]/i);
                    const quartile = quartileMatch
                      ? quartileMatch[0].toUpperCase()
                      : null;

                    // Get number of blocks to show based on quartile
                    const numBlocks =
                      quartile === "Q1"
                        ? 4
                        : quartile === "Q2"
                        ? 3
                        : quartile === "Q3"
                        ? 2
                        : quartile === "Q4"
                        ? 1
                        : 0;

                    // Only show if we have a valid quartile
                    return quartile ? (
                      <>
                        {/* <div className="text-gray-600">
                          {publicData?.journal?.name}
                        </div> */}
                        <div className="flex items-center gap-1 mt-1">
                          <span className="font-bold mr-1 text-sm">
                            {quartile} SJR score
                          </span>
                          <div className="flex ml-2">
                            {[...Array(numBlocks)].map((_, i) => (
                              <div
                                key={i}
                                className="w-8 h-2 bg-emerald-400 rounded-sm mr-1"
                              ></div>
                            ))}
                            {[...Array(4 - numBlocks)].map((_, i) => (
                              <div
                                key={i}
                                className="w-8 h-2 bg-gray-200 rounded-sm mr-1"
                              ></div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : null;
                  })()}
                </div>
              </div>
            )}

            {publicData?.impactFactor?.name && (
              <div>
                <span className="font-bold mr-1">Impact Factor:</span>
                <span className="text-black ">
                  {publicData?.impactFactor?.name}
                </span>
              </div>
            )}
          </div>

          {(() => {
            // Get filtered list of authors with affiliations
            const authorsWithAffiliations =
              publicData?.authors?.filter(
                (author) =>
                  author.affiliation && author.affiliation.trim() !== ""
              ) || [];
            console.log("authorsWithAffiliations", authorsWithAffiliations);

            // You need to RETURN the JSX here
            return authorsWithAffiliations.length > 0 ? (
              <>
                <button
                  onClick={() => setShowAffiliations(!showAffiliations)}
                  className="flex items-center text-[#346896] hover:text-blue-800 text-sm font-medium mt-7"
                >
                  * Affiliations:{" "}
                  <span className="pl-3">
                    {showAffiliations ? "Collapse" : "Expand"}
                  </span>
                  <svg
                    className={`ml-1 h-4 w-4 transition-transform ${
                      showAffiliations ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showAffiliations && (
                  <div className="w-full pl-3 py-1 border-l-2 border-gray-300 mt-5 max-w-[800px]">
                    {/* <h4 className="font-medium mb-2 text-sm">Affiliations:</h4> */}
                    <ul className="space-y-2 text-sm list-none">
                      {authorsWithAffiliations.map((author) => (
                        <li key={author.name} className="flex">
                          <span className="mr-2 text-[#346896] font-bold">
                            *
                          </span>
                          <span>
                            <span className="font-medium">{author.name}:</span>{" "}
                            {author.affiliation}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : null;
          })()}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 pb-10 border-b">
        {/* Left Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center min-w-[91px] text-[14px] text-center justify-center gap-2 px-4 py-2 border border-[#CFDAE5] rounded-md text-[#132B38] font-medium bg-[#E7ECF0] hover:bg-gray-200"
          >
            <FaQuoteLeft size={16} color="#346896" /> Cite
          </button>

          <ShareButton />
          {articleGeneralData?.HighlightArticle?.name === "True" && (
            <div className="relative inline-block group">
              <FaStar className="text-[#346896] text-3xl cursor-help hover:scale-110 transition" />

              {/* Tooltip - Fixed positioning */}
              <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-2 text-sm text-white bg-gray-800 rounded-md shadow-lg z-10">
                <div className="relative">
                  {articleGeneralData?.descHighArt?.name}
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-solid border-t-gray-800 border-t-8 border-x-transparent border-x-8 border-b-0"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-2">
          {(articleData?.publicData?.pdf_url?.[0]?.isPaywall === true ||
            articleData?.publicData?.pdf_url?.[0]?.isPaywall === false) && (
              <button
                onClick={() => PDFHandle()}
                className="flex items-center min-w-[91px] text-[14px] text-center justify-center gap-2 px-4 py-2 border border-[#CFDAE5] rounded-md text-[#132B38] font-medium bg-[#E7ECF0] hover:bg-gray-200"
              >
                <FaEye size={16} color="#346896" />{" "}
                {articleData?.publicData?.pdf_url?.[0]?.isPaywall === true
                  ? "View PDF"
                  : "View Article on Publisher Site"}
              </button>
            )}

          <button
            onClick={() => setIsModalFeedBackOpen(true)}
            className="flex items-center min-w-[91px] text-[14px] text-center justify-center gap-2 px-4 py-2 border border-[#CFDAE5] rounded-md  text-white font-medium  bg-[#346896] hover:bg-[#2c577a] transition"
          >
            <FeedbackOutlined size={16} color="#fff" /> Submit Feedback
          </button>
        </div>
      </div>

      {/* Abstract */}
      {publicData?.abstract?.name && (
        <div>
          <div className="text-left text-black font-plus-jakarta-sans font-bold text-lg sm:text-xl md:text-[20px] mt-7">
            Abstract
          </div>
          {publicData.abstract?.name.includes("<") &&
          publicData.abstract?.name.includes(">") ? (
            <div
              className="text-1xl text-[#767676] mt-4 font-normal"
              style={{ lineHeight: "210%", backgroundColor: "rgb(255, 255, 255)", color: "rgb(33, 33, 33)" }}
              dangerouslySetInnerHTML={{ __html: publicData?.abstract?.name }}
            />
          ) : (
            <p
              className="text-1xl text-[#767676] mt-4 font-normal"
            style={{ lineHeight: "210%", backgroundColor: "rgb(255, 255, 255)", color: "rgb(33, 33, 33)" }}
            >
              {publicData.abstract.name}
            </p>
          )}
        </div>
      )}

      {/* Outcome */}
      {(articleGeneralData?.outcome?.name ||
        articleGeneralData?.outcomeType?.length > 0 ||
        articleGeneralData?.rankThisArticle?.name) && (
        <div className="flex justify-between items-center gap-4 w-full mt-16">
          {/* Left Box with Reduced Width */}

          {(articleGeneralData?.outcome?.name ||
            articleGeneralData?.outcomeType?.length > 0) && (
            <div className="w-[65%] p-4 border-l-4 border-[#346896] bg-gradient-to-r from-[#3468961A] to-transparent rounded-md">
              {/* <p className="text-[#132B38] font-medium text-[15px] mt-5">
                Why this article is highlighted
              </p> */}
              {articleGeneralData?.descHighArt?.name && (
                <div className="flex items-start mt-2 mb-2">
                  <FaStar className="text-[#346896] text-2xl flex-shrink-0 mr-2 mt-1" />
                  <p className="text-[#346896] text-[16px]">
                    {articleGeneralData?.descHighArt?.name}
                  </p>
                </div>
              )}
              <div className="ml-8">
                <p className="text-[#132B38] font-medium text-[15px]">
                  Outcome,{" "}
                  <span className="text-[#52AB39] font-bold">
                    {articleGeneralData?.outcomeType
                      ?.map((elem) => elem)
                      .join(", ")}
                  </span>
                </p>
                {articleGeneralData?.outcome?.name && (
                  <p className="text-[#346896] text-[16px] mt-2">
                    {articleGeneralData?.outcome?.name}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Section Tow Start  */}

      <StudyDetails articleGeneralData={articleGeneralData} />

      <ResearchDetails articleGeneralData={articleGeneralData} />

      <ComparativeInformation researcherData={researcherData} />

      <HydrogenAdministration
        researcherData={researcherData}
        articleGeneralData={articleGeneralData}
        setIsModalFeedBackOpen={setIsModalFeedBackOpen}
      />

      <MiscellaneousDetails researcherData={researcherData} />

      <BiomarkerDetails biomakerData={biomakerData} />

      {Object.values(countryData).some((value) => value) && (
        <GeographicInfo country={countryData} />
      )}

      {/* Section Tow End  */}

        {/* Citation Modal */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Cite this article</h2>

            {/* Format Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Select Format
              </label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#346896] focus:border-[#346896]"
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
              >
                {Object.keys(citationFormats).map((format) => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>
            </div>

            {/* Citation Preview */}
             <div className="bg-gray-100 p-4 rounded-md shadow-inner">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
               {(() => {
                  const citation = citationFormats[selectedFormat]({
                    ...articleData?.publicData,
                    authors: articleData?.publicData?.authors || [],
                    issue: articleData?.publicData?.issue || null,
                    articleData: articleData,
                    React: React,
                    asNodes: true  // Use React nodes for APA and MLA display
                  });
                  
                  // If it's an array (React nodes), render each element
                  if (Array.isArray(citation)) {
                    return citation.map((node, index) => 
                      React.isValidElement(node) ? 
                        React.cloneElement(node, { key: index }) : 
                        <span key={index}>{node}</span>
                    );
                  }
                  
                  // Otherwise, render as string
                  return citation;
                })()}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex justify-between items-center">
              <button
                className="bg-[#346896] text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-[#245a78]"
                onClick={handleCopy}
              >
                <FaCopy />
                <span>Copy</span>
              </button>
              <button
                className="bg-[#346896] text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-[#245a78]"
                onClick={handleDownload}
              >
                <FaDownload />
                <span>Download .xml</span>
              </button>
              <button
                className="text-sm text-[#346896] hover:underline"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

       {/* Feedback Modal */}
      {isModalFeedBackOpen && (
        <FeedbackModal
          data={articleData}
          onClose={() => setIsModalFeedBackOpen(false)}
        />
      )}
    </div>
  );
};

export default SectionOneNew;
