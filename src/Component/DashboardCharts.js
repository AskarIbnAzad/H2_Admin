// import React, { useState, useEffect } from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
// } from "chart.js";
// import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
// import { FiChevronLeft, FiChevronRight, FiInfo } from "react-icons/fi";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// // High-contrast professional color palette
// const generateChartColors = (count) => {
//   const mainColors = [
//     "#4361ee", // Blue
//     "#3a0ca3", // Indigo
//     "#7209b7", // Purple
//     "#f72585", // Pink
//     "#4cc9f0", // Cyan
//     "#4895ef", // Light blue
//     "#560bad", // Violet
//     "#b5179e", // Magenta
//     "#480ca8", // Dark purple
//     "#3f37c9", // Royal blue
//     "#4361ee", // Bright blue
//     "#4895ef", // Sky blue
//     "#4cc9f0", // Teal
//   ];
  
//   // If we need more colors than in our palette
//   if (count > mainColors.length) {
//     // Generate additional colors with good contrast
//     const additionalColors = [];
//     for (let i = 0; i < count - mainColors.length; i++) {
//       const hue = (i * 137.5) % 360; // Golden angle for distribution
//       additionalColors.push(`hsl(${hue}, 80%, 55%)`);
//     }
//     return [...mainColors, ...additionalColors];
//   }
  
//   return mainColors.slice(0, count);
// };

// // Chart card component with cleaner design
// const ChartCard = ({ title, children, info }) => (
//   <div className="bg-white rounded-xl shadow-xl overflow-hidden">
//     <div className="p-5 border-b border-gray-100 flex justify-between items-center">
//       <h2 className="text-xl font-bold text-gray-800">{title}</h2>
//       {info && (
//         <div className="text-gray-400 hover:text-blue-600 cursor-help transition-colors" title={info}>
//           <FiInfo size={18} />
//         </div>
//       )}
//     </div>
//     <div className="p-5">
//       {children}
//     </div>
//   </div>
// );

// // Enhanced legend component
// const EnhancedLegend = ({ labels, backgroundColor, maxHeight }) => (
//   <div className={`overflow-auto ${maxHeight ? `max-h-${maxHeight}` : "max-h-72"} pr-2`}>
//     <div className="space-y-2">
//       {labels.map((label, index) => (
//         <div
//           key={index}
//           className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
//         >
//           <div
//             className="w-4 h-4 mr-3 rounded-md"
//             style={{ backgroundColor: backgroundColor[index] }}
//           />
//           <span className="text-sm font-medium text-gray-800">
//             {label}
//           </span>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// const DashboardCharts = ({ chartData }) => {
//   // State for organ chart pagination
//   const [labelStartIndex, setLabelStartIndex] = useState(0);
//   const [visibleOrganData, setVisibleOrganData] = useState(null);
  
//   // Number of labels to show at once
//   const labelsPerView = 8; // Showing fewer for better readability

//   // Chart.js global defaults for professional appearance
//   ChartJS.defaults.font.family = "'Inter', 'Helvetica', 'Arial', sans-serif";
//   ChartJS.defaults.font.size = 12;
//   ChartJS.defaults.color = "#64748b";
//   ChartJS.defaults.plugins.tooltip.padding = 12;
//   ChartJS.defaults.plugins.tooltip.cornerRadius = 8;
//   ChartJS.defaults.plugins.tooltip.titleFont = { weight: 'bold', size: 14 };
//   ChartJS.defaults.plugins.tooltip.bodyFont = { size: 13 };
//   ChartJS.defaults.plugins.tooltip.backgroundColor = 'rgba(255, 255, 255, 0.95)';
//   ChartJS.defaults.plugins.tooltip.titleColor = '#334155';
//   ChartJS.defaults.plugins.tooltip.bodyColor = '#334155';
//   ChartJS.defaults.plugins.tooltip.borderColor = '#e2e8f0';
//   ChartJS.defaults.plugins.tooltip.borderWidth = 1;
//   ChartJS.defaults.plugins.tooltip.displayColors = true;
//   ChartJS.defaults.plugins.tooltip.boxPadding = 6;
//   ChartJS.defaults.plugins.tooltip.usePointStyle = true;

