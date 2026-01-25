// export const ReuseableInput = ({
//     label,
//     type = "text",
//     value,
//     onChange,
//     placeholder,
//     name,
//     InfoTooltip,
//     error,
//     required,
//     step,
//     min,
//     max,
//     unit,
//     onUnitChange,
//     options = [], // Receive options from parent
// }) => {
//     return (
//         <div className="mb-4">
//             <label className="block text-gray-700 font-semibold mb-2" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
//                 <span>{label}</span> <span>{InfoTooltip}</span>
//             </label>
//             <div className="relative flex items-center">
//                 <input
//                     required={required}
//                     name={name}
//                     type={type}
//                     step={step}
//                     min={min}
//                     max={max}
//                     value={value}
//                     onChange={(e) => onChange(e.target.value, name)}
//                     placeholder={placeholder}
//                     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     autoComplete="off"
//                     style={{ paddingRight: '90px', appearance: 'textfield' }}
//                 />
//                 <select
//                     value={unit}
//                     onChange={(e) => onUnitChange(e.target.value)}
//                     className="absolute right-2 bg-transparent text-gray-600 h-full px-2 rounded-r-lg focus:outline-none"
//                     style={{
//                         width: '70px',
//                         height: '100%',
//                         appearance: 'none',
//                         fontWeight: '500',
//                         border: 'none',
//                         paddingRight: '10px',
//                         cursor: 'pointer'
//                     }}
//                 >
//                     {options.map((option, index) => (
//                         <option key={index} value={option}>
//                             {option}
//                         </option>
//                     ))}
//                 </select>
//                 <span
//                     className="absolute right-1 pointer-events-none"
//                     style={{ top: '50%', transform: 'translateY(-50%)', color: 'gray' }}
//                 >
//                     ▼
//                 </span>
//             </div>
//             <div style={{ color: 'red', fontSize: 14, marginTop: 2, marginLeft: 2 }}>{error}</div>
//         </div>
//     );
// };

import { useState } from "react";
import { FaCheck } from "react-icons/fa";


