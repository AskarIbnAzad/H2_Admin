import React, { useEffect, useState } from 'react';
import { Badge, Button } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { colorTheme } from '../../Utils/colortheme';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_biomarker_service_auth } from '../../Services/BioMarkerService';
import { asyncStatus } from '../../Utils/asyncStatus';
import { setaddMarkerIdleStatus } from '../../Store/slices/bio_marker_slice';
import { apiHandle } from '../../Config/ApiHandle/apiHandle';
import ArticleAssignmentModal from '../ArticleAssignmentModal/ArticleAssignmentModal';
import CircularProgress from '@mui/material/CircularProgress';
import { FaEdit } from "react-icons/fa";

const CategoryTable = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { get_biomarker_status, get_biomarker_data, add_biomarker_status } = useSelector((state) => state.biomarker);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [assignmentCounts, setAssignmentCounts] = useState({});
    const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
    const [selectedBiomarker, setSelectedBiomarker] = useState(null);

    // Handle filtering categories by search term
    const filteredCategories = get_biomarker_data?.biomakers?.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    // Calculate indices for pagination
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentCategories = filteredCategories.slice(indexOfFirstEntry, indexOfLastEntry);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Fetch biomarker data on component mount
    useEffect(() => {
        dispatch(get_biomarker_service_auth());
        // //
    }, [dispatch]);

    useEffect(() => {
        if (add_biomarker_status === asyncStatus.SUCCEEDED) {
            dispatch(setaddMarkerIdleStatus());
            dispatch(get_biomarker_service_auth());
            // //
        }
    }, [add_biomarker_status, dispatch]);

    // Fetch assignment counts for all biomarkers
    const fetchAssignmentCounts = async () => {
        try {
            const response = await apiHandle.get('/biomarker-assignment-counts');
            setAssignmentCounts(response.data?.counts || {});
        } catch (error) {
            console.error("Error fetching assignment counts:", error);
        }
    };

    // Handle article assignment modal
    const handleManageArticles = (biomarker) => {
        setSelectedBiomarker(biomarker);
        setIsAssignModalVisible(true);
    };

    const handleEdit = (category) => {
        navigate("/biomarkar-add-form", { state: { categoryToEdit: category } });
        console.log("category", category);

    };

    return (
        <div className=" container mx-auto p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold mb-4">Categories and Markers</h1>


                {/* Add New Button */}
                <button
                    className="text-white py-2 px-4 rounded"
                    style={{ backgroundColor: colorTheme.primary }}
                    onClick={() => navigate("/biomarkar-add-form")}
                >
                    Add New
                </button>
            </div>

            <div style={{ display: "flex", justifyContent: 'space-between', alignItems: "center" }} className='mb-4'>
                {/* Entries per page select */}
                <div className="flex justify-start ">
                    <label className="mr-2">Show</label>
                    <select
                        value={entriesPerPage}
                        onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                        className="border px-2 py-1 rounded"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                    <span className="ml-2">entries per page</span>
                </div>

                <div className="">
                    {/* Search input */}
                    <input
                        type="text"
                        className="border px-4 py-2 rounded"
                        placeholder="Search categories..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table with Loading Indicator */}
            {get_biomarker_status === asyncStatus.LOADING ? (
                <div className="flex justify-center items-center my-8">
                    <CircularProgress style={{ color: colorTheme.primary }} size={30} />
                </div>
            ) : (
                <>
                    <table className="table-auto w-full text-left border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">#</th>
                                <th className="border p-2">Category</th>
                                <th className="border p-2">Markers</th>
                                <th className="border p-2">Assigned Articles</th>
                                <th className="border p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCategories.length > 0 ? (
                                currentCategories.map((category, index) => (
                                    <tr key={index}>
                                        <td className="border p-2">{indexOfFirstEntry + index + 1}</td>
                                        <td className="border p-2">{category.name}</td>
                                        <td className="border p-2">
                                            {category?.makers?.length > 0
                                                ? category.makers.join(', ')
                                                : 'No Markers'}
                                        </td>
                                        <td className="border p-2">
                                            <Badge 
                                                count={assignmentCounts[category.id] || 0} 
                                                style={{ backgroundColor: '#004c78' }}
                                            />
                                        </td>
                                        <td className="border p-2">
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <FaEdit
                                                    color={colorTheme.primary}
                                                    size={25}
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => handleEdit(category)}
                                                />
                                                <Button
                                                    style={{
                                                        backgroundColor: "#1890ff",
                                                        color: "white",
                                                        borderColor: "#1890ff",
                                                    }}
                                                    icon={<FileTextOutlined />}
                                                    size="small"
                                                    onClick={() => handleManageArticles(category)}
                                                >
                                                    Articles
                                                    <Badge 
                                                        count={assignmentCounts[category.id] || 0} 
                                                        style={{ backgroundColor: '#ff4d4f', marginLeft: 4 }}
                                                    />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="border p-2 text-center" colSpan="5">No categories found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-4">
                        <span>
                            Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredCategories.length)} of {filteredCategories.length} entries
                        </span>
                        <div className="flex gap-2">
                            {Array.from({ length: Math.ceil(filteredCategories.length / entriesPerPage) }, (_, pageIndex) => (
                                <button
                                    key={pageIndex}
                                    onClick={() => paginate(pageIndex + 1)}
                                    className={`px-3 py-1 border`}
                                    style={{
                                        backgroundColor: currentPage === pageIndex + 1 ? colorTheme.primary : "white",
                                        color: currentPage === pageIndex + 1 ? "white" : colorTheme.primary,
                                    }}
                                >
                                    {pageIndex + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Article Assignment Modal */}
            <ArticleAssignmentModal
                visible={isAssignModalVisible}
                onCancel={() => {
                    setIsAssignModalVisible(false);
                    setSelectedBiomarker(null);
                }}
                selectedItem={selectedBiomarker}
                assignmentType="biomarker"
                onAssignmentChange={fetchAssignmentCounts}
            />
        </div>
    );
};

export default CategoryTable;