//   // Transform TotalArticlesOverTime data for the line chart
//   const lineChartData = {
//     labels: chartData?.TotalArticlesOverTime?.map(item => item.year) || [],
//     datasets: [
//       {
//         label: "Total Articles",
//         data: chartData?.TotalArticlesOverTime?.map(item => item.count) || [],
//         borderColor: "#4361ee",
//         backgroundColor: "rgba(67, 97, 238, 0.1)",
//         pointBackgroundColor: "#4361ee",
//         pointBorderColor: "#ffffff",
//         pointRadius: 5,
//         pointHoverRadius: 7,
//         pointBorderWidth: 2,
//         borderWidth: 3,
//         tension: 0.3,
//         fill: true,
//       },
//     ],
//   };

//   // Transform Organs data for the bar chart
//   const organsData = chartData?.Organs 
//     ? Object.entries(chartData.Organs)
//         .sort((a, b) => b[1] - a[1]) // Sort by count descending
//         .reduce((obj, [key, value]) => {
//           obj.labels.push(key);
//           obj.data.push(value);
//           return obj;
//         }, { labels: [], data: [] })
//     : { labels: [], data: [] };

//   const organsChartData = {
//     labels: organsData.labels,
//     datasets: [
//       {
//         label: "Articles",
//         data: organsData.data,
//         backgroundColor: generateChartColors(organsData.labels.length),
//         borderRadius: 8,
//         maxBarThickness: 25,
//       },
//     ],
//   };

//   // Calculate total number of labels for organ chart
//   const totalLabels = organsChartData.labels.length;
  
//   // Calculate max start index to prevent showing empty spaces
//   const maxStartIndex = Math.max(0, totalLabels - labelsPerView);

//   // Update visible organ data whenever the chart data or start index changes
//   useEffect(() => {
//     updateVisibleOrganData();
//   }, [chartData, labelStartIndex]);
  
//   // Create a filtered version of the organ data with only the visible labels
//   const updateVisibleOrganData = () => {
//     if (!organsChartData || !organsChartData.labels || organsChartData.labels.length === 0) {
//       setVisibleOrganData(null);
//       return;
//     }
    
//     const visibleLabels = organsChartData.labels.slice(
//       labelStartIndex, 
//       labelStartIndex + labelsPerView
//     );
    
//     const visibleData = organsChartData.datasets.map(dataset => ({
//       ...dataset,
//       data: dataset.data.slice(
//         labelStartIndex, 
//         labelStartIndex + labelsPerView
//       ),
//       backgroundColor: dataset.backgroundColor.slice(
//         labelStartIndex,
//         labelStartIndex + labelsPerView
//       )
//     }));
    
//     setVisibleOrganData({
//       labels: visibleLabels,
//       datasets: visibleData
//     });
//   };
  
//   // Navigation functions for organ chart
//   const showPreviousLabels = () => {
//     setLabelStartIndex(Math.max(0, labelStartIndex - labelsPerView));
//   };
  
//   const showNextLabels = () => {
//     setLabelStartIndex(Math.min(maxStartIndex, labelStartIndex + labelsPerView));
//   };
  
//   // Check if navigation buttons should be enabled
//   const canGoBack = labelStartIndex > 0;
//   const canGoForward = labelStartIndex < maxStartIndex;

//   // Transform Articles by Status data for the pie chart
//   const statusLabels = chartData?.ArticlesbyStatus ? Object.keys(chartData.ArticlesbyStatus) : [];
//   const statusColors = {
//     Verified: "#10b981", // Green
//     Unverified: "#4361ee", // Blue
//     Draft: "#f59e0b", // Amber
//     In_review: "#6366f1", // Indigo
//   };

//   const pieChartData = {
//     labels: statusLabels,
//     datasets: [
//       {
//         label: "Article Status",
//         data: statusLabels.map(label => chartData?.ArticlesbyStatus[label] || 0),
//         backgroundColor: statusLabels.map(label => statusColors[label] || generateChartColors(1)[0]),
//         borderWidth: 2,
//         borderColor: "#ffffff",
//       },
//     ],
//   };

//   // Transform Research by Species data for the doughnut chart
//   const speciesChartData = {
//     labels: chartData?.ResearchbySpecies ? Object.keys(chartData.ResearchbySpecies) : [],
//     datasets: [
//       {
//         label: "Research by Species",
//         data: chartData?.ResearchbySpecies ? Object.values(chartData.ResearchbySpecies) : [],
//         backgroundColor: generateChartColors(
//           chartData?.ResearchbySpecies ? Object.keys(chartData.ResearchbySpecies).length : 0
//         ),
//         borderWidth: 2,
//         borderColor: "#ffffff",
//       },
//     ],
//   };

