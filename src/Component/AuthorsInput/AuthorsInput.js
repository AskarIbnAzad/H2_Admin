import { useState, useRef, useEffect } from "react";
import "./AuthorsInput.css";
import { FaCheck } from "react-icons/fa";

export const AuthorsInput = ({ label, value, onChange, InfoTooltip, error, onBlur, name, isCheck = true, }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [inputValue, setInputValue] = useState(value);
    const inputContainerRef = useRef(null);

    // Function to normalize author names
    const normalizeAuthorName = (name) => {
        const nameParts = name.trim().split(" ");
        if (nameParts.length === 1) return name; // Return as-is if single part
        const firstInitial = nameParts[0].charAt(0).toUpperCase() + ".";
        const lastName = nameParts.slice(1).join(" ");
        return `${firstInitial} ${lastName}`;
    };

    // Handle input change
    const handleInputChange = (e) => {
        const input = e.target.value;
        setInputValue(input);

        // Split by commas or semi-colons, normalize, and remove duplicates
        const authorsArray = input.split(/[,;]/).map((name) => normalizeAuthorName(name.trim()));
        const uniqueAuthors = [...new Set(authorsArray)].filter(name => name); // Filter out empty names
        onChange(uniqueAuthors.join(", "), "authors"); // Join with commas

        // Simulate suggestions based on the input (replace with actual API call as needed)
        const lastAuthorPart = authorsArray[authorsArray.length - 1];
        const filteredSuggestions = ["John W. Doe", "T.W. LeBaron", "S. Zhang", "M. Johnson"]
            .filter(s => s.toLowerCase().includes(lastAuthorPart.toLowerCase()) && !uniqueAuthors.includes(s)); // Avoid duplicates
        setSuggestions(filteredSuggestions);
    };

    // Handle author selection from suggestions
    const handleSelectSuggestion = (suggestedName) => {
        const normalizedSuggestedName = normalizeAuthorName(suggestedName);

        // Avoid duplicate entries
        if (inputValue.includes(normalizedSuggestedName)) return;

        // Add selected suggestion as a complete name
        const authorsArray = inputValue.split(/[,;]/);
        authorsArray[authorsArray.length - 1] = normalizedSuggestedName; // Replace last entry with selected name
        const updatedValue = authorsArray.join(", ") + ", "; // Add a comma and space for the next name

        setInputValue(updatedValue);
        onChange(updatedValue, "authors");

        // Reset suggestions after adding the selected author
        setSuggestions([]);
    };

    // Close suggestions when clicking outside the component
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputContainerRef.current && !inputContainerRef.current.contains(event.target)) {
                setSuggestions([]); // Close suggestions
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="mb-4 relative" ref={inputContainerRef}>
            <label className="block text-gray-700 font-semibold mb-2" style={{ display: 'flex', alignItems: 'center' }}>
                <span>{label}</span> <span>{InfoTooltip}</span>
            </label>
            {/* <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder=""
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                    }`}
                style={{ position: "relative" }}
                onBlur={onBlur}
                name={name}
            /> */}
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder=""
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                    }`}
                style={{
                    position: "relative",
                    border: inputValue && !error ? "2px solid gray" : undefined, // Apply gray border if value exists and there's no error
                }}
                onBlur={onBlur}
                name={name}
            />

            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelectSuggestion(suggestion)}
                            className="suggestion-item"
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}


            {error && <div style={{ color: 'red', fontSize: 14, marginTop: 2 }}>{error}</div>}
        </div>
    );
};



// import { useState, useRef, useEffect } from "react";
// import "./AuthorsInput.css";

// export const AuthorsInput = ({ label, value, onChange, InfoTooltip, error }) => {
//     const [suggestions, setSuggestions] = useState([]);
//     const [inputValue, setInputValue] = useState(value || "");
//     const inputContainerRef = useRef(null);

//     // Function to normalize author names to full names consistently
//     const normalizeAuthorName = (name) => {
//         const nameParts = name.trim().split(" ");
//         if (nameParts.length === 1) return name; // Single-part name remains as-is
//         const firstName = nameParts[0];
//         const lastName = nameParts.slice(1).join(" ");
//         return `${firstName} ${lastName}`.trim(); // Always return full name format
//     };

//     // Function to remove duplicates and normalize the names
//     const processAuthors = (input) => {
//         const authorsArray = input.split(/[,;]/).map((name) => name.trim());
//         const normalizedAuthors = authorsArray.map(normalizeAuthorName);

//         // Remove duplicates
//         const uniqueAuthors = [...new Set(normalizedAuthors)].filter(name => name);
//         return uniqueAuthors;
//     };

//     // Handle input change
//     const handleInputChange = (e) => {
//         const input = e.target.value;
//         setInputValue(input);

//         // Process the input to normalize and deduplicate authors
//         const uniqueAuthors = processAuthors(input);

//         // Update parent state
//         onChange(uniqueAuthors.join(", "), "authors");

//         // Generate suggestions for the last author input
//         const lastAuthorPart = input.split(/[,;]/).slice(-1)[0]?.trim().toLowerCase();
//         const filteredSuggestions = ["Tyler W. LeBaron", "T.W. LeBaron", "S. Zhang", "M. Johnson"]
//             .filter(s => s.toLowerCase().includes(lastAuthorPart) && !uniqueAuthors.includes(s));
//         setSuggestions(filteredSuggestions);
//     };

//     // Handle selecting a suggestion
//     const handleSelectSuggestion = (suggestedName) => {
//         const uniqueAuthors = processAuthors(inputValue);

//         // Add the selected suggestion
//         const updatedAuthors = [...uniqueAuthors.slice(0, -1), suggestedName];
//         const updatedValue = updatedAuthors.join(", ") + ", "; // Add a trailing comma for further input

//         setInputValue(updatedValue);
//         onChange(updatedValue, "authors");
//         setSuggestions([]);
//     };

//     // Close suggestions on outside click
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (inputContainerRef.current && !inputContainerRef.current.contains(event.target)) {
//                 setSuggestions([]);
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     return (
//         <div className="mb-4" ref={inputContainerRef}>
//             <label className="block text-gray-700 font-semibold mb-2" style={{ display: "flex", alignItems: "center" }}>
//                 <span>{label}</span> <span>{InfoTooltip}</span>
//             </label>
//             <input
//                 type="text"
//                 value={inputValue}
//                 onChange={handleInputChange}
//                 placeholder="Enter authors (e.g., John Doe, Jane Smith)"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             {suggestions.length > 0 && (
//                 <ul className="suggestions-list">
//                     {suggestions.map((suggestion, index) => (
//                         <li
//                             key={index}
//                             onClick={() => handleSelectSuggestion(suggestion)}
//                             className="suggestion-item"
//                         >
//                             {suggestion}
//                         </li>
//                     ))}
//                 </ul>
//             )}
//             {error && <div style={{ color: "red", fontSize: 14, marginTop: 2 }}>{error}</div>}
//         </div>
//     );
// };
