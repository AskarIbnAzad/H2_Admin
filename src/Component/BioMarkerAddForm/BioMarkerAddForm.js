// import React, { useEffect, useState } from 'react';
// import { colorTheme } from '../../Utils/colortheme';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { asyncStatus } from '../../Utils/asyncStatus';
// import { setaddMarkerIdleStatus } from '../../Store/slices/bio_marker_slice';
// import { add_biomarker_service_auth } from '../../Services/BioMarkerService';

// const BioMarkerAddForm = () => {
//   const navigate = useNavigate()
//   const dispatch = useDispatch()

//   const { add_biomarker_status } = useSelector((state) => state.biomarker)

//   const [categories, setCategories] = useState([]);

//   const handleAddCategory = () => {
//     setCategories([
//       ...categories,
//       {
//         categoryName: '',
//         type: 'A',
//         makers: [],
//       }
//     ]);
//   };

//   const handleCategoryChange = (index, event) => {
//     const newCategories = [...categories];
//     newCategories[index].categoryName = event.target.value;
//     setCategories(newCategories);
//   };

//   const handleMarkerInputChange = (categoryIndex, markerIndex, event) => {
//     const newCategories = [...categories];
//     newCategories[categoryIndex].makers[markerIndex] = event.target.value;
//     setCategories(newCategories);
//   };

//   const handleMarkerAddField = (categoryIndex) => {
//     const newCategories = [...categories];
//     newCategories[categoryIndex].makers.push('');
//     setCategories(newCategories);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     dispatch(add_biomarker_service_auth(categories[0]))

//   };

//   useEffect(() => {
//     if (add_biomarker_status === asyncStatus.SUCCEEDED) {
//       // dispatch(setaddMarkerIdleStatus())
//       navigate("/admin/biomarker")


//     }
//   }, [add_biomarker_status])


//   return (
//     <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
//       <h1 className="text-2xl font-bold mb-4">Add Categories and Markers</h1>

//       {categories.length === 0 && (
//         <button
//           className="text-white py-2 px-4 rounded mb-4"
//           style={{ backgroundColor: colorTheme.primary }}
//           onClick={handleAddCategory}
//         >
//           Add Category
//         </button>
//       )}

//       <form onSubmit={handleSubmit}>
//         {categories?.map((category, categoryIndex) => (
//           <div key={categoryIndex} className="mb-6">
//             <label className="block text-gray-700 mb-2">Category Name</label>
//             <input
//               type="text"
//               value={category.categoryName}
//               onChange={(event) => handleCategoryChange(categoryIndex, event)}
//               className="border w-full px-4 py-2 rounded mb-4"
//               placeholder="Enter Category Name"
//             />

//             <div className="mb-4">
//               <h3 className="font-semibold">{`${category.type} Markers:`}</h3> 
//               {category?.makers?.map((makers, markerIndex) => (
//                 <input
//                   key={markerIndex}
//                   type="text"
//                   value={makers}
//                   onChange={(event) => handleMarkerInputChange(categoryIndex, markerIndex, event)}
//                   className="border w-full px-4 py-2 rounded mb-2"
//                   placeholder={`Add Marker to ${category.type}`}
//                 />
//               ))}
//               <button
//                 type="button"
//                 className="bg-gray-200 text-black py-1 px-3 rounded mb-2"
//                 onClick={() => handleMarkerAddField(categoryIndex)}
//               >
//                 Add Marker to {category.type}
//               </button>
//             </div>
//           </div>
//         ))}

//         {categories.length > 0 && (
//           <div className="mt-4">
//             <button
//               className="text-white py-2 px-4 rounded"
//               type="submit"
//               style={{ backgroundColor: colorTheme.primary }}
//             >
//               {add_biomarker_status === asyncStatus.LOADING ? "Adding..." : "Submit"}

//             </button>
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default BioMarkerAddForm;


// import React, { useEffect, useState } from 'react';
// import { colorTheme } from '../../Utils/colortheme';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { asyncStatus } from '../../Utils/asyncStatus';
// import { setaddMarkerIdleStatus } from '../../Store/slices/bio_marker_slice';
// import { add_biomarker_service_auth, edit_biomarker_service_auth } from '../../Services/BioMarkerService'; // Assume you have edit service

// const BioMarkerAddForm = () => {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const { state } = useLocation();
//     const { add_biomarker_status } = useSelector((state) => state.biomarker);

//     const [categories, setCategories] = useState(state?.categoryToEdit ? [{ ...state.categoryToEdit, categoryName: state.categoryToEdit.name }] : []);