//   // Transform Study Types data for the doughnut chart
//   const studyTypeChartData = {
//     labels: chartData?.StudyTypes ? Object.keys(chartData.StudyTypes) : [],
//     datasets: [
//       {
//         label: "Study Types",
//         data: chartData?.StudyTypes ? Object.values(chartData.StudyTypes) : [],
//         backgroundColor: generateChartColors(
//           chartData?.StudyTypes ? Object.keys(chartData.StudyTypes).length : 0
//         ),
//         borderWidth: 2,
//         borderColor: "#ffffff",
//       },
//     ],
//   };

//   // Transform Research by Topic data for the bar chart - Sort by value
//   const topicData = chartData?.ResearchbyTopic 
//     ? Object.entries(chartData.ResearchbyTopic)
//         .sort((a, b) => b[1] - a[1]) // Sort by count descending
//         .slice(0, 10) // Get top 10
//         .reduce((obj, [key, value]) => {
//           obj.labels.push(key);
//           obj.data.push(value);
//           return obj;
//         }, { labels: [], data: [] })
//     : { labels: [], data: [] };

//   const topicBarChartData = {
//     labels: topicData.labels,
//     datasets: [
//       {
//         label: "Articles",
//         data: topicData.data,
//         backgroundColor: generateChartColors(topicData.labels.length),
//         borderRadius: 8,
//         maxBarThickness: 25,
//       },
//     ],
//   };

//   // Shared tooltip options for consistent styling
//   const tooltipOptions = {
//     backgroundColor: 'rgba(255, 255, 255, 0.95)',
//     titleColor: '#334155',
//     bodyColor: '#334155',
//     borderColor: '#e2e8f0',
//     borderWidth: 1,
//     displayColors: true,
//     boxPadding: 6,
//     usePointStyle: true,
//     padding: 12,
//     cornerRadius: 8,
//     titleFont: { weight: 'bold', size: 14 },
//     bodyFont: { size: 13 },
//   };

//   return (
//     <div className="my-10">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//         <ChartCard 
//           title="Articles by Status" 
//           info="Distribution of articles by verification status"
//         >
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="md:col-span-2 h-72">
//               <Pie 
//                 data={pieChartData} 
//                 options={{ 
//                   responsive: true,
//                   maintainAspectRatio: false,
//                   plugins: {
//                     legend: {
//                       display: false
//                     },
//                     tooltip: {
//                       ...tooltipOptions,
//                       callbacks: {
//                         label: (context) => {
//                           const label = context.label || "";
//                           const value = context.raw || 0;
//                           const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
//                           const percentage = Math.round((value / total) * 100);
//                           return `${label}: ${value} (${percentage}%)`;
//                         }
//                       }
//                     }
//                   },
//                   elements: {
//                     arc: {
//                       borderWidth: 2,
//                     }
//                   }
//                 }} 
//               />
//             </div>
//             <div className="flex items-center">
//               <EnhancedLegend 
//                 labels={pieChartData.labels} 
//                 backgroundColor={pieChartData.datasets[0].backgroundColor} 
//               />
//             </div>
//           </div>
//         </ChartCard>
        
