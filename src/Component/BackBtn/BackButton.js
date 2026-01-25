import React from 'react'
import { useNavigate } from 'react-router-dom'

const BackButton = ({ path }) => {
    const navigate = useNavigate()
    return (
        <div>
            <button
                onClick={() => navigate(path)}
                className="flex items-center text-blue-500 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg px-4 py-2 transition duration-300 ease-in-out"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l-7-7 7-7" />
                </svg>
                Back
            </button>
        </div>
    )
}

export default BackButton
