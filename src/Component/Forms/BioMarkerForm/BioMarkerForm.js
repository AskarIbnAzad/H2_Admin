import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { colorTheme } from '../../../Utils/colortheme';
import { add_biomarker_service_auth, get_biomarker_service_auth } from '../../../Services/BioMarkerService';
import { CustomCreatableSelect } from '../../CustomSelect/CustomSelect';
import { asyncStatus } from '../../../Utils/asyncStatus';
import { FaInfoCircle } from 'react-icons/fa';
import { setaddMarkerIdleStatus } from '../../../Store/slices/bio_marker_slice';

const BioMarkerForm = ({ onSubmit, initialData = [], onBack , isSpecialAction }) => {

    console.log("initialData",initialData);
    
    const dispatch = useDispatch();
    const { get_biomarker_data, add_biomarker_status } = useSelector((state) => state.biomarker);
    const { add_article_status } = useSelector((state) => state.article);
    const [searchTerm, setSearchTerm] = useState('');
    const [allMarkers, setAllMarkers] = useState([]);
    const [filteredMarkers, setFilteredMarkers] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedMarker, setSelectedMarker] = useState('');
    const [formData, setFormData] = useState({
        selectChange: [],
        categories: [],
        status: 'Unverified'
    });
    // const [formData, setFormData] = useState({ selectChange: [], categories: [] });
    const [selectedProtein, setSelectedProtein] = useState('');
    const [allSelections, setAllSelections] = useState(initialData || []);
    const [newMarker, setNewMarker] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        dispatch(get_biomarker_service_auth());
    }, [dispatch]);

    useEffect(() => {
        if (Array.isArray(initialData)) {
            console.log("thats array");

            setAllSelections(initialData);
        } else {
            console.log("thats not array");
            
            setAllSelections([]);
        }
    }, [initialData]);

    console.log("allSelections",allSelections);
    

    useEffect(() => {
        if (get_biomarker_data?.biomarkers) {
            const combinedMarkers = get_biomarker_data.biomarkers.map((subItem) => ({
                marker: subItem.sub_category_name,
                categories: subItem.categories,
            }));
            setAllMarkers(combinedMarkers);
        }
    }, [get_biomarker_data]);

    const handleSearchChange = (e) => {
        const searchText = e.target.value.toLowerCase();
        setSearchTerm(searchText);

        if (searchText !== '') {
            const filtered = allMarkers.filter(
                (item) =>
                    item?.marker?.toLowerCase().includes(searchText) ||
                    item.categories?.some((cat) => cat?.toLowerCase().includes(searchText))
            );
            setFilteredMarkers(filtered);
        } else {
            setFilteredMarkers([]);
        }
    };

    const handleMarkerSelect = (marker, category) => {
        setSelectedMarker(marker);
        setSelectedCategory(category);
        setSearchTerm(marker);
        setFilteredMarkers([]);
    };

    const handleChangeSelection = (value, name) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleProteinSelection = (e) => {
        setSelectedProtein(e.target.value);
    };

    const handleAddMore = () => {

        const newSelection = {
            marker: selectedMarker,
            category: selectedCategory,
            Change: Array.isArray(formData.selectChange) ? formData.selectChange : [formData.selectChange],
            Protein: selectedProtein,
            status: 'Unverified'
        };

        if (editIndex !== null) {
            // Update the existing selection
            const updatedSelections = [...allSelections];
            updatedSelections[editIndex] = newSelection;
            setAllSelections(updatedSelections);
            setEditIndex(null); // Reset edit mode
        } else {
            // Add a new selection
            setAllSelections([...allSelections, newSelection]);
        }

        resetSelections();
        setErrorMessage('');
    };

    const handleEditSelection = (index) => {
        const selection = allSelections[index];
        setSelectedMarker(selection.marker);
        setSelectedCategory(selection.category);
        setFormData((prev) => ({
            ...prev,
            selectChange: Array.isArray(selection.Change) ? selection.Change : [selection.Change],
        }));
        setSelectedProtein(selection.Protein);
        setSearchTerm(selection.marker);
        setEditIndex(index); // Set the index of the selection being edited
    };

    const resetSelections = () => {
        setSelectedCategory('');
        setSelectedMarker('');
        setFormData({ selectChange: [], categories: [] });
        setSelectedProtein('');
        setSearchTerm('');
        setEditIndex(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // console.log("allSelections", allSelections);

        onSubmit(allSelections);
    };

    const handleRemoveSelection = (index) => {
        const updatedSelections = allSelections.filter((_, i) => i !== index);
        setAllSelections(updatedSelections);
    };

    const handleAddMarker = () => {

        const selection = {
            categoryName: formData.categories?.length ? formData.categories : ["Un-categorized"],
            sub: newMarker,
        };

        console.log("selection", selection);


        // Dispatch the service (uncomment if needed)
        dispatch(add_biomarker_service_auth(selection));

    };
    
    useEffect(() => {
        const updatedMarkers = [
            ...allMarkers,
            { marker: newMarker, categories: formData?.categories },
        ];
        if (add_biomarker_status === asyncStatus.SUCCEEDED) {
            dispatch(get_biomarker_service_auth());
            dispatch(setaddMarkerIdleStatus());
            setAllMarkers(updatedMarkers);
            setIsModalOpen(false);
            resetSelections();
            setSearchTerm("")
            setFilteredMarkers([]);
        }
    }, [add_biomarker_status, dispatch])

    const InfoTooltip = ({ message, width, left = false }) => (
        <div className="relative group">
            <FaInfoCircle className="ml-2 cursor-pointer" color="#346896" />

            <div
                style={{
                    width: width || '300px',
                    whiteSpace: 'pre-wrap',
                    backgroundColor: '#333',  // Softer dark gray for better contrast
                    color: '#e0e0e0',         // Light gray text for readability
                    fontWeight: 'normal',     // Softer text weight for clarity
                    border: '1px solid #555', // Border for subtle contrast
                    padding: '10px',          // More padding for readability
                    borderRadius: '5px',      // Rounded corners for visual comfort
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Softer shadow for subtle lift
                    fontSize: '14px',
                    left: left ? 'auto' : '100%', // Move left if prop is true
                    right: left ? '100%' : 'auto', // Otherwise, position on the right
                    transform: left ? 'translateX(-10px)' : 'translateX(10px)', // Adjust spacing
                }}
                className="absolute bottom-full mb-2 hidden group-hover:block"
            >
                {message}
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-6">
          
            <div className="container text-sm pr-4 text-gray-500 mt-1  mb-2 font-extrabold">
              Note: This Section is Not required for review / non-experimental articles
            </div>
         
            <h1 className="text-2xl font-bold mb-6">Biomarker/Function Search</h1>
            <div className='w-full flex items-center'>
                <div className='w-full'>

                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search for a marker..."
                    />
                </div>
                <div>
                    <InfoTooltip left={true} message={"Search for biomarkers mentioned in the study. Examples include inflammation markers or oxidative stress indicators."} />
                </div>
            </div>

            {filteredMarkers?.length > 0 && (
                <ul className="mt-4 bg-white border rounded-lg shadow-md max-h-40 overflow-y-auto">
                    {filteredMarkers.sort((a, b) => a.marker.localeCompare(b.marker)).map((item, index) => (
                        <li
                            key={index}
                            className="cursor-pointer py-2 px-4 hover:bg-gray-100"
                            onClick={() => handleMarkerSelect(item.marker, item.categories)}
                        >
                            {item.marker}
                        </li>
                    ))}
                </ul>
            )}

            {/* Show the "Add new marker" button only if no matching marker exists */}
            {searchTerm && filteredMarkers.length === 0 && allMarkers?.every(item => item?.marker?.toLowerCase() !== searchTerm?.toLowerCase()) && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div>
                        <button
                            onClick={() => {
                                setNewMarker(searchTerm); // Set new marker with search term
                                setFormData((prev) => ({
                                    ...prev,
                                    categories: [], // Clear the categories
                                }));
                                setIsModalOpen(true);
                            }}

                            className="text-white py-2 px-4 rounded hover:bg-blue-700 mt-2"
                            style={{ backgroundColor: colorTheme.primary }}
                        >
                            Add "{searchTerm}" as a new marker
                        </button>
                    </div>
                    <div>
                        <InfoTooltip message={"Please provide the full name of the biomarker (e.g., 'Superoxide Dismutase (SOD)' instead of 'SOD')."} />
                    </div>
                </div>
            )}

            {selectedMarker && (
                <>
                    <div className="mt-4">
                        <CustomCreatableSelect
                            isCreate={false}
                            label="Select a Change"
                            options={[
                                'Increasing Trend',
                                'Decreasing Trend',
                                'Statistically Increased',
                                'Statistically Decreased',
                                'Divergent',
                                'No Change',
                            ].sort((a, b) => a.localeCompare(b))}
                            value={formData.selectChange}
                            onChange={handleChangeSelection}
                            name="selectChange"
                            isMulti
                            InfoTooltip={
                                <InfoTooltip message="Select the observed effect of hydrogen on this biomarker." />
                            }
                        />
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center mb-2 ">

                            <label className="block text-gray-700 font-semibold ">Select a Type</label>
                            <span>
                                <InfoTooltip message="Choose the type of biomarker measurement assessed in the study (Protein 
Expression/Activity Level: The amount or activity of a specific protein measured in the 
study / mRNA Levels: The expression level of messenger RNA (mRNA) for the 
biomarker, indicating gene transcription activity / Not Applicable (N/A): The study does 
not measure biomarker levels using these methods.)" />
                            </span>
                        </div>
                        <select
                            value={selectedProtein}
                            onChange={handleProteinSelection}
                            className="w-full px-4 py-2 border rounded-lg"
                        >
                            <option value="" disabled>
                                Select a Type
                            </option>
                            <option value="Protein Expression/Activity Level">Protein Expression/Activity Level</option>
                            <option value="mRNA Levels">mRNA Levels</option>
                            <option value="Not Applicable">Not Applicable</option>
                        </select>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={handleAddMore}
                            className="text-white py-2 px-4 rounded hover:bg-blue-700 mr-2"
                            style={{ backgroundColor: colorTheme.primary }}
                        >
                            {editIndex !== null ? 'Update' : 'Add'}
                        </button>
                        <button onClick={resetSelections} className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700">
                            Cancel
                        </button>
                    </div>
                </>
            )}

            {allSelections.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold">All Selected Biomarkers:</h2>
                    {allSelections.map((selection, index) => (
                        <div key={index} className="mt-4 p-4 bg-gray-100 rounded-lg">
                            <p>
                                <strong>Selection {index + 1}:</strong>
                            </p>
                            <p>Marker: {selection.marker}</p>
                            <p>Category: {Array.isArray(selection.category) ? selection.category.join(', ') : selection.category}</p>
                            <p>Change: {Array.isArray(selection.Change) ? selection.Change.join(', ') : selection.Change}</p>
                            <p>Protein Expression/Activity Level: {selection.Protein}</p>
                            {initialData && Object.keys(initialData).length > 0 && <button
                                onClick={() => handleEditSelection(index)}
                                className="text-white py-1 px-2 rounded hover:bg-blue-700 mt-2 mr-2"
                                style={{ backgroundColor: colorTheme.primary }}
                            >
                                Edit
                            </button>}
                            <button
                                onClick={() => handleRemoveSelection(index)}
                                className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700 mt-2"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal to add new Marker */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" w>
                    <div className="bg-white p-8 rounded-lg shadow-lg" style={{ width: '30%' }}>
                        <h2 className="text-xl font-bold mb-4">Add New Marker</h2>
                        <p>Marker: {newMarker}</p>
                        <CustomCreatableSelect
                            isMulti
                            isCreate={false}
                            label="Categories"
                            options={get_biomarker_data?.category?.map(category => category?.name).sort((a, b) => a.localeCompare(b)) || []}
                            value={formData.categories}
                            onChange={handleChangeSelection}
                            name="categories"   
                            // error={errorMessageModal}
                            InfoTooltip={
                                <InfoTooltip
                                    message={
                                        <span>
                                            <strong>Select which categories this biomarker belongs to. If you aren’t sure, select “uncategorized” as well.</strong>
                                        </span>
                                    }
                                />
                            }
                        />
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleAddMarker}
                                className="text-white py-2 px-4 rounded hover:bg-blue-700 mr-2"
                                style={{ backgroundColor: colorTheme.primary }}
                            >
                                {add_biomarker_status === asyncStatus.LOADING ? "Loading..." : "Add Marker"}
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-6 flex justify-start">
                <button
                    type="button"
                    onClick={onBack}
                    style={{ backgroundColor: colorTheme.primary }}
                    className="text-white py-2 px-4 rounded hover:bg-blue-700 mr-2"
                >
                    Back
                </button>
                <button
                    onClick={handleSubmit}
                    className="text-white py-2 px-4 rounded hover:bg-green-700"
                    style={{ backgroundColor: colorTheme.primary }}
                >
                    {add_article_status === asyncStatus.LOADING ? "Loading..." : "Submit"}
                </button>
            </div>
        </div>
    );
};

export default BioMarkerForm;
