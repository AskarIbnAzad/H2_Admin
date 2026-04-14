import { FaCheck } from "react-icons/fa";
import "./internal.css"
export const TimeDurationInput = ({
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
    isSpecialAction = false, // Add isSpecialAction prop
    status, // Add status prop
    onStatusChange // Add onStatusChange prop
}) => {

    const handleStatusChange = (newStatus) => {
        if (onStatusChange) {
            onStatusChange(name, newStatus); // Pass field name and new status
        }
    };
    return (
        <div className="mb-4">

            <div
                className="block text-gray-700 font-semibold mb-2 flex justify-between items-center w-full"
            >
                {/* Left Section: Label & Tooltip */}
                <div className="flex items-center space-x-2">
                    <span>{label}</span>
                    <span>{InfoTooltip}</span>
                </div>

                {/* Right Section: Radio Buttons (Only show if isSpecialAction is true & value is valid) */}
                {isSpecialAction && value && (
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
                )}
            </div>


            <div className="relative flex items-center">
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
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoComplete="off"
                    style={{ paddingRight: '90px', appearance: 'textfield', border: value && "2px solid gray", }}
                />

                {/* Check Icon */}
                <select
                    value={unit?.name}
                    onChange={(e) => onUnitChange(e.target.value)}
                    className="absolute right-2 bg-transparent text-gray-600 h-full px-2 rounded-r-lg focus:outline-none"
                    style={{
                        width: '70px',
                        height: '100%',
                        appearance: 'none',
                        fontWeight: '500',
                        border: 'none',
                        paddingRight: '10px',
                        cursor: 'pointer'
                    }}
                >
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                </select>
                <span
                    className="absolute right-1 pointer-events-none"
                    style={{ top: '50%', transform: 'translateY(-50%)', color: 'gray' }}
                >
                    ▼
                </span>
            </div>
            <div style={{ color: 'red', fontSize: 14, marginTop: 2, marginLeft: 2 }}>{error}</div>
        </div>
    );
};
