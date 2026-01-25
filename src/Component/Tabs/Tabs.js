import React from 'react';

const Tabs = ({ activeTab, setActiveTab }) => {
    return (
        <div className="flex justify-center gap-4">
            <button
                className={`font-semibold h-20 w-60 rounded-lg shadow-xl ${activeTab === 'public' ? 'bg-blue-800 text-white' : 'bg-blue-100'}`}
                onClick={() => setActiveTab('public')}
            >
                Public Data
            </button>
            <button
                className={`font-semibold h-20 w-60 rounded-lg shadow-xl ${activeTab === 'researcher' ? 'bg-blue-800 text-white' : 'bg-blue-100'}`}
                onClick={() => setActiveTab('researcher')}
            >
                Researcher
            </button>
            <button
                className={`font-semibold h-20 w-60 rounded-lg shadow-xl ${activeTab === 'bioMarkers' ? 'bg-blue-800 text-white' : 'bg-blue-100'}`}
                onClick={() => setActiveTab('bioMarkers')}
            >
                Bio Marker Search
            </button>
        </div>
    );
};

export default Tabs;
