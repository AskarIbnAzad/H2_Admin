import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    add_biomarker_service_auth,
    approve_reject_biomarker_handling_service_auth,
    get_biomarker_handling_service_auth,
    get_biomarker_service_auth,
    update_biomarker_service_auth,
} from "../../../Services/BioMarkerService";
import ClipLoader from "react-spinners/ClipLoader";
import BioMarkerModal from "../../../Component/Modal/BioMarkerModal";
import { CustomCreatableSelect } from '../../../Component/CustomSelect/CustomSelect';
import { FaEdit, FaInfoCircle, FaTrash } from "react-icons/fa";
import { colorTheme } from "../../../Utils/colortheme";
import { asyncStatus } from "../../../Utils/asyncStatus";
import { setaddMarkerIdleStatus } from "../../../Store/slices/bio_marker_slice";
import BackButton from "../../../Component/BackBtn/BackButton";
import { Select, } from "antd";

const BioMarkerHandling = () => {

    const dispatch = useDispatch();
    const { get_biomarker_handling_data, get_biomarker_data, add_biomarker_status, update_biomarker_status } = useSelector((state) => state.biomarker);

    const [biomarkers, setBiomarkers] = useState([]);
    const [filteredBiomarkers, setFilteredBiomarkers] = useState([]);
    const [currentTab, setCurrentTab] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(15);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
    const [newMarker, setNewMarker] = useState(""); // New biomarker name
    const [formData, setFormData] = useState({ categories: [], parent_id: null, });

    // Function to map API data
    const mapApiDataToState = (apiData) => {
        return apiData?.map((item) => ({
            id: item.id,
            name: item.name,
            category: item.categories.map((cat) => cat.name),
            submittedBy: "Admin",
            status: item.status || "Pending",
            parent_id: item.parent_id ?? null,
        }));
    };

    const handleAction = (id, action) => {
        const updatedBiomarkers = biomarkers.map((biomarker) =>
            biomarker.id === id ? { ...biomarker, status: action } : biomarker
        );
        setBiomarkers(updatedBiomarkers);
        filterData(currentTab, searchQuery);

        dispatch(
            approve_reject_biomarker_handling_service_auth({
                sub_id: id,
                status: action,
            })
        );
    };

    // Fetch Data
    useEffect(() => {
        dispatch(get_biomarker_handling_service_auth());
        dispatch(get_biomarker_service_auth());
    }, [dispatch]);

    useEffect(() => {
        if (get_biomarker_handling_data?.sub) {
            const formattedData = mapApiDataToState(get_biomarker_handling_data.sub);
            setBiomarkers(formattedData);
            setLoading(false);
            filterData(currentTab, searchQuery);
        }
    }, [get_biomarker_handling_data]);

    const filterData = (tab, query) => {
        let result = biomarkers;

        // Filter out deleted items by default (only show in "Deleted" tab)
        if (tab !== "Deleted") {
            result = result.filter((item) => item.status !== "Deleted");
        } else {
            result = result.filter((item) => item.status === "Deleted");
        }

        if (tab !== "All" && tab !== "Deleted") {
            result = result.filter((item) => item.status === tab);
        }

        if (query) {
            result = result.filter(
                (item) =>
                    item.name.toLowerCase().includes(query.toLowerCase()) ||
                    item.category.some((cat) =>
                        cat.toLowerCase().includes(query.toLowerCase())
                    )
            );
        }

        setFilteredBiomarkers(result);
    };

    useEffect(() => {
        filterData(currentTab, searchQuery);
    }, [currentTab, searchQuery, biomarkers]);

    const handleChangeSelection = (value, name) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleNewBioMarker = () => {
        setIsModalOpen(true)
        // Reset the formData state
        setFormData({
            categories: [],
            parent_id: null,
        });
        setNewMarker(""); // Reset the new biomarker name input
    }

    const handleAddMarker = () => {
        const selection = {
            categoryName: formData.categories?.length
                ? formData.categories
                : ["Un-categorized"],
            sub: newMarker,
            parent_id: formData.parent_id ?? null,
        };

        // Dispatch the service
        dispatch(add_biomarker_service_auth(selection));

    };
    const handleEdit = (biomarker) => {
        setFormData({
            categories: biomarker.category,
            id: biomarker.id,
            status: biomarker.status,
            parent_id: biomarker.parent_id ?? null,
        });
        setNewMarker(biomarker.name);
        setIsModalOpen(true);
    };

    const handleUpdateMarker = () => {
        const selection = {
            categoryName: formData.categories,
            sub: newMarker,
            status: formData.status,
            ...(formData.parent_id ? { parent_id: formData.parent_id } : {}),
        };

        dispatch(update_biomarker_service_auth({
            id: formData.id,
            data: selection
        }));

    };
    useEffect(() => {
        if (update_biomarker_status === asyncStatus.SUCCEEDED) {
            setIsModalOpen(false);
            dispatch(get_biomarker_handling_service_auth());
        }
    }, [update_biomarker_status, dispatch]);

    useEffect(() => {
        if (add_biomarker_status === asyncStatus.SUCCEEDED) {
            setIsModalOpen(false); // Close the modal after adding

            // Reset the formData state
            setFormData({
                categories: [],
            });
            setNewMarker(""); // Reset the new biomarker name input

            // Reset statuses and fetch updated data
            dispatch(setaddMarkerIdleStatus());
            dispatch(get_biomarker_handling_service_auth());
        }
    }, [add_biomarker_status, dispatch]);



    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBiomarkers.slice(
        indexOfFirstItem,
        indexOfLastItem
    );



    const InfoTooltip = ({ message, width }) => (
        <div className="relative group">
            <FaInfoCircle className="ml-2 cursor-pointer" color={colorTheme.primary} />
            <div
                style={{
                    width: width || '300px',
                    whiteSpace: 'pre-wrap',
                    backgroundColor: '#333',
                    color: '#e0e0e0',
                    fontWeight: 'normal',
                    border: '1px solid #555',
                    padding: '10px',
                    borderRadius: '5px',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                    fontSize: '14px'
                }}
                className="absolute bottom-full mb-2 hidden group-hover:block"
            >
                {message}
            </div>
        </div>
    );

    const parentOptions =
        biomarkers
            ?.filter(b => b.id !== formData?.id)
            ?.map(b => ({
                value: b.id,
                label: b.name,
            })) || [];

    const getParentNameById = (parentId) => {
        if (!parentId) return "-";
        const parent = biomarkers.find((b) => b.id == parentId);

        return parent?.name || "-";
    };

    const shortText = (text, len = 15) => {
        if (!text || text === "-") return "-";
        return text.length > len ? text.slice(0, len) + "..." : text;
    };

    return (
        <div className="container mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex space-x-5 items-center">
                    <BackButton path={"/DataManager"} />
                    <h1 className="text-3xl font-bold text-gray-800">BioMarker Management</h1>
                </div>
                <button
                    onClick={() => handleNewBioMarker()}
                    className="bg-[#004c78] hover:bg-[#003a57] text-white py-2 px-6 rounded-lg shadow-md transition"
                >
                    + Add BioMarker
                </button>
            </div>

            {/* Modal */}
            {/* {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <h2 className="text-lg font-bold mb-4">Add New Biomarker</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Biomarker Name
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded"
                            placeholder="Enter biomarker name"
                            value={newMarker}
                            onChange={(e) => setNewMarker(e.target.value)}
                        />
                    </div>
                    <CustomCreatableSelect
                        isMulti
                        isCreate={false}
                        label="Categories"
                        options={
                            get_biomarker_data?.category?.map(
                                (category) => category?.name
                            ) || []
                        }
                        value={formData.categories}
                        onChange={(categories) =>
                            setFormData({ ...formData, categories })
                        }
                        name="categories"
                    />
                    <div className="mt-4">
                        <button
                            onClick={handleAddMarker}
                            className="bg-green-500 text-white py-2 px-4 rounded"
                        >
                            Add Biomarker
                        </button>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="ml-2 bg-gray-300 py-2 px-4 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </Modal>
            )} */}
            {isModalOpen && (
                <BioMarkerModal onClose={() => setIsModalOpen(false)} label={`${formData?.status ? "Edit" : "Add"} New Biomarker`}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">
                            Biomarker Name
                        </label>
                        <input
                            type="text"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500`}
                            placeholder="Enter Biomarker Name"
                            value={newMarker}
                            onChange={(e) => setNewMarker(e.target.value)}
                            style={{
                                border: newMarker && "2px solid gray",
                            }}
                        />
                    </div>
                    <CustomCreatableSelect
                        isMulti
                        isCreate={false}
                        label="Categories"
                       options={get_biomarker_data?.category?.map(category => category?.name).sort() || []}
                        value={formData.categories}
                        onChange={handleChangeSelection}
                        name="categories"
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

                    <div className="mt-4">
                        <label className="block text-gray-700 font-semibold mb-2">
                            Parent Biomarker (Optional)
                        </label>

                        {/* If you are using Ant Design Select */}
                        <Select
                            allowClear
                            showSearch
                            placeholder="Select a parent biomarker"
                            optionFilterProp="children"
                            value={formData.parent_id ?? undefined}
                            onChange={(val) => setFormData({ ...formData, parent_id: val ?? null })}
                            filterOption={(input, option) =>
                                (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
                            }
                            className="w-full"
                        >
                            {biomarkers
                                .filter((b) => b.id !== formData?.id) // exclude itself
                                .map((b) => (
                                    <Select.Option key={b.id} value={b.id}>
                                        {b.name}
                                    </Select.Option>
                                ))}
                        </Select>

                    </div>

                    {formData?.status && <div className="mt-4">
                        <label className="block text-gray-700 font-semibold mb-2">
                            Status
                        </label>
                        <select
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="Requested">Requested</option>
                            <option value="Approved">Approved</option>
                            <option value="Deleted">Deleted</option>
                        </select>
                    </div>}

                    <div className="mt-4 flex justify-end space-x-2">
                        <button
                            onClick={formData?.status ? handleUpdateMarker : handleAddMarker}
                            className="bg-[#004c78] text-white py-2 px-4 rounded"
                        >
                            {add_biomarker_status === asyncStatus.LOADING || update_biomarker_status === asyncStatus.LOADING ? "Loading..." : formData?.status ? "Update Biomarker" : "Add Biomarker"}
                        </button>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </BioMarkerModal>
            )}
            {/* Tabs and Controls */}
            <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
                {/* Tabs */}
                <div className="flex mb-6 space-x-2 border-b border-gray-200 pb-4">
                    {["All", "Requested", "Approved", "Deleted"].map((tab) => (
                        <button
                            key={tab}
                            className={`py-2 px-4 rounded-t-lg font-medium transition ${currentTab === tab
                                ? "bg-[#004c78] text-white border-b-2 border-[#004c78]"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            onClick={() => setCurrentTab(tab)}
                        >
                            {tab}
                            <span className="ml-2 text-sm font-normal">
                                ({biomarkers.filter(b => tab === "All" ? b.status !== "Deleted" : tab === "Deleted" ? b.status === "Deleted" : b.status === tab).length})
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search and Entries Dropdown */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-700 font-medium">Show</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="border border-gray-300 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004c78]"
                        >
                            <option value={15}>15</option>
                            <option value={30}>30</option>
                            <option value={60}>60</option>
                            <option value={120}>120</option>
                        </select>
                        <span className="text-gray-700 font-medium">entries per page</span>
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Search biomarker name or category..."
                            className="border border-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004c78]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Loading Spinner */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <ClipLoader size={50} color={"#004c78"} loading={loading} />
                </div>
            ) : (
                <div>
                    {/* Table */}
                    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                        <table className="w-full">
                            <thead className="bg-[#004c78] text-white">
                                <tr>
                                    <th className="text-left py-4 px-6 font-semibold">#</th>
                                    <th className="text-left py-4 px-6 font-semibold">Biomarker Name</th>
                                    <th className="text-left py-4 px-6 font-semibold">Parent Biomarker</th>
                                    <th className="text-left py-4 px-6 font-semibold">Category</th>
                                    <th className="text-left py-4 px-6 font-semibold">Submitted By</th>
                                    <th className="text-left py-4 px-6 font-semibold">Status</th>
                                    <th className="text-center py-4 px-6 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {currentItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8 text-gray-500">
                                            No biomarkers found
                                        </td>
                                    </tr>
                                ) : (
                                    currentItems.map((biomarker, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50 transition"
                                        >
                                            <td className="py-4 px-6 text-gray-700">{indexOfFirstItem + index + 1}</td>
                                            <td className="py-4 px-6 font-medium text-gray-800">{biomarker.name}</td>
                                            <td className="py-4 px-6 text-gray-600">
                                                {shortText(getParentNameById(biomarker.parent_id), 15)}
                                            </td>
                                            <td className="py-4 px-6 text-gray-600">
                                                <div className="flex flex-wrap gap-1">
                                                    {biomarker.category.map((cat, idx) => (
                                                        <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                            {cat}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-gray-600">{biomarker.submittedBy}</td>
                                            <td className="py-4 px-6">
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${biomarker.status === "Approved"
                                                        ? "bg-green-100 text-green-800"
                                                        : biomarker.status === "Deleted"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                >
                                                    {biomarker.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                {biomarker.status === "Requested" && (
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm transition"
                                                            onClick={() =>
                                                                handleAction(biomarker.id, "Approved")
                                                            }
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm transition"
                                                            onClick={() =>
                                                                handleAction(biomarker.id, "Deleted")
                                                            }
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                                {biomarker.status !== "Requested"  && (
                                                    <div className="flex justify-center items-center gap-2">
                                                        <button
                                                            className="bg-[#004c78] hover:bg-[#003a57] text-white py-1 px-3 rounded transition"
                                                            onClick={() => handleEdit(biomarker)}
                                                            title="Edit"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        {
                                                            biomarker.status === "Approved" && (
                                                                <button
                                                                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition"
                                                                    onClick={() =>
                                                                        handleAction(biomarker.id, "Deleted")
                                                                    }
                                                                    title="Delete"
                                                                >
                                                                    <FaTrash />
                                                                </button>
                                                            )}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-gray-700 font-medium">
                            <span>
                                Showing <span className="font-bold text-[#004c78]">{filteredBiomarkers.length === 0 ? 0 : indexOfFirstItem + 1}</span> to{" "}
                                <span className="font-bold text-[#004c78]">{Math.min(indexOfLastItem, filteredBiomarkers.length)}</span> of{" "}
                                <span className="font-bold text-[#004c78]">{filteredBiomarkers.length}</span> entries
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="py-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() =>
                                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                                }
                                disabled={currentPage === 1}
                            >
                                ← Previous
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.ceil(filteredBiomarkers.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`py-2 px-3 rounded-lg font-medium transition ${currentPage === page
                                            ? "bg-[#004c78] text-white"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button
                                className="py-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(
                                            prev + 1,
                                            Math.ceil(filteredBiomarkers.length / itemsPerPage)
                                        )
                                    )
                                }
                                disabled={
                                    currentPage ===
                                    Math.ceil(filteredBiomarkers.length / itemsPerPage)
                                }
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BioMarkerHandling;
