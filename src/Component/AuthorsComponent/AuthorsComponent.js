// import React, { useState, useEffect } from "react";
// import CreatableSelect from "react-select/creatable";
// import { apiHandle } from "../../Config/ApiHandle/apiHandle";

// const AuthorsComponent = ({
//   label,
//   value = [],
//   onChange,
//   InfoTooltip,
//   errorMessage,
//   required,
//   error,
//   placeholder,
//   defaultValue,
//   onBlur,
//   isSpecialAction = false, // Add isSpecialAction prop
//   status, // Add status prop
//   onStatusChange, // Add onStatusChange prop
//   name
// }) => {
//   const [authors, setAuthors] = useState([]);
//   const [selectedAuthors, setSelectedAuthors] = useState(value);


//   useEffect(() => {
//     if (JSON.stringify(selectedAuthors) !== JSON.stringify(value)) {
//       setSelectedAuthors(
//         value.map(author => ({
//           ...author,
//           status: author.status || "Unverified" // Ensure status defaults to Unverified
//         }))
//       );
//     }
//   }, [value]);



//   useEffect(() => {
//     const fetchAuthors = async () => {
//       try {
//         const response = await apiHandle.get(
//           "get-authors"
//         );
//         const authorsList = response.data.authors.map((author) => {
//           return {
//             name: author.name,
//             parent_id: author.id
//           }
//         })


//         setAuthors(authorsList);
//       } catch (error) {
//         console.error("Error fetching authors:", error);
//       }
//     };

//     fetchAuthors();
//   }, []);

//   const handleChange = (newValue) => {
//     const updatedAuthors = newValue.map((item) => ({
//       name: item.__isNew__ ? item.value : item.name,
//       parent_id: item.__isNew__ ? 1 : item.parent_id,
//       status: item.status || "Unverified" // Ensure status is always set
//     }));

//     setSelectedAuthors(updatedAuthors);

//     if (onChange) {
//       onChange(updatedAuthors);
//     }
//   };



//   const handleStatusChange = (newStatus) => {
//     const updatedAuthors = selectedAuthors.map(author => ({
//       ...author,
//       status: newStatus, // Update only status
//     }));

//     setSelectedAuthors(updatedAuthors);

//     if (onStatusChange) {
//       onStatusChange(updatedAuthors); // Pass updated authors list
//     }
//   };



//   return (
//     <div className="mb-4">
//       {/* <label
//         className="block text-gray-700 font-semibold mb-2"
//         style={{ display: "flex", alignItems: "center", width: "100%" }}
//       >
//         <span>{label}</span>
//         <span>{InfoTooltip}</span>
//         {isSpecialAction && selectedAuthors.length > 0 && (
//           <div className="ml-4 flex items-center space-x-2">
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 name="authors-status"
//                 value="Verified"
//                 checked={selectedAuthors.length > 0 && selectedAuthors.every(author => author.status === "Verified")}
//                 onChange={() => handleStatusChange("Verified")}
//               />
//               <span>Verified</span>
//             </label>
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 name="authors-status"
//                 value="Unverified"
//                 checked={selectedAuthors.length === 0 || selectedAuthors.every(author => !author.status || author.status === "Unverified")}
//                 onChange={() => handleStatusChange("Unverified")}
//               />
//               <span>Unverified</span>
//             </label>
//           </div>
//         )}

//       </label> */}

//       <div
//         className="block text-gray-700 font-semibold mb-2 flex justify-between items-center w-full"
//       >
//         {/* Left Section: Label & Tooltip */}
//         <div className="flex items-center space-x-2">
//           <span>{label}</span>
//           <span>{InfoTooltip}</span>
//         </div>

//         {/* Right Section: Radio Buttons */}
//         {isSpecialAction && selectedAuthors.length > 0 && (
//           <div className="flex items-center space-x-4">
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 name="authors-status"
//                 value="Verified"
//                 checked={selectedAuthors.length > 0 && selectedAuthors.every(author => author.status === "Verified")}
//                 onChange={() => handleStatusChange("Verified")}
//                 className="mr-1"
//               />
//               <span>Verified</span>
//             </label>
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 name="authors-status"
//                 value="Unverified"
//                 checked={selectedAuthors.length === 0 || selectedAuthors.every(author => !author.status || author.status === "Unverified")}
//                 onChange={() => handleStatusChange("Unverified")}
//                 className="mr-1"
//               />
//               <span>Unverified</span>
//             </label>
//           </div>
//         )}
//       </div>


