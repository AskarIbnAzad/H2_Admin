import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ArticlePreviewPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const location = useLocation();
    const article = location.state?.articleToPreview;
    console.log("article", article);

    if (!article) {
        return <div>Loading...</div>;
    }

    const { publicData, articleGeneralData, researcherData, biomaker } = article;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white">
            <button
                onClick={() => window.history.back()}
                className="flex items-center text-blue-500 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg px-4 py-2 transition duration-300 ease-in-out mb-6"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l-7-7 7-7" />
                </svg>
                Back
            </button>

            <h1 className="text-4xl font-semibold text-gray-900 mb-4">{publicData.title}</h1>

            {/* Authors */}
            <p className="text-lg text-gray-600 mb-4">
                <span className="font-medium">Authors:</span> {" "}
                {/* {publicData.authors} */}

                {publicData.authors
                    ? publicData?.authors.map((author, index) => (
                        <span key={index}>
                            {author.name}
                            {index < publicData?.authors.length - 1 && ", "}
                        </span>
                    ))
                    : "N/A"}
            </p>

            {/* Publication Info */}
            <div className="flex flex-wrap mb-6">
                <p className="mr-6 text-gray-600">
                    <span className="font-medium">Published in:</span> {publicData.journal}
                </p>
                <p className="mr-6 text-gray-600">
                    <span className="font-medium">Year:</span> {publicData.year}
                </p>
                <p className="mr-6 text-gray-600">
                    <span className="font-medium">DOI:</span> {publicData.doi}
                </p>
                <p className="text-gray-600">
                    <span className="font-medium">PMID:</span> {publicData.pmid}
                </p>
            </div>

            {/* Abstract */}
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Abstract</h3>
                <p className="text-gray-600">{publicData.abstract}</p>
            </div>

            {/* Article Link */}
            {publicData.pdf_url && <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Download PDF</h3>
                <a
                    href={publicData.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                >
                    Click here to read the full article
                </a>
            </div>}

            {/* Study Information */}
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Study Type</h3>
                <p className="text-gray-600">{articleGeneralData?.studyType?.join(", ")}</p>

                <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Outcome</h3>
                <p className="text-gray-600">{articleGeneralData?.outcome}</p>
            </div>

            {/* Additional Study Details */}
            <div className="mb-6 border-t pt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Study Duration and Details</h3>
                <p className="text-gray-600">
                    <span className="font-medium">Duration of Study:</span> {articleGeneralData?.durationOfStudy} {articleGeneralData?.studyDurationUnit}
                </p>
                <p className="text-gray-600">
                    <span className="font-medium">Research Topic:</span> {articleGeneralData?.researchtopic?.join(", ")}
                </p>
                <p className="text-gray-600">
                    <span className="font-medium">Organ:</span> {articleGeneralData?.organ}
                </p>
            </div>

            {/* Researcher Data */}
            <div className="mb-6 border-t pt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Researcher Data</h3>
                {/* Render researcher data if available */}
                {researcherData?.methodOfAdmin && (
                    <>
                        {/* Method of Administration */}
                        <p className="text-gray-600">
                            <span className="font-medium">Method of Administration:</span> {researcherData?.methodOfAdmin?.join(", ")}
                        </p>

                        {/* Concentrations */}
                        <p className="text-gray-600">
                            <span className="font-medium">Concentrations:</span> {researcherData?.concentrations?.map((conc, index) => (
                                <span key={index}>{conc.value} {conc.unit}</span>
                            ))}
                        </p>

                        {/* Absolute Doses */}
                        <p className="text-gray-600">
                            <span className="font-medium">Absolute Doses:</span> {researcherData?.absoluteDoses?.map((dose, index) => (
                                <span key={index}>{dose.value} {dose.unit}</span>
                            ))}
                        </p>

                        {/* Relative Doses */}
                        <p className="text-gray-600">
                            <span className="font-medium">Relative Doses:</span> {researcherData?.relativeDoses?.map((dose, index) => (
                                <span key={index}>{dose.value} {dose.unit}</span>
                            ))}
                        </p>

                        {/* Other fields (like safety, adverse effects, etc.) */}
                        {researcherData.adverseEffects && (
                            <p className="text-gray-600">
                                <span className="font-medium">Adverse Effects:</span> {researcherData.adverseEffectsDescription}
                            </p>
                        )}
                    </>
                )}
            </div>

            {/* Species Data */}
            {researcherData?.speciesData && Object.keys(researcherData?.speciesData)?.map((species, index) => {
                console.log("species", species);

                return (
                    <div key={index} className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{species}</h3>

                        <p className="text-gray-600">
                            <span className="font-medium">Methods:</span> {researcherData.speciesData[species].methods?.join(", ")}
                        </p>

                        <p className="text-gray-600">
                            <span className="font-medium">Percent Purity:</span> {researcherData.speciesData[species].percentPurity}
                        </p>

                        {/* FlowRate of Hydrogen */}
                        <p className="text-gray-600">
                            <span className="font-medium">Flow Rate of Hydrogen:</span> {researcherData.speciesData[species].FlowRateofHydrogen?.value} {researcherData.speciesData[species].FlowRateofHydrogen?.unit}
                        </p>

                        {/* Frequency of Hydrogen */}
                        <p className="text-gray-600">
                            <span className="font-medium">Frequency of Hydrogen:</span> {researcherData.speciesData[species].FrequencyofHydrogen}
                        </p>

                        {/* Volumes */}
                        <p className="text-gray-600">
                            <span className="font-medium">Volumes:</span> {researcherData.speciesData[species]?.volumes?.map((volume, index) => (
                                <span key={index}>{volume.value} {volume.unit}</span>
                            ))}
                        </p>

                        {/* Concentrations */}
                        <p className="text-gray-600">
                            <span className="font-medium">Concentrations:</span> {researcherData.speciesData[species]?.concentrations?.map((conc, index) => (
                                <span key={index}>{conc.value} {conc.unit}</span>
                            ))}
                        </p>

                        {/* Absolute Doses */}
                        <p className="text-gray-600">
                            <span className="font-medium">Absolute Doses:</span> {researcherData.speciesData[species]?.absoluteDoses?.map((dose, index) => (
                                <span key={index}>{dose.value} {dose.unit}</span>
                            ))}
                        </p>

                        {/* Relative Doses */}
                        <p className="text-gray-600">
                            <span className="font-medium">Relative Doses:</span> {researcherData.speciesData[species]?.relativeDoses?.map((dose, index) => (
                                <span key={index}>{dose.value} {dose.unit}</span>
                            ))}
                        </p>
                    </div>
                );
            })}


            {/* Biomarkers Section */}
            <div className="mb-6 border-t pt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Biomarkers</h3>
                {biomaker?.map((marker, index) => {
                    return <div key={index} className="mb-4">
                        <p className="text-gray-600">
                            <span className="font-medium">Category:</span> {marker?.category?.join(", ")}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Marker:</span> {marker.marker}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Change:</span> {marker?.Change?.join(", ")}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Protein:</span> {marker.Protein || "N/A"}
                        </p>
                    </div>
                })}
            </div>


        </div>
    );
};

export default ArticlePreviewPage;