export const ReuseableInput = ({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    name,
    InfoTooltip,
    error,
    required,
    step,
    min,
    max,
    unit,
    onUnitChange,
    options = [], // Receive options from parent
    readOnly,
    isArrow = true,
    isCheck = true,
    paddingRight,
    width,
    style,
    defaultValue,
    child,
    isSpecialAction = false, // Add isSpecialAction prop
    status, // Add status prop
    onStatusChange, // Add onStatusChange prop
    customStatusComponent
}) => {

    // Separate states for each section
    // const [statusVolume, setStatusVolume] = useState(''); // "estimated" or "assumed"
    // const [statusConcentration, setStatusConcentration] = useState(''); // "estimated" or "assumed"

    // const handleRadioChange = (e, type) => {
    //     const { value } = e.target; // 'estimated' or 'assumed'
    //     if (type === 'volume') {
    //         setStatusVolume(value); // Set status for Volume
    //     } else if (type === 'concentration') {
    //         setStatusConcentration(value); // Set status for Concentration
    //     }
    // 

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
                <span>{label}</span> <span>{InfoTooltip}</span>
            </label> */}
            <div
                className="block text-gray-700 font-semibold mb-2 flex justify-between items-center w-full"
            >
                {/* Left Section: Label & Tooltip */}
                <div className="flex items-center">
                    <span>{label}</span>
                    <span>{InfoTooltip}</span>
                </div>

                {/* Right Section: Radio Buttons */}
                {isSpecialAction && value &&
                    ((isSpecialAction && value)) && (
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
            <div className="relative flex items-center">
                {/* Input Field */}
                <input
                    defaultValue={defaultValue}
                    readOnly={readOnly}
                    required={required}
                    name={name}
                    type={type}
                    step={step}
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => onChange(e.target.value, name)}
                    placeholder={placeholder}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoComplete="off"
                    style={{
                        paddingRight: paddingRight ? paddingRight : "90px", appearance: "textfield",
                        border: value && "2px solid gray",
                        ...style
                    }}
                />
                {/* Check Icon */}
                {/* {value && isCheck && (
                    <FaCheck
                        className="absolute right-20 text-gray-600"
                        style={{
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                        }}
                    />
                )} */}
                {/* Dropdown Unit Selector */}
                <select
                    value={unit}
                    onChange={(e) => onUnitChange(e.target.value)}
                    className="absolute right-2 bg-transparent text-gray-600 h-full px-2 rounded-r-lg focus:outline-none"
                    style={{
                        width: width ? width : "70px",
                        height: "100%",
                        appearance: "none",
                        fontWeight: "500",
                        border: "none",
                        paddingRight: "10px",
                        cursor: "pointer",
                    }}
                >
                    {options.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                {isArrow && <span
                    className="absolute right-1 pointer-events-none"
                    style={{
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "gray",
                    }}
                >
                    ▼
                </span>}
            </div>

            {/* Show checkboxes only when isOptionShow is true */}
            <div>
                {child}
                {/* {isOptionShow && value && (
                <div style={{ marginTop: '8px', fontSize: '12px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', marginRight: '10px' }}>
                        <input
                            type="radio"
                            id={`estimated-${indexInput}-volume`}
                            name={`status-volume-${indexInput}`} 
                            value="estimated"
                            checked={statusVolume === 'estimated'}
                            onChange={(e) => handleRadioChange(e, 'volume')}
                            style={{
                                marginRight: '5px',
                                accentColor: '#4CAF50',
                                cursor: 'pointer'
                            }}
                        />
                        <label htmlFor={`estimated-${indexInput}-volume`} style={{ cursor: 'pointer' }}>Estimated</label>
                    </div>

                  
                    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <input
                            type="radio"
                            id={`assumed-${indexInput}-volume`}
                            name={`status-volume-${indexInput}`} 
                            value="assumed"
                            checked={statusVolume === 'assumed'}
                            onChange={(e) => handleRadioChange(e, 'volume')}
                            style={{
                                marginRight: '5px',
                                accentColor: '#4CAF50',
                                cursor: 'pointer'
                            }}
                        />
                        <label htmlFor={`assumed-${indexInput}-volume`} style={{ cursor: 'pointer' }}>Assumed</label>
                    </div>
                </div>
            )} */}

                {/* {isOptionShow && value && (
                <div style={{ marginTop: '8px', fontSize: '12px' }}>
                   
                    <div style={{ display: 'inline-flex', alignItems: 'center', marginRight: '10px' }}>
                        <input
                            type="radio"
                            id={`estimated-${indexInput}-concentration`}
                            name={`status-concentration-${indexInput}`} // Unique name for this group
                            value="estimated"
                            checked={statusConcentration === 'estimated'}
                            onChange={(e) => handleRadioChange(e, 'concentration')}
                            style={{
                                marginRight: '5px',
                                accentColor: '#4CAF50',
                                cursor: 'pointer'
                            }}
                        />
                        <label htmlFor={`estimated-${indexInput}-concentration`} style={{ cursor: 'pointer' }}>Estimated</label>
                    </div>

                    
                    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <input
                            type="radio"
                            id={`assumed-${indexInput}-concentration`}
                            name={`status-concentration-${indexInput}`} // Unique name for this group
                            value="assumed"
                            checked={statusConcentration === 'assumed'}
                            onChange={(e) => handleRadioChange(e, 'concentration')}
                            style={{
                                marginRight: '5px',
                                accentColor: '#4CAF50',
                                cursor: 'pointer'
                            }}
                        />
                        <label htmlFor={`assumed-${indexInput}-concentration`} style={{ cursor: 'pointer' }}>Assumed</label>
                    </div>
                </div>
            )} */}
            </div>

            {/* Error Message */}
            <div style={{ color: "red", fontSize: 14, marginTop: 2, marginLeft: 2 }}>{error}</div>
        </div >
    );
};