//     const handleAddCategory = () => {
//         setCategories([
//             ...categories,
//             {
//                 categoryName: '',
//                 type: 'A',
//                 makers: [],
//             }
//         ]);
//     };

//     // Handles changing the category name
//     const handleCategoryChange = (index, event) => {
//         const newCategories = [...categories];
//         newCategories[index].categoryName = event.target.value;
//         setCategories(newCategories);
//     };

//     // Handles changing the markers
//     const handleMarkerInputChange = (categoryIndex, markerIndex, event) => {
//         const newCategories = [...categories];
//         newCategories[categoryIndex].makers[markerIndex] = event.target.value;
//         setCategories(newCategories);
//     };

//     // Adds a new marker field
//     const handleMarkerAddField = (categoryIndex) => {
//         const newCategories = [...categories];
//         newCategories[categoryIndex].makers.push('');
//         setCategories(newCategories);
//     };

//     // Handles the submission of a new category
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         dispatch(add_biomarker_service_auth(categories[0]));
//     };

//     // Handles the update of an existing category
//     const handleEditSubmit = (e) => {
//         e.preventDefault();
//         // dispatch(edit_biomarker_service_auth(categories[0]));
//         console.log("edit_biomarker_service_auth",categories[0]);

//     };

//     useEffect(() => {
//         if (add_biomarker_status === asyncStatus.SUCCEEDED) {
//             dispatch(setaddMarkerIdleStatus());
//             navigate("/admin/biomarker");
//         }
//     }, [add_biomarker_status, dispatch, navigate]);

//     return (
//         <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
//             <h1 className="text-2xl font-bold mb-4">
//                 {state?.categoryToEdit ? "Edit Category and Markers" : "Add Categories and Markers"}
//             </h1>

//             {categories.length === 0 && !state?.categoryToEdit && (
//                 <button
//                     className="text-white py-2 px-4 rounded mb-4"
//                     style={{ backgroundColor: colorTheme.primary }}
//                     onClick={handleAddCategory}
//                 >
//                     Add Category
//                 </button>
//             )}

//             <form onSubmit={state?.categoryToEdit ? handleEditSubmit : handleSubmit}>
//                 {categories?.map((category, categoryIndex) => (
//                     <div key={categoryIndex} className="mb-6">
//                         <label className="block text-gray-700 mb-2">Category Name</label>
//                         <input
//                             type="text"
//                             value={category.categoryName}
//                             onChange={(event) => handleCategoryChange(categoryIndex, event)}
//                             className="border w-full px-4 py-2 rounded mb-4"
//                             placeholder="Enter Category Name"
//                         />

//                         <div className="mb-4">
//                             <h3 className="font-semibold">{`${category.type} Markers:`}</h3>
//                             {category?.makers?.map((makers, markerIndex) => (
//                                 <input
//                                     key={markerIndex}
//                                     type="text"
//                                     value={makers}
//                                     onChange={(event) => handleMarkerInputChange(categoryIndex, markerIndex, event)}
//                                     className="border w-full px-4 py-2 rounded mb-2"
//                                     placeholder={`Add Marker to ${category.type}`}
//                                 />
//                             ))}
//                             <button
//                                 type="button"
//                                 className="bg-gray-200 text-black py-1 px-3 rounded mb-2"
//                                 onClick={() => handleMarkerAddField(categoryIndex)}
//                             >
//                                 Add Marker to {category.type}
//                             </button>
//                         </div>
//                     </div>
//                 ))}

//                 {categories.length > 0 && (
//                     <div className="mt-4">
//                         <button
//                             className="text-white py-2 px-4 rounded"
//                             type="submit"
//                             style={{ backgroundColor: colorTheme.primary }}
//                         >
//                             {state?.categoryToEdit ? "Update" : add_biomarker_status === asyncStatus.LOADING ? "Adding..." : "Submit"}
//                         </button>
//                     </div>
//                 )}
//             </form>
//         </div>
//     );
// };

// export default BioMarkerAddForm;

// import React, { useEffect, useState } from 'react';
// import { colorTheme } from '../../Utils/colortheme';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { asyncStatus } from '../../Utils/asyncStatus';
// import { setaddMarkerIdleStatus, seteditMarkerIdleStatus } from '../../Store/slices/bio_marker_slice';
// import { add_biomarker_service_auth, edit_biomarker_service_auth, update_biomarker_service_auth } from '../../Services/BioMarkerService';

// const BioMarkerAddForm = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { state } = useLocation();
//   const { add_biomarker_status, update_biomarker_status } = useSelector((state) => state.biomarker);


