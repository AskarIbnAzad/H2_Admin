// import "./internal.css";
// export const ConcentrationInput = ({
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
//     onUnitChange
// }) => {
//     // Function to convert to mg/L
//     const convertToMgL = (value, unit) => {
//         const numericValue = parseFloat(value) || 0; // Parse as a number, default to 0 if NaN

//         if (unit === "mM") {
//             return numericValue * 2; // 1 mM = 2 mg/L
//         } else if (unit === "ppm") {
//             return numericValue; // 1 ppm = 1 mg/L
//         } else if (unit === "ppb") {
//             return numericValue / 1000; // 1000 ppb = 1 mg/L
//         } else if (unit === "µM") {
//             return numericValue * 0.002; // 1 µM = 0.002 mg/L
//         } else if (unit === "L") {
//             return numericValue; // L is not a concentration unit, so we return the value as-is
//         } else {
//             return numericValue; // Default case if the unit is already in mg/L
//         }
//     };

//     // Call the conversion function
//     const convertedValue = convertToMgL(value, unit);


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
//                     <option value="mg/L">mg/L</option>
//                     <option value="mM">mM</option>
//                     <option value="ppm">ppm</option>
//                     <option value="ppb">ppb</option>
//                     <option value="µM">µM</option>
//                     <option value="L">L</option>
//                 </select>
//                 <span
//                     className="absolute right-1 pointer-events-none"
//                     style={{ top: '50%', transform: 'translateY(-50%)', color: 'gray' }}
//                 >
//                     ▼
//                 </span>
//             </div>
//             <div style={{ color: 'red', fontSize: 14, marginTop: 2, marginLeft: 2 }}>{error}</div>
//             <div className="mt-2 text-gray-700" style={{fontWeight:'bold',fontSize:'14px'}}>
//                 Converted Value (mg/L): {convertedValue} mg/L
//             </div>
//         </div>
//     );
// };




import { FaCheck } from "react-icons/fa";
import "./internal.css";

export const ConcentrationInput = ({
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
    unitOptions = [],
    isConvertRatio = true,
    isArrow = true,
    width,
    paddingRight,
    disabled,
    defaultValue
}) => {
    // Function to convert to mg/L
    const convertToMgL = (value, unit) => {
        const numericValue = parseFloat(value) || 0; // Parse as a number, default to 0 if NaN

        if (unit === "mM") {
            return numericValue * 2; // 1 mM = 2 mg/L
        } else if (unit === "ppm") {
            return numericValue; // 1 ppm = 1 mg/L
        } else if (unit === "ppb") {
            return numericValue / 1000; // 1000 ppb = 1 mg/L
        } else if (unit === "µM") {
            return numericValue * 0.002; // 1 µM = 0.002 mg/L
        } else if (unit === "L") {
            return numericValue; // L is not a concentration unit, so we return the value as-is
        } else {
            return numericValue; // Default case if the unit is already in mg/L
        }
    };

    // Call the conversion function
    const convertedValue = convertToMgL(value, unit);

    return (
        <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <span>{label}</span> <span>{InfoTooltip}</span>
            </label>
            <div className="relative flex items-center">
                <input
                    defaultValue={defaultValue}
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
                    style={{ paddingRight: '90px', appearance: 'textfield' }}
                />
                {/* Check Icon */}
                {value && (
                    <FaCheck
                        className="absolute right-20 text-green-500"
                        style={{
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                        }}
                    />
                )}
                <select
                    disabled={disabled}
                    value={unit}
                    onChange={(e) => onUnitChange(e.target.value)}
                    className={`absolute right-2 bg-transparent text-gray-600 h-full px-2 rounded-r-lg focus:outline-none`}
                    style={{
                        width: width ? width : '70px',
                        height: '100%',
                        appearance: 'none',
                        fontWeight: '500',
                        border: 'none',
                        paddingRight: paddingRight ? paddingRight : '10px',
                        cursor: 'pointer'
                    }}
                >
                    {unitOptions?.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                {isArrow && <span
                    className="absolute right-1 pointer-events-none"
                    style={{ top: '50%', transform: 'translateY(-50%)', color: 'gray' }}
                >
                    ▼
                </span>}
            </div>
            <div style={{ color: 'red', fontSize: 14, marginTop: 2, marginLeft: 2 }}>{error}</div>
            {isConvertRatio && <div className="mt-2 text-gray-700" style={{ fontWeight: 'bold', fontSize: '14px' }}>
                Converted Value (mg/L): {convertedValue} mg/L
            </div>}
        </div>
    );
};
