import React from "react";

export const Input = ({
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
    isCheck = true,
    onBlur,
    style,
    isSpecialAction = false, // Add isSpecialAction prop
    status, // Add status prop
    onStatusChange, // Add onStatusChange prop
    customStatusComponent
}) => {

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.shiftKey) {
            // Handle Shift + Enter specifically
            e.preventDefault();
        } else if (e.key === 'Enter') {
            // Handle Enter alone
            e.preventDefault();
        }
    };

    const handleStatusChange = (newStatus) => {
        if (onStatusChange) {
            onStatusChange(name, newStatus); // Pass field name and new status
        }
    };


    return (
        <div className="mb-4 relative">
            {/* Label */}
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


            {/* Input Field */}
            <input
                required={required}
                name={name}
                type={type}
                step={step}
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(e.target.value, name)}
                placeholder={placeholder}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                    }`}
                autoComplete="off"
                onBlur={onBlur}
                onKeyDown={handleKeyDown}
                style={{
                    border: value && !error && isCheck ? "2px solid gray" : undefined,
                    ...style,
                }}
                multiple
            />

            {/* Error Message */}
            {error && (
                <div
                    style={{
                        color: "red",
                        fontSize: 14,
                        marginTop: 2,
                        marginLeft: 2,
                    }}
                >
                    {error}
                </div>
            )}
        </div>
    );
};
