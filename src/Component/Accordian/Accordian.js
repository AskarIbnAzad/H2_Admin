// import { colorTheme } from "../../Utils/colortheme";

// export const Accordion = ({ title, children, isOpen, onToggle }) => {
//     const handleToggle = (event) => {
//         event.stopPropagation(); 
//         onToggle(); 
//     };

//     return (
//         <div className="border border-gray-300 rounded-lg shadow-sm mb-4">
//             <button
//                 type="button" // Set button type to "button" to prevent it from acting as a submit button in the form
//                 onClick={handleToggle}
//                 className="w-full text-left px-4 py-2 flex justify-between items-center bg-blue-100 rounded-t-lg hover:bg-blue-200 focus:outline-none"
//                 style={{ color: colorTheme.primary, fontWeight: 'bold' }}
//             >
//                 <span>{title}</span>
//                 <span>{isOpen ? '-' : '+'}</span>
//             </button>
//             {isOpen && (
//                 <div className="p-4 bg-white border-t border-gray-200">
//                     {children}
//                 </div>
//             )}
//         </div>
//     );
// };


import { colorTheme } from "../../Utils/colortheme";

export const Accordion = ({
    title,
    children,
    isOpen,
    onToggle,
    bgColor = "rgb(0, 76, 120)", // Default background color
    textColor = "white", // Default text color
    defaultStyle = false // Flag to use original styling
}) => {
    const handleToggle = (event) => {
        event.stopPropagation();
        onToggle();
    };

    return (
        <div className="border border-gray-300 rounded-lg shadow-sm mb-4">
            <button
                type="button"
                onClick={handleToggle}
                className="w-full text-left px-4 py-2 flex justify-between items-center hover:bg-blue-200 focus:outline-none"
                style={
                    defaultStyle
                        ? {
                              color: colorTheme.primary,
                              fontWeight: "bold",
                              backgroundColor: "rgb(191 219 254)",
                          }
                        : {
                              backgroundColor: bgColor,
                              color: textColor,
                              fontWeight: "bold",
                              borderTopLeftRadius:'7px',
                              borderTopRightRadius:'7px'
                          }
                }
            >
                <span>{title}</span>
                <span>{isOpen ? "-" : "+"}</span>
            </button>
            {isOpen && (
                <div className="p-4 bg-white border-t border-gray-200">
                    {children}
                </div>
            )}
        </div>
    );
};