//         <ChartCard 
//           title="Total Articles Over Time" 
//           info="Number of articles published per year"
//         >
//           <div className="h-72">
//             <Line 
//               data={lineChartData} 
//               options={{ 
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 scales: {
//                   y: {
//                     beginAtZero: true,
//                     ticks: {
//                       precision: 0
//                     },
//                     grid: {
//                       color: 'rgba(226, 232, 240, 0.5)',
//                     }
//                   },
//                   x: {
//                     grid: {
//                       display: false
//                     }
//                   }
//                 },
//                 plugins: {
//                   legend: {
//                     display: false
//                   },
//                   tooltip: {
//                     ...tooltipOptions,
//                     callbacks: {
//                       title: (context) => `Year: ${context[0].label}`,
//                       label: (context) => `Articles: ${context.raw}`
//                     }
//                   }
//                 }
//               }} 
//             />
//           </div>
//         </ChartCard>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//         <ChartCard 
//           title="Research by Species" 
//           info="Distribution of research by species studied"
//         >
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="md:col-span-2 h-72">
//               <Doughnut 
//                 data={speciesChartData} 
//                 options={{ 
//                   responsive: true,
//                   maintainAspectRatio: false,
//                   cutout: '70%',
//                   plugins: {
//                     legend: {
//                       display: false
//                     },
//                     tooltip: {
//                       ...tooltipOptions,
//                       callbacks: {
//                         label: (context) => {
//                           const label = context.label || "";
//                           const value = context.raw || 0;
//                           const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
//                           const percentage = ((value / total) * 100).toFixed(1);
//                           return `${label}: ${value} (${percentage}%)`;
//                         }
//                       }
//                     }
//                   }
//                 }} 
//               />
//             </div>
//             <div className="flex items-center">
//               <EnhancedLegend 
//                 labels={speciesChartData.labels} 
//                 backgroundColor={speciesChartData.datasets[0].backgroundColor}
//               />
//             </div>
//           </div>
//         </ChartCard>

//         <ChartCard 
//           title="Study Types" 
//           info="Distribution of articles by methodology"
//         >
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="md:col-span-2 h-72">
//               <Doughnut 
//                 data={studyTypeChartData} 
//                 options={{ 
//                   responsive: true,
//                   maintainAspectRatio: false,
//                   cutout: '70%',
//                   plugins: {
//                     legend: {
//                       display: false
//                     },
//                     tooltip: {
//                       ...tooltipOptions,
//                       callbacks: {
//                         label: (context) => {
//                           const label = context.label || "";
//                           const value = context.raw || 0;
//                           const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
//                           const percentage = ((value / total) * 100).toFixed(1);
//                           return `${label}: ${value} (${percentage}%)`;
//                         }
//                       }
//                     }
//                   }
//                 }} 
//               />
//             </div>
//             <div className="flex items-center">
//               <EnhancedLegend 
//                 labels={studyTypeChartData.labels} 
//                 backgroundColor={studyTypeChartData.datasets[0].backgroundColor}
//               />
//             </div>
//           </div>
//         </ChartCard>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <ChartCard 
//           title="Top Research Topics" 
//           info="Most common research topics (top 10)"
//         >
//           <div className="h-80">
//             <Bar 
//               data={topicBarChartData} 
//               options={{ 
//                 indexAxis: 'y',
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: {
//                   legend: {
//                     display: false
//                   },
//                   tooltip: {
//                     ...tooltipOptions,
//                     callbacks: {
//                       label: (context) => `Articles: ${context.raw}`
//                     }
//                   }
//                 },
//                 scales: {
//                   x: {
//                     beginAtZero: true,
//                     ticks: {
//                       precision: 0
//                     },
//                     grid: {
//                       color: 'rgba(226, 232, 240, 0.5)',
//                     }
//                   },
//                   y: {
//                     grid: {
//                       display: false
//                     }
//                   }
//                 }
//               }} 
//             />
//           </div>
//         </ChartCard>

//         <ChartCard 
//           title="Organs Researched" 
//           info="Distribution of research by organ studied"
//         >
//           <div className="h-80">
//             {visibleOrganData ? (
//               <div className="h-72">
//                 <Bar
//                   data={visibleOrganData}
//                   options={{
//                     indexAxis: "y",
//                     responsive: true,
//                     maintainAspectRatio: false,
//                     plugins: {
//                       legend: {
//                         display: false
//                       },
//                       tooltip: {
//                         ...tooltipOptions,
//                         callbacks: {
//                           title: (context) => {
//                             const tooltipIndex = context[0].dataIndex + labelStartIndex;
//                             return organsChartData.labels[tooltipIndex];
//                           },
//                           label: (context) => `Articles: ${context.raw}`
//                         }
//                       }
//                     },
//                     scales: {
//                       x: {
//                         beginAtZero: true,
//                         ticks: {
//                           precision: 0
//                         },
//                         grid: {
//                           color: 'rgba(226, 232, 240, 0.5)',
//                         }
//                       },
//                       y: {
//                         grid: {
//                           display: false
//                         }
//                       }
//                     }
//                   }}
//                 />

//                 {/* Pagination controls */}
//                 {totalLabels > labelsPerView && (
//                   <div className="flex justify-between items-center mt-4">
//                     <button 
//                       className={`flex items-center px-4 py-2 rounded-lg border ${
//                         canGoBack 
//                           ? 'border-blue-500 text-blue-600 hover:bg-blue-50' 
//                           : 'border-gray-200 text-gray-400 cursor-not-allowed'
//                       } transition-colors`}
//                       onClick={showPreviousLabels}
//                       disabled={!canGoBack}
//                     >
//                       <FiChevronLeft className="h-5 w-5 mr-1" />
//                       <span>Previous</span>
//                     </button>
                    
//                     <div className="text-sm font-semibold bg-gray-100 px-4 py-2 rounded-lg">
//                       {totalLabels > 0 ? (
//                         `${labelStartIndex + 1}-${Math.min(labelStartIndex + labelsPerView, totalLabels)} of ${totalLabels}`
//                       ) : (
//                         "No data available"
//                       )}
//                     </div>
                    
//                     <button 
//                       className={`flex items-center px-4 py-2 rounded-lg border ${
//                         canGoForward 
//                           ? 'border-blue-500 text-blue-600 hover:bg-blue-50' 
//                           : 'border-gray-200 text-gray-400 cursor-not-allowed'
//                       } transition-colors`}
//                       onClick={showNextLabels}
//                       disabled={!canGoForward}
//                     >
//                       <span>Next</span>
//                       <FiChevronRight className="h-5 w-5 ml-1" />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="h-full flex items-center justify-center">
//                 <div className="flex flex-col items-center">
//                   <svg className="animate-spin h-10 w-10 text-blue-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   <p className="text-gray-600 font-medium">Loading organ data...</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </ChartCard>
//       </div>
//     </div>
//   );
// };

// export default DashboardCharts;



import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
import { FiChevronLeft, FiChevronRight, FiInfo } from "react-icons/fi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// High-contrast professional color palette
const generateChartColors = (count) => {
  const mainColors = [
    "#4361ee", // Blue
    "#3a0ca3", // Indigo
    "#7209b7", // Purple
    "#f72585", // Pink
    "#4cc9f0", // Cyan
    "#4895ef", // Light blue
    "#560bad", // Violet
    "#b5179e", // Magenta
    "#480ca8", // Dark purple
    "#3f37c9", // Royal blue
    "#4361ee", // Bright blue
    "#4895ef", // Sky blue
    "#4cc9f0", // Teal
  ];
  
  // If we need more colors than in our palette
  if (count > mainColors.length) {
    // Generate additional colors with good contrast
    const additionalColors = [];
    for (let i = 0; i < count - mainColors.length; i++) {
      const hue = (i * 137.5) % 360; // Golden angle for distribution
      additionalColors.push(`hsl(${hue}, 80%, 55%)`);
    }
    return [...mainColors, ...additionalColors];
  }
  
  return mainColors.slice(0, count);
};

// Chart card component with cleaner design
const ChartCard = ({ title, children, info }) => (
  <div className="bg-white rounded-xl shadow-xl overflow-hidden">
    <div className="p-5 border-b border-gray-100 flex justify-between items-center">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      {info && (
        <div className="text-gray-400 hover:text-blue-600 cursor-help transition-colors" title={info}>
          <FiInfo size={18} />
        </div>
      )}
    </div>
    <div className="p-5">
      {children}
    </div>
  </div>
);

// Enhanced legend component with formatter for labels
const EnhancedLegend = ({ labels, backgroundColor, maxHeight }) => {
  // Format label function to convert underscore to spaces and capitalize
  const formatLabel = (label) => {
    if (!label) return '';
    // Replace underscores with spaces
    const withSpaces = label.replace(/_/g, ' ');
    // Capitalize each word
    return withSpaces
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className={`overflow-auto ${maxHeight ? `max-h-${maxHeight}` : "max-h-72"} pr-2`}>
      <div className="space-y-2">
        {labels.map((label, index) => (
          <div
            key={index}
            className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div
              className="w-4 h-4 mr-3 rounded-md"
              style={{ backgroundColor: backgroundColor[index] }}
            />
            <span className="text-sm font-medium text-gray-800">
              {formatLabel(label)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const DashboardCharts = ({ chartData }) => {
  // State for organ chart pagination
  const [labelStartIndex, setLabelStartIndex] = useState(0);
  const [visibleOrganData, setVisibleOrganData] = useState(null);
  
  // Number of labels to show at once
  const labelsPerView = 8; // Showing fewer for better readability

  // Chart.js global defaults for professional appearance
  ChartJS.defaults.font.family = "'Inter', 'Helvetica', 'Arial', sans-serif";
  ChartJS.defaults.font.size = 12;
  ChartJS.defaults.color = "#64748b";
  ChartJS.defaults.plugins.tooltip.padding = 12;
  ChartJS.defaults.plugins.tooltip.cornerRadius = 8;
  ChartJS.defaults.plugins.tooltip.titleFont = { weight: 'bold', size: 14 };
  ChartJS.defaults.plugins.tooltip.bodyFont = { size: 13 };
  ChartJS.defaults.plugins.tooltip.backgroundColor = 'rgba(255, 255, 255, 0.95)';
  ChartJS.defaults.plugins.tooltip.titleColor = '#334155';
  ChartJS.defaults.plugins.tooltip.bodyColor = '#334155';
  ChartJS.defaults.plugins.tooltip.borderColor = '#e2e8f0';
  ChartJS.defaults.plugins.tooltip.borderWidth = 1;
  ChartJS.defaults.plugins.tooltip.displayColors = true;
  ChartJS.defaults.plugins.tooltip.boxPadding = 6;
  ChartJS.defaults.plugins.tooltip.usePointStyle = true;

  // Transform TotalArticlesOverTime data for the line chart

  console.log("chartData", chartData);
  const lineChartData = {
    labels: chartData?.TotalArticlesOverTime?.map(item => item.year).slice(0, chartData?.TotalArticlesOverTime?.length) || [],
    datasets: [
      {
        label: "Total Articles",
        data: chartData?.TotalArticlesOverTime?.map(item => item.count).slice(0, chartData?.TotalArticlesOverTime?.length) || [],
        borderColor: "#4361ee",
        backgroundColor: "rgba(67, 97, 238, 0.1)",
        pointBackgroundColor: "#4361ee",
        pointBorderColor: "#ffffff",
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBorderWidth: 2,
        borderWidth: 3,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Transform Organs data for the bar chart
  const organsData = chartData?.Organs 
    ? Object.entries(chartData.Organs)
        .sort((a, b) => b[1] - a[1]) // Sort by count descending
        .reduce((obj, [key, value]) => {
          // Change "Endothelial" label to "Endothelium"
          const label = key === "Endothelial" ? "Endothelium" : key;
          obj.labels.push(label);
          obj.data.push(value);
          return obj;
        }, { labels: [], data: [] })
    : { labels: [], data: [] };



  const organsChartData = {
    labels: organsData.labels,
    datasets: [
      {
        label: "Articles",
        data: organsData.data,
        backgroundColor: generateChartColors(organsData.labels.length),
        borderRadius: 8,
        maxBarThickness: 25,
      },
    ],
  };


  // Calculate total number of labels for organ chart
  const totalLabels = organsChartData.labels.length;
  
  // Calculate max start index to prevent showing empty spaces
  const maxStartIndex = Math.max(0, totalLabels - labelsPerView);

  // Update visible organ data whenever the chart data or start index changes
  useEffect(() => {
    updateVisibleOrganData();
  }, [chartData, labelStartIndex]);
  
  // Create a filtered version of the organ data with only the visible labels
  const updateVisibleOrganData = () => {
    if (!organsChartData || !organsChartData.labels || organsChartData.labels.length === 0) {
      setVisibleOrganData(null);
      return;
    }
    
    const visibleLabels = organsChartData.labels.slice(
      labelStartIndex, 
      labelStartIndex + labelsPerView
    );
    
    const visibleData = organsChartData.datasets.map(dataset => ({
      ...dataset,
      data: dataset.data.slice(
        labelStartIndex, 
        labelStartIndex + labelsPerView
      ),
      backgroundColor: dataset.backgroundColor.slice(
        labelStartIndex,
        labelStartIndex + labelsPerView
      )
    }));
    
    setVisibleOrganData({
      labels: visibleLabels,
      datasets: visibleData
    });
  };
  
  // Navigation functions for organ chart
  const showPreviousLabels = () => {
    setLabelStartIndex(Math.max(0, labelStartIndex - labelsPerView));
  };
  
  const showNextLabels = () => {
    setLabelStartIndex(Math.min(maxStartIndex, labelStartIndex + labelsPerView));
  };
  
  // Check if navigation buttons should be enabled
  const canGoBack = labelStartIndex > 0;
  const canGoForward = labelStartIndex < maxStartIndex;

  // Transform Articles by Status data for the pie chart
  const statusLabels = chartData?.ArticlesbyStatus ? Object.keys(chartData.ArticlesbyStatus) : [];
  const statusColors = {
    Verified: "#10b981", // Green
    Unverified: "#f59e0b", // Orange
    Draft: "#fef08a", // Light Yellow
    In_review: "#6366f1", // Indigo
  };

  // Format label function to convert underscore to spaces and capitalize
  const formatLabel = (label) => {
    if (!label) return '';
    // Replace underscores with spaces
    const withSpaces = label.replace(/_/g, ' ');
    // Capitalize each word
    return withSpaces
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const pieChartData = {
    labels: statusLabels,
    datasets: [
      {
        label: "Article Status",
        data: statusLabels.map(label => chartData?.ArticlesbyStatus[label] || 0),
        backgroundColor: statusLabels.map(label => statusColors[label] || generateChartColors(1)[0]),
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  // Transform Research by Species data for the doughnut chart
  const speciesChartData = {
    labels: chartData?.ResearchbySpecies ? Object.keys(chartData.ResearchbySpecies) : [],
    datasets: [
      {
        label: "Research by Species",
        data: chartData?.ResearchbySpecies ? Object.values(chartData.ResearchbySpecies) : [],
        backgroundColor: generateChartColors(
          chartData?.ResearchbySpecies ? Object.keys(chartData.ResearchbySpecies).length : 0
        ),
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  // Transform Study Types data for the doughnut chart
  const studyTypeChartData = {
    labels: chartData?.StudyTypes ? Object.keys(chartData.StudyTypes) : [],
    datasets: [
      {
        label: "Study Types",
        data: chartData?.StudyTypes ? Object.values(chartData.StudyTypes) : [],
        backgroundColor: generateChartColors(
          chartData?.StudyTypes ? Object.keys(chartData.StudyTypes).length : 0
        ),
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  // Transform Research by Topic data for the bar chart - Sort by value
  const topicData = chartData?.ResearchbyTopic 
    ? Object.entries(chartData.ResearchbyTopic)
        .sort((a, b) => b[1] - a[1]) // Sort by count descending
        .slice(0, 10) // Get top 10
        .reduce((obj, [key, value]) => {
          obj.labels.push(key);
          obj.data.push(value);
          return obj;
        }, { labels: [], data: [] })
    : { labels: [], data: [] };

  const topicBarChartData = {
    labels: topicData.labels,
    datasets: [
      {
        label: "Articles",
        data: topicData.data,
        backgroundColor: generateChartColors(topicData.labels.length),
        borderRadius: 8,
        maxBarThickness: 25,
      },
    ],
  };

  // Shared tooltip options for consistent styling
  const tooltipOptions = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    titleColor: '#334155',
    bodyColor: '#334155',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    displayColors: true,
    boxPadding: 6,
    usePointStyle: true,
    padding: 12,
    cornerRadius: 8,
    titleFont: { weight: 'bold', size: 14 },
    bodyFont: { size: 13 },
  };

  return (
    <div className="my-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ChartCard 
          title="Articles by Status" 
          info="Distribution of articles by verification status"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-72">
              <Pie 
                data={pieChartData} 
                options={{ 
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      ...tooltipOptions,
                      callbacks: {
                        label: (context) => {
                          // Get the original label
                          const rawLabel = context.label || "";
                          
                          // Format the label - replace underscores with spaces and capitalize
                          const formattedLabel = formatLabel(rawLabel);
                          
                          const value = context.raw || 0;
                          const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                          const percentage = Math.round((value / total) * 100);
                          return `${formattedLabel}: ${value} (${percentage}%)`;
                        }
                      }
                    }
                  },
                  elements: {
                    arc: {
                      borderWidth: 2,
                    }
                  }
                }} 
              />
            </div>
            <div className="flex items-center">
              <EnhancedLegend 
                labels={pieChartData.labels} 
                backgroundColor={pieChartData.datasets[0].backgroundColor} 
              />
            </div>
          </div>
        </ChartCard>
        
        <ChartCard 
          title="Total Articles Over Time" 
          info="Number of articles published per year"
        >
          <div className="h-72">
            <Line 
              data={lineChartData} 
              options={{ 
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0
                    },
                    grid: {
                      color: 'rgba(226, 232, 240, 0.5)',
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    ...tooltipOptions,
                    callbacks: {
                      title: (context) => `Year: ${context[0].label}`,
                      label: (context) => `Articles: ${context.raw}`
                    }
                  }
                }
              }} 
            />
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ChartCard 
          title="Research by Species" 
          info="Distribution of research by species studied"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-72">
              <Doughnut 
                data={speciesChartData} 
                options={{ 
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: '70%',
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      ...tooltipOptions,
                      callbacks: {
                        label: (context) => {
                          const label = context.label || "";
                          const value = context.raw || 0;
                          const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `${label}: ${value} (${percentage}%)`;
                        }
                      }
                    }
                  }
                }} 
              />
            </div>
            <div className="flex items-center">
              <EnhancedLegend 
                labels={speciesChartData.labels} 
                backgroundColor={speciesChartData.datasets[0].backgroundColor}
              />
            </div>
          </div>
        </ChartCard>

        <ChartCard 
          title="Study Types" 
          info="Distribution of articles by methodology"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-72">
              <Doughnut 
                data={studyTypeChartData} 
                options={{ 
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: '70%',
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      ...tooltipOptions,
                      callbacks: {
                        label: (context) => {
                          const label = context.label || "";
                          const value = context.raw || 0;
                          const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `${label}: ${value} (${percentage}%)`;
                        }
                      }
                    }
                  }
                }} 
              />
            </div>
            <div className="flex items-center">
              <EnhancedLegend 
                labels={studyTypeChartData.labels} 
                backgroundColor={studyTypeChartData.datasets[0].backgroundColor}
              />
            </div>
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard 
          title="Top Research Topics" 
          info="Most common research topics (top 10)"
        >
          <div className="h-80">
            <Bar 
              data={topicBarChartData} 
              options={{ 
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    ...tooltipOptions,
                    callbacks: {
                      label: (context) => `Articles: ${context.raw}`
                    }
                  }
                },
                scales: {
                  x: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0
                    },
                    grid: {
                      color: 'rgba(226, 232, 240, 0.5)',
                    }
                  },
                  y: {
                    grid: {
                      display: false
                    }
                  }
                }
              }} 
            />
          </div>
        </ChartCard>

        <ChartCard 
          title="Key Body Structures" 
          info="Distribution of research by organ studied"
        >
          <div className="h-80">
            {visibleOrganData ? (
              <div className="h-72">
                <Bar
                  data={visibleOrganData}
                  options={{
                    indexAxis: "y",
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        ...tooltipOptions,
                        callbacks: {
                          title: (context) => {
                            const tooltipIndex = context[0].dataIndex + labelStartIndex;
                            return organsChartData.labels[tooltipIndex];
                          },
                          label: (context) => `Articles: ${context.raw}`
                        }
                      }
                    },
                    scales: {
                      x: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0
                        },
                        grid: {
                          color: 'rgba(226, 232, 240, 0.5)',
                        }
                      },
                      y: {
                        grid: {
                          display: false
                        }
                      }
                    }
                  }}
                />

                {/* Pagination controls */}
                {totalLabels > labelsPerView && (
                  <div className="flex justify-between items-center mt-4">
                    <button 
                      className={`flex items-center px-4 py-2 rounded-lg border ${
                        canGoBack 
                          ? 'border-blue-500 text-blue-600 hover:bg-blue-50' 
                          : 'border-gray-200 text-gray-400 cursor-not-allowed'
                      } transition-colors`}
                      onClick={showPreviousLabels}
                      disabled={!canGoBack}
                    >
                      <FiChevronLeft className="h-5 w-5 mr-1" />
                      <span>Previous</span>
                    </button>
                    
                    <div className="text-sm font-semibold bg-gray-100 px-4 py-2 rounded-lg">
                      {totalLabels > 0 ? (
                        `${labelStartIndex + 1}-${Math.min(labelStartIndex + labelsPerView, totalLabels)} of ${totalLabels}`
                      ) : (
                        "No data available"
                      )}
                    </div>
                    
                    <button 
                      className={`flex items-center px-4 py-2 rounded-lg border ${
                        canGoForward 
                          ? 'border-blue-500 text-blue-600 hover:bg-blue-50' 
                          : 'border-gray-200 text-gray-400 cursor-not-allowed'
                      } transition-colors`}
                      onClick={showNextLabels}
                      disabled={!canGoForward}
                    >
                      <span>Next</span>
                      <FiChevronRight className="h-5 w-5 ml-1" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <svg className="animate-spin h-10 w-10 text-blue-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-gray-600 font-medium">Loading organ data...</p>
                </div>
              </div>
            )}
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default DashboardCharts;