//   const [categories, setCategories] = useState(
//     state?.categoryToEdit
//       ? [{
//         categoryName: state.categoryToEdit.name,
//         type: state.categoryToEdit.type || 'A',
//         makers: state.categoryToEdit.makers || []
//       }]
//       : []
//   );

//   const handleAddCategory = () => {
//     setCategories([
//       ...categories,
//       {
//         categoryName: '',
//         type: 'A',
//         makers: [],
//       }
//     ]);
//   };


//   const handleCategoryChange = (index, event) => {
//     const newCategories = [...categories];
//     newCategories[index].categoryName = event.target.value;
//     setCategories(newCategories);
//   };


//   const handleMarkerInputChange = (categoryIndex, markerIndex, event) => {
//     const newCategories = [...categories];
//     newCategories[categoryIndex].makers[markerIndex] = event.target.value;
//     setCategories(newCategories);
//   };

//   // Adds a new marker field
//   const handleMarkerAddField = (categoryIndex) => {
//     const newCategories = [...categories];
//     newCategories[categoryIndex].makers.push('');
//     setCategories(newCategories);
//   };

//   // Handle submission of a new category
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     dispatch(add_biomarker_service_auth(categories[0]));
//   };

//   // Handle editing an existing category
//   const handleEditSubmit = (e) => {
//     e.preventDefault();
//     // Dispatch the edit action here, sending the updated category data
//     dispatch(update_biomarker_service_auth({
//       id: state?.categoryToEdit?.id,
//       data: categories[0],
//     }));
//     console.log("categories", categories[0]);
//     console.log("state?.categoryToEdit", state?.categoryToEdit?.id);

//   };

//   useEffect(() => {
//     if (add_biomarker_status === asyncStatus.SUCCEEDED || update_biomarker_status === asyncStatus.SUCCEEDED) {
//       dispatch(setaddMarkerIdleStatus());
//       dispatch(seteditMarkerIdleStatus());
//       navigate("/biomarker");
//     }
//   }, [add_biomarker_status, update_biomarker_status, dispatch, navigate]);

//   return (
//     <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
//       <h1 className="text-2xl font-bold mb-4">
//         {state?.categoryToEdit ? "Edit Category and Markers" : "Add Categories and Markers"}
//       </h1>

//       {categories.length === 0 && !state?.categoryToEdit && (
//         <button
//           className="text-white py-2 px-4 rounded mb-4"
//           style={{ backgroundColor: colorTheme.primary }}
//           onClick={handleAddCategory}
//         >
//           Add Category
//         </button>
//       )}

//       <form onSubmit={state?.categoryToEdit ? handleEditSubmit : handleSubmit}>
//         {categories?.map((category, categoryIndex) => (
//           <div key={categoryIndex} className="mb-6">
//             <label className="block text-gray-700 mb-2">Category Name</label>
//             <input
//               type="text"
//               value={category.categoryName}
//               onChange={(event) => handleCategoryChange(categoryIndex, event)}
//               className="border w-full px-4 py-2 rounded mb-4"
//               placeholder="Enter Category Name"
//             />

//             <div className="mb-4">
//               <h3 className="font-semibold">{`${category.type} Markers:`}</h3>
//               {category?.makers?.map((makers, markerIndex) => (
//                 <input
//                   key={markerIndex}
//                   type="text"
//                   value={makers}
//                   onChange={(event) => handleMarkerInputChange(categoryIndex, markerIndex, event)}
//                   className="border w-full px-4 py-2 rounded mb-2"
//                   placeholder={`Add Marker to ${category.type}`}
//                 />
//               ))}
//               <button
//                 type="button"
//                 className="bg-gray-200 text-black py-1 px-3 rounded mb-2"
//                 onClick={() => handleMarkerAddField(categoryIndex)}
//               >
//                 Add Marker to {category.type}
//               </button>
//             </div>
//           </div>
//         ))}

//         {categories.length > 0 && (
//           <div className="mt-4">
//             <button
//               className="text-white py-2 px-4 rounded"
//               type="submit"
//               style={{ backgroundColor: colorTheme.primary }}
//             >
//               {state?.categoryToEdit ? (update_biomarker_status === asyncStatus.LOADING ? "Updating..." : "Update") : add_biomarker_status === asyncStatus.LOADING ? "Adding..." : "Submit"}
//             </button>
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default BioMarkerAddForm;