//       <CreatableSelect
//         isMulti
//         required={required}
//         onChange={handleChange}
//         options={authors.map((author) => ({
//           label: author.name,
//           value: author.name,
//           name: author.name,
//           parent_id: author.parent_id,
//         }))}
//         value={selectedAuthors.map((author) => ({
//           label: author.name,
//           value: author.name,
//           name: author.name,
//           parent_id: author.parent_id,
//         }))}
//         className="basic-multi-select"
//         classNamePrefix="react-select"
//         placeholder={placeholder || `Select ${label}`}
//         defaultInputValue={defaultValue}
//         onBlur={onBlur}
//         formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
//         styles={{
//           control: (base, state) => {
//             const hasValue = Array.isArray(selectedAuthors) ? selectedAuthors.length > 0 : !!selectedAuthors;

//             return {
//               ...base,
//               border: error
//                 ? "2px solid red"
//                 : hasValue
//                   ? "2px solid gray"
//                   : "1px solid #ccc",
//               boxShadow: state.isFocused
//                 ? error
//                   ? "0 0 0 2px rgba(255, 0, 0, 0.5)"
//                   : "0 0 0 2px rgba(128, 128, 128, 0.5)"
//                 : "none",
//               transition: "all 0.2s ease",
//               "&:hover": {
//                 borderColor: error ? "red" : "gray",
//               },
//             };
//           },
//         }}
//       />
//       <div style={{ color: "red", fontSize: 14, marginTop: 2, marginLeft: 2 }}>
//         {error}
//       </div>
//       {errorMessage && (
//         <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
//       )}
//     </div>
//   );
// };

// export default AuthorsComponent;


