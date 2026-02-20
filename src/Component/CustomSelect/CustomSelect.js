import React, { useState, useEffect, useMemo } from "react";
import CreatableSelect from "react-select/creatable";

export const CustomCreatableSelect = ({
  label,
  options,
  value = [],
  onChange,
  name,
  isMulti = false,
  InfoTooltip,
  isCreate = true,
  handleAddSpecies,
  required,
  error,
  placeholder,
  defaultValue,
  onBlur,
  isDisabled,
  isSpecialAction = false, // Add isSpecialAction prop
  status, // Add status prop
  onStatusChange, // Add onStatusChange prop
  customStatusComponent,
  customLabelMap = {},
  showNaOption = true,
}) => {
  // const [selectOptions, setSelectOptions] = useState([]);

  // useEffect(() => {
  //   if (options?.length) {
  //     const mappedOptions = options.map((option) => ({
  //       label: option,
  //       value: option,
  //     }));
  //     // Add "Not Applicable (N/A)" option dynamically
  //     setSelectOptions([{ label: "Not Applicable (N/A)", value: "N/A" }, ...mappedOptions]);
  //   }
  // }, [options]);
  const selectOptions = useMemo(() => {
    if (!options || !options.length) {
      // If no options but you still want N/A
      if (showNaOption) {
        return [
          {
            label: customLabelMap["N/A"] || "Not Applicable (N/A)",
            value: "N/A",
          },
        ];
      }
      return [];
    }

    const mappedOptions = options.map((option) => ({
      label: customLabelMap[option] || option,
      value: option,
    }));

    const naOption = {
      label: customLabelMap["N/A"] || "Not Applicable (N/A)",
      value: "N/A",
    };

    return showNaOption ? [naOption, ...mappedOptions] : mappedOptions;
  }, [options, customLabelMap, showNaOption]);

  // useEffect(() => {
  //   if (options?.length) {
  //     const mappedOptions = options.map((option) => ({
  //       label: customLabelMap[option] || option, // Use mapped label if available
  //       value: option, // Keep original value
  //     }));

  //     // Add N/A option with mapping
  //     const naOption = {
  //       label: customLabelMap["N/A"] || "Not Applicable (N/A)",
  //       value: "N/A"
  //     };

  //     setSelectOptions([naOption, ...mappedOptions]);
  //   }
  // }, [options, customLabelMap]); 

  const [errorMessage, setErrorMessage] = useState("");

  const isSimilarOptionExists = (inputValue) => {
    const lowerInput = inputValue.toLowerCase();
    return selectOptions.some(
      (option) =>
        option.value.toLowerCase().includes(lowerInput) ||
        lowerInput.includes(option.value.toLowerCase())
    );
  };

  const handleChange = (selectedOptions) => {
    setErrorMessage("");
    if (isMulti) {
      const values = selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [];
      onChange(values, name);
    } else {
      const value = selectedOptions ? selectedOptions.value : "";
      onChange(value, name);
    }
  };

  const handleCreate = (inputValue) => {
    if (isSimilarOptionExists(inputValue)) {
      setErrorMessage(`The option "${inputValue}" is too similar to an existing option.`);
      return;
    }

    // Inform parent to save / add the new option (e.g., Redux / API)
    if (handleAddSpecies) {
      handleAddSpecies(inputValue);
    }

    // Immediately set selected value in the form
    if (isMulti) {
      const current = Array.isArray(value) ? value : [];
      onChange([...current, inputValue], name);
    } else {
      onChange(inputValue, name);
    }

    setErrorMessage("");
  };


  const isValidNewOption = (inputValue) => {
    return isCreate && inputValue && !isSimilarOptionExists(inputValue);
  };


  const handleStatusChange = (newStatus) => {
    if (onStatusChange) {
      onStatusChange(name, newStatus); // Pass field name and new status
    }
  };


  return (
    <div className="mb-4">

      {/* <label
        className="block text-gray-700 font-semibold mb-2"
        style={{ display: "flex", alignItems: "center", width: "100%" }}
      >
        <span>{label}</span>
        <span>{InfoTooltip}</span>
        {isSpecialAction && value &&
          ((Array.isArray(value) && value.length > 0) ||
            (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length > 0)) && (
            <div className="ml-4 flex items-center space-x-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`${name}-status`}
                  value="Verified"
                  checked={status === "Verified"}
                  onChange={() => handleStatusChange("Verified")}
                  className="mr-1"
                />
                <span>Verified</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`${name}-status`}
                  value="Unverified"
                  checked={status === "Unverified"}
                  onChange={() => handleStatusChange("Unverified")}
                  className="mr-1"
                />
                <span>Unverified</span>
              </label>
            </div>
          )}
      </label> */}

      <div
        className="block text-gray-700 font-semibold mb-2 flex justify-between items-center w-full"
      >
        {/* Left Section: Label & Tooltip */}
        <div style={{ width: '100%' }}>
          <span style={{ display: 'inline', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
            {label}
            {InfoTooltip && <span style={{ marginLeft: 6, marginTop: -2, verticalAlign: 'middle', display: 'inline-block' }}>{InfoTooltip}</span>}
          </span>
        </div>

        {/* Right Section: Radio Buttons (Only show if isSpecialAction is true & value is valid) */}
        {isSpecialAction && value &&
          ((Array.isArray(value) && value.length > 0) ||
            (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length > 0)) && (
            customStatusComponent ? (
              customStatusComponent // Render parent-provided custom component
            ) : (
              // Default Verified/Unverified buttons
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`${name}-status`}
                    value="Verified"
                    checked={status === "Verified"}
                    onChange={() => handleStatusChange("Verified")}
                    className="mr-1"
                  />
                  <span>Verified</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`${name}-status`}
                    value="Unverified"
                    checked={status === "Unverified"}
                    onChange={() => handleStatusChange("Unverified")}
                    className="mr-1"
                  />
                  <span>Unverified</span>
                </label>
              </div>
            )
          )}
      </div>


      <CreatableSelect
        required={required}
        isMulti={isMulti}
        isSearchable
        onChange={handleChange}
        onCreateOption={isCreate ? handleCreate : undefined}
        options={selectOptions}
        isOptionDisabled={isDisabled}
        // value={
        //   isMulti
        //     ? selectOptions.filter(option => Array.isArray(value) && value.some(val => val.name === option.value))
        //     : selectOptions.find(option => option.value === value?.name)
        // }
        value={
          isMulti
            ? selectOptions.filter(option =>
              // Case 1: If value is an array of objects with 'name'
              Array.isArray(value) && value.some(val =>
                typeof val === 'object' && val?.name
                  ? String(val.name).toLowerCase() === String(option.value).toLowerCase()
                  : val && typeof val === 'string'
                    ? val.toLowerCase() === String(option.value).toLowerCase()
                    : false
              )
            )
            : selectOptions.find(option =>
              typeof value === 'object' && value?.name
                ? String(option.value).toLowerCase() === String(value.name).toLowerCase()
                : value && typeof value === 'string'
                  ? String(option.value).toLowerCase() === value.toLowerCase()
                  : false
            )
        }

        className="basic-multi-select"
        classNamePrefix="select"
        placeholder={placeholder ? placeholder : `Select ${label}`}
        isValidNewOption={isValidNewOption}
        defaultInputValue={defaultValue}
        onBlur={onBlur}
        styles={{
          control: (base, state) => {
            const hasValue = Array.isArray(value) ? value.length > 0 : !!value; // Handle both single and multi-select values

            return {
              ...base,
              border: error
                ? "2px solid red" // Red border for errors
                : hasValue
                  ? "2px solid gray" // Gray border for valid values
                  : "1px solid #ccc", // Default border
              boxShadow: state.isFocused
                ? error
                  ? "0 0 0 2px rgba(255, 0, 0, 0.5)" // Red focus ring for errors
                  : "0 0 0 2px rgba(128, 128, 128, 0.5)" // Gray focus ring for valid values
                : "none",
              transition: "all 0.2s ease", // Smooth transitions for hover and focus
              "&:hover": {
                borderColor: error ? "red" : "gray", // Adjust hover border dynamically
              },
            };
          },
        }}
      />
      <div style={{ color: "red", fontSize: 14, marginTop: 2, marginLeft: 2 }}>{error}</div>
      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
    </div>
  );
};