import React, { useEffect, useState } from 'react';
import { colorTheme } from '../../Utils/colortheme';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { asyncStatus } from '../../Utils/asyncStatus';
import { setaddMarkerIdleStatus, seteditMarkerIdleStatus } from '../../Store/slices/bio_marker_slice';
import { add_biomarker_service_auth, edit_biomarker_service_auth, update_biomarker_service_auth } from '../../Services/BioMarkerService';

const BioMarkerAddForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { add_biomarker_status, update_biomarker_status } = useSelector((state) => state.biomarker);

  const [categories, setCategories] = useState(
    state?.categoryToEdit
      ? [{
          categoryName: state.categoryToEdit.name,
          type: state.categoryToEdit.type || 'A',
          makers: state.categoryToEdit.makers || []
        }]
      : []
  );

  const handleAddCategory = () => {
    setCategories([
      ...categories,
      {
        categoryName: '',
        type: 'A',
        makers: [],
      }
    ]);
  };

  const handleCategoryChange = (index, event) => {
    const newCategories = [...categories];
    newCategories[index].categoryName = event.target.value;
    setCategories(newCategories);
  };

  const handleMarkerInputChange = (categoryIndex, markerIndex, event) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].makers[markerIndex] = event.target.value;
    setCategories(newCategories);
  };

  // Adds a new marker field
  const handleMarkerAddField = (categoryIndex) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].makers.push('');
    setCategories(newCategories);
  };

  // Remove a marker field
  const handleMarkerRemoveField = (categoryIndex, markerIndex) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].makers.splice(markerIndex, 1);
    setCategories(newCategories);
  };

  // Filter out empty markers before submitting
  const getFilteredCategories = () => {
    return categories.map((category) => ({
      ...category,
      makers: category.makers.filter((marker) => marker.trim() !== '')
    }));
  };

  // Handle submission of a new category
  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredCategories = getFilteredCategories();
    dispatch(add_biomarker_service_auth(filteredCategories[0]));
  };

  // Handle editing an existing category
  const handleEditSubmit = (e) => {
    e.preventDefault();
    const filteredCategories = getFilteredCategories();
    dispatch(update_biomarker_service_auth({
      id: state?.categoryToEdit?.id,
      data: filteredCategories[0],
    }));
    console.log("Filtered categories:", filteredCategories[0]);
  };

  useEffect(() => {
    if (add_biomarker_status === asyncStatus.SUCCEEDED || update_biomarker_status === asyncStatus.SUCCEEDED) {
      dispatch(setaddMarkerIdleStatus());
      dispatch(seteditMarkerIdleStatus());
      navigate("/biomarker");
    }
  }, [add_biomarker_status, update_biomarker_status, dispatch, navigate]);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">
        {state?.categoryToEdit ? "Edit Category and Markers" : "Add Categories and Markers"}
      </h1>

      {categories.length === 0 && !state?.categoryToEdit && (
        <button
          className="text-white py-2 px-4 rounded mb-4"
          style={{ backgroundColor: colorTheme.primary }}
          onClick={handleAddCategory}
        >
          Add Category
        </button>
      )}

      <form onSubmit={state?.categoryToEdit ? handleEditSubmit : handleSubmit}>
        {categories?.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-6">
            <label className="block text-gray-700 mb-2">Category Name</label>
            <input
              type="text"
              value={category.categoryName}
              onChange={(event) => handleCategoryChange(categoryIndex, event)}
              className="border w-full px-4 py-2 rounded mb-4"
              placeholder="Enter Category Name"
            />

            <div className="mb-4">
              <h3 className="font-semibold">{`${category.type} Markers:`}</h3>
              {category?.makers?.map((marker, markerIndex) => (
                <div key={markerIndex} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={marker}
                    onChange={(event) => handleMarkerInputChange(categoryIndex, markerIndex, event)}
                    className="border w-full px-4 py-2 rounded"
                    placeholder={`Add Marker to ${category.type}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleMarkerRemoveField(categoryIndex, markerIndex)}
                    className="text-red-500 ml-2"
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="bg-gray-200 text-black py-1 px-3 rounded mb-2"
                onClick={() => handleMarkerAddField(categoryIndex)}
              >
                Add Marker to {category.type}
              </button>
            </div>
          </div>
        ))}

        {categories.length > 0 && (
          <div className="mt-4">
            <button
              className="text-white py-2 px-4 rounded"
              type="submit"
              style={{ backgroundColor: colorTheme.primary }}
            >
              {state?.categoryToEdit ? (update_biomarker_status === asyncStatus.LOADING ? "Updating..." : "Update") : add_biomarker_status === asyncStatus.LOADING ? "Adding..." : "Submit"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default BioMarkerAddForm;
