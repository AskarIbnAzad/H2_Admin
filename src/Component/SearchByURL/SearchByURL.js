import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { apiHandle } from "../../Config/ApiHandle/apiHandle";
import { add_country_service_auth } from "../../Services/SpecieService";

const SearchByURL = ({ setFormData, colorTheme, setIsArticleInfoOpen, setArticleLoading, onTitleChange }) => {
    const dispatch = useDispatch();
    const { get_country_data } = useSelector((state) => state.species);
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [cancelToken] = useState(axios.CancelToken.source());

    // Updated country processing function
    const processCountries = (countriesString) => {
        if (!countriesString) return [];

        return countriesString.split(",").reduce((acc, country) => {
            const trimmedCountry = country.trim();

            // Find existing country with exact match
            const existingCountry = get_country_data?.countries?.find(
                c => c.name.toLowerCase() === trimmedCountry.toLowerCase()
            );

            if (existingCountry) {
                // Only include if status is Approved
                if (existingCountry.status === "Approved") {
                    acc.push({
                        name: trimmedCountry,
                        status: "Unverified" // या existingCountry.status अगर original status रखना हो
                    });
                }
            } else {
                // New country: Add to DB but not to formData
                dispatch(add_country_service_auth({
                    name: trimmedCountry,
                    status: "Pending"
                }));
            }

            return acc;
        }, []);
    };

    const fetchDataFromURL = async () => {
        setLoading(true);
        setArticleLoading(true);
        setError("");

        try {
            const response = await apiHandle.post("bot-scrapper-80", { url }, {
                timeout: 60000,
                cancelToken: cancelToken.token
            });

            const data = response.data?.data;
            setIsArticleInfoOpen(true);

            console.log("bot-scrapper-80", data);


            // Process countries (only existing ones will be included)
            const processedAuthorsCountries = processCountries(data.authorsCountry);
            const processedResearchCountries = processCountries(data.researchCountries);

            // Grant Country Logic
            let grantCountry = {};
            if (data.grantCountry) {
                const processedGrantCountry = processCountries(data.grantCountry);
                if (processedGrantCountry.length > 0) {
                    grantCountry = { grantCountry: processedGrantCountry[0] };
                }
            }


            // Authors logic
            const authorsLibraryResponse = await apiHandle.get("get-authors");
            const authorsLibrary = authorsLibraryResponse?.data?.authors;
            const authorsArray = data.authors?.split(",").map(author => {
                const trimmedAuthor = author.trim();
                const matchedAuthor = authorsLibrary.find(
                    a => a.name.toLowerCase() === trimmedAuthor.toLowerCase()
                );
                return {
                    name: trimmedAuthor,
                    parent_id: matchedAuthor?.id || 1
                };
            }) || [];

            // Abstract sanitization
            const sanitizeHTML = (html) =>
                new DOMParser().parseFromString(html, "text/html").body.innerText || "";
            const sanitizedAbstract = sanitizeHTML(data.abstract || "");

            const rawPmid = data.pmid ?? "";
            const pmidString = Array.isArray(rawPmid)
                ? rawPmid.join(",")    // or rawPmid[0] if you only ever want the first element
                : String(rawPmid);

                console.log("pmidString", pmidString);
                
            // Update formData
            const newFormData = {
                title: { name: data.title || "", status: "Unverified" },
                authors: authorsArray,
                year: { name: data.year ? parseInt(data.year, 10) : "", status: "Unverified" },
                country: processedAuthorsCountries,
                ...grantCountry,
                researchCountry: processedResearchCountries,
                pmid: { name: pmidString, status: "Unverified" },
                doi: { name: data.doi || "", status: "Unverified" },
                abstract: { name: sanitizedAbstract, status: "Unverified" },
                publisher: { name: data.publisher || "", status: "Unverified" },
                journal: { name: data.journal || "", status: "Unverified" },
                journalURL: { name: data.journalURL || "", status: "Unverified" },
                volume: { name: data.Volume || "", status: "Unverified" },
                pages: { name: data.pages || "", status: "Unverified" },
                impactFactor: { name: data.impactFactor || "", status: "Unverified" },
                HIndex: { name: data.HIndex || "", status: "Unverified" },
                sciMAGO: { name: data.sciMAGO || "", status: "Unverified" },
                pdf_url: []
            };
            
            setFormData(newFormData);
            
            // Check for existing article if title exists and onTitleChange is provided
            if (data.title && onTitleChange) {
                await onTitleChange({ name: data.title, status: "Unverified" });
            }

        } catch (err) {
            setError(axios.isCancel(err)
                ? "Request canceled"
                : "We're unable to retrieve data from this page. The website has restricted access.");
        } finally {
            setLoading(false);
            setArticleLoading(false);
        }
    };

    return (
        <div className="mb-6">
            <label className="block text-gray-700 mb-2">Search by URL</label>
            <div className="flex items-center">
                <input
                    type="text"
                    className="border px-4 py-2 rounded w-full mr-4"
                    placeholder="Search by URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <button
                    type="button"
                    className="text-white py-2 px-4 rounded"
                    style={{ backgroundColor: colorTheme.primary }}
                    onClick={fetchDataFromURL}
                    disabled={loading}
                >
                    {loading ? (
                        <div className="flex items-center">
                            <span className="mr-2">Searching...</span>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        </div>
                    ) : "Search"}
                </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default SearchByURL;