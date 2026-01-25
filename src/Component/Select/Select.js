export const Select = ({ label, options, value, onChange, required = false, name }) => {
    return (
        <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">{label}</label>
            <select
                name={name}
                value={value}
                onChange={(e) => onChange(e.target.value, name)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={required}
            >
                <option value="" disabled>{`Please Select ${label}`}</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};