import React, { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import { apiHandle } from "../../Config/ApiHandle/apiHandle";

const AuthorsComponent = ({
  label,
  value = [],
  onChange,
  InfoTooltip,
  errorMessage,
  required,
  error,
  placeholder,
  defaultValue,
  onBlur,
  isSpecialAction = false,
  status,
  onStatusChange,
  name
}) => {
  const [authors, setAuthors] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState(value);
  const [affiliations, setAffiliations] = useState({}); // State to store affiliations

  useEffect(() => {
    if (JSON.stringify(selectedAuthors) !== JSON.stringify(value)) {
      setSelectedAuthors(
        value.map(author => ({
          ...author,
          status: author.status || "Unverified" // Ensure status defaults to Unverified
        }))
      );
    }
  }, [value]);

  useEffect(() => {
    const initialAffiliations = {};
    value.forEach(author => {
      initialAffiliations[author.name] = author.affiliation || "";
    });
    setAffiliations(initialAffiliations);
  }, [value]);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await apiHandle.get("get-authors");
        const authorsList = response.data.authors.map((author) => {
          return {
            name: author.name,
            parent_id: author.id
          };
        });
        setAuthors(authorsList);
      } catch (error) {
        console.error("Error fetching authors:", error);
      }
    };

    fetchAuthors();
  }, []);


  const handleChange = (newValue) => {
    const updatedAuthors = newValue.map((item) => {
      const authorName = item.__isNew__ ? item.value : item.name;
      return {
        name: authorName,
        parent_id: item.__isNew__ ? 1 : item.parent_id,
        status: item.status || "Unverified",
        affiliation: affiliations[authorName] || "" // Preserve existing affiliation
      };
    });

    setSelectedAuthors(updatedAuthors);
    if (onChange) onChange(updatedAuthors);
  };

  const handleAffiliationChange = (authorName, affiliation) => {
    setAffiliations(prev => ({
      ...prev,
      [authorName]: affiliation
    }));

    const updatedAuthors = selectedAuthors.map(author =>
      author.name === authorName ? { ...author, affiliation } : author
    );

    setSelectedAuthors(updatedAuthors);
    if (onChange) onChange(updatedAuthors);
  };

  // const handleAffiliationChange = (index, affiliation) => {
  //   const updatedAuthors = [...selectedAuthors];
  //   updatedAuthors[index].affiliation = affiliation;
  //   setSelectedAuthors(updatedAuthors);

  //   if (onChange) {
  //     onChange(updatedAuthors);
  //   }
  // };

  const handleStatusChange = (newStatus) => {
    const updatedAuthors = selectedAuthors.map(author => ({
      ...author,
      status: newStatus, // Update only status
    }));

    setSelectedAuthors(updatedAuthors);

    if (onStatusChange) {
      onStatusChange(updatedAuthors); // Pass updated authors list
    }
  };

  const [expandedAuthors, setExpandedAuthors] = useState({});
  const [visibleAuthorsCount, setVisibleAuthorsCount] = useState(5);

  const toggleAuthor = (authorName) => {
    setExpandedAuthors(prev => ({
      ...prev,
      [authorName]: !prev[authorName]
    }));
  };

  const loadmorefunction = (event) => {
    event.preventDefault()
    setVisibleAuthorsCount(prev => prev + 5)
  }
  return (
    <div className="mb-4">
      <div className="block text-gray-700 font-semibold mb-2 flex justify-between items-center w-full">
        {/* Left Section: Label & Tooltip */}
        <div className="flex items-center space-x-2">
          <span>{label}</span>
          <span>{InfoTooltip}</span>
        </div>

        {/* Right Section: Radio Buttons */}
        {isSpecialAction && selectedAuthors.length > 0 && (
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="authors-status"
                value="Verified"
                checked={selectedAuthors.length > 0 && selectedAuthors.every(author => author.status === "Verified")}
                onChange={() => handleStatusChange("Verified")}
                className="mr-1"
              />
              <span>Verified</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="authors-status"
                value="Unverified"
                checked={selectedAuthors.length === 0 || selectedAuthors.every(author => !author.status || author.status === "Unverified")}
                onChange={() => handleStatusChange("Unverified")}
                className="mr-1"
              />
              <span>Unverified</span>
            </label>
          </div>
        )}
      </div>

      <CreatableSelect
        isMulti
        required={required}
        onChange={handleChange}
        options={authors.map((author) => ({
          label: author.name,
          value: author.name,
          name: author.name,
          parent_id: author.parent_id,
        }))}
        value={selectedAuthors.map((author) => ({
          label: author.name,
          value: author.name,
          name: author.name,
          parent_id: author.parent_id,
        }))}
        className="basic-multi-select"
        classNamePrefix="react-select"
        placeholder={placeholder || `Select ${label}`}
        defaultInputValue={defaultValue}
        onBlur={onBlur}
        formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
        styles={{
          control: (base, state) => {
            const hasValue = Array.isArray(selectedAuthors) ? selectedAuthors.length > 0 : !!selectedAuthors;

            return {
              ...base,
              border: error
                ? "2px solid red"
                : hasValue
                  ? "2px solid gray"
                  : "1px solid #ccc",
              boxShadow: state.isFocused
                ? error
                  ? "0 0 0 2px rgba(255, 0, 0, 0.5)"
                  : "0 0 0 2px rgba(128, 128, 128, 0.5)"
                : "none",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: error ? "red" : "gray",
              },
            };
          },
        }}
      />
      <label
        className="block text-gray-700 font-semibold mb-2 mt-4"
        htmlFor={`affiliation`}
      >
        Affiliations
      </label>

      {selectedAuthors.slice(0, visibleAuthorsCount).map((author) => (
        <div key={author.name} className="my-3 border rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => toggleAuthor(author.name)}
            className="w-full p-3 bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
          >
            <span className="font-medium">{author.name}</span>
            <svg
              className={`w-5 h-5 transform transition-transform ${expandedAuthors[author.name] ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div className={`px-4 overflow-hidden transition-all duration-300 ${expandedAuthors[author.name] ? 'py-3 max-h-40' : 'max-h-0 py-0'}`}>
            <input
              type="text"
              value={author.affiliation || ""}
              onChange={(e) => handleAffiliationChange(author.name, e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter Affiliation"
            />
          </div>
        </div>
      ))}

      {/* Show More बटन */}
      {selectedAuthors.length > visibleAuthorsCount && (
        <div className="mt-4 text-center">
          <button
            onClick={loadmorefunction}
            className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Show More ({selectedAuthors.length - visibleAuthorsCount} remaining)
          </button>
        </div>
      )}
      {/* Render affiliation inputs for each author */}
      {/* {selectedAuthors.map((author, index) => (
        <div key={index} className="mb-4 mt-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor={`affiliation-${index}`}
          >
            {author.name} Affiliation
          </label>
          <input
            type="text"
            id={`affiliation-${index}`}
            value={author.affiliation || ""}
            onChange={(e) => handleAffiliationChange(author.name, e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="Enter affiliation"
            style={{
              border: author.affiliation ? "2px solid gray" : undefined,
          }}
          />
        </div>
      ))} */}

      <div style={{ color: "red", fontSize: 14, marginTop: 2, marginLeft: 2 }}>
        {error}
      </div>
      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
    </div>
  );
};

export default AuthorsComponent;