import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { colorTheme } from '../../Utils/colortheme';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setShowCellCultureTissuesStatus, setShowConcernReportStatus, setShowIngestionStatus, setShowInhalationStatus, setShowTopicalApplicationsStatus } from '../../Store/slices/Study_type_slice';

const Stepper = ({ activeStep, setActiveStep, completedSteps = [] }) => {
    const steps = ['Article Citation Information', 'Article General Data', 'Article Specific Information', 'Biomarker'];
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const navigateHandle = () => {
        // navigate("/articles")
        window.history.back()
        dispatch(setShowConcernReportStatus(false));
        dispatch(setShowInhalationStatus(false));
        dispatch(setShowIngestionStatus(false));
        dispatch(setShowCellCultureTissuesStatus(false));
        dispatch(setShowTopicalApplicationsStatus(false));
    }

    const handleStepClick = (stepIndex) => {
        // Only allow clicking on:
        // 1. Previous steps (stepIndex < activeStep)
        // 2. Completed steps (stepIndex in completedSteps array)
        // 3. Current step (stepIndex === activeStep)
        if (stepIndex <= activeStep || completedSteps.includes(stepIndex)) {
            setActiveStep(stepIndex);
        }
    };

    const isStepClickable = (stepIndex) => {
        return stepIndex <= activeStep || completedSteps.includes(stepIndex);
    };

    const getStepStyles = (stepIndex) => {
        const isClickable = isStepClickable(stepIndex);
        const isActive = activeStep === stepIndex;
        const isCompleted = completedSteps.includes(stepIndex);
        
        return {
            container: `flex flex-col items-center transition-all duration-200 ${
                isClickable 
                    ? 'cursor-pointer hover:scale-105' 
                    : 'cursor-not-allowed opacity-50'
            } ${
                isActive ? 'text-blue-800' : isClickable ? 'text-gray-500 hover:text-blue-600' : 'text-gray-400'
            }`,
            circle: {
                border: `1px solid ${
                    isActive ? colorTheme.primary : 
                    isCompleted ? colorTheme.primary : 
                    isClickable ? "gray" : "#ccc"
                }`,
                backgroundColor: 
                    isActive ? colorTheme.primary : 
                    isCompleted ? colorTheme.primary : 
                    isClickable ? "lightgray" : "#f5f5f5",
                color: 
                    isActive ? "white" : 
                    isCompleted ? "white" : 
                    isClickable ? "black" : "#999",
            },
            circleClass: `h-10 w-10 flex items-center justify-center rounded-full border-2 transition-all duration-200 ${
                isClickable && !isActive ? 'hover:bg-gray-300 hover:border-blue-400' : ''
            }`,
            text: {
                color: isActive || isCompleted ? colorTheme.primary : isClickable ? colorTheme.primary : "#ccc"
            }
        };
    };

    return (
        <div className="flex justify-between items-center mb-8">
            {/* Back Button with Arrow Icon */}
            <button
                onClick={navigateHandle}
                className="flex items-center text-blue-500 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg px-4 py-2 transition duration-300 ease-in-out"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l-7-7 7-7" />
                </svg>
                Back
            </button>

            {/* Stepper Tabs */}
            <div className="flex justify-center gap-10" style={{ marginLeft: "-1em" }}>
                {steps.map((step, index) => {
                    const styles = getStepStyles(index);
                    
                    return (
                        <div
                            key={index}
                            onClick={() => handleStepClick(index)}
                            className={styles.container}
                        >
                            <div
                                style={styles.circle}
                                className={styles.circleClass}
                            >
                                {completedSteps.includes(index) && index !== activeStep ? (
                                    // Show checkmark for completed steps
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    index + 1
                                )}
                            </div>
                            <span className="mt-2 font-semibold text-sm" style={styles.text}>
                                {step}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Placeholder for spacing on the right to balance the layout */}
            <div style={{ width: "150px" }}></div>
        </div>
    );
};

export default Stepper;