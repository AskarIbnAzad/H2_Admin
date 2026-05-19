import React, { useMemo, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  FiInfo,
  FiSearch,
  FiBook,
  FiTrendingUp,
  FiBarChart2,
  FiLayers,
  FiUsers,
  FiGrid,
  FiArrowRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Filler,
    Title,
    Tooltip,
    Legend
);

const DashboardCharts = ({ data }) => {
  const navigate = useNavigate();
  const [showAllOrgans, setShowAllOrgans] = useState(false);

  const primaryColor = "#004c78";
  const primaryHoverColor = "#003556";

  const generateContrastColors = (count) => {
    if (!count) return [];

    const colors = [];
    const hueStep = 360 / count;
    const saturation = 75;
    const lightness = 55;

    for (let i = 0; i < count; i++) {
      colors.push(`hsl(${i * hueStep}, ${saturation}%, ${lightness}%)`);
    }

    return colors;
  };

  const getObjectTotal = (items = []) => {
    return items.reduce(
        (sum, item) => sum + Number(item.value || item.count || 0),
        0
    );
  };

  const sortObjectData = (rawData = {}) => {
    return Object.entries(rawData)
        .filter(([, value]) => Number(value) > 0)
        .map(([name, value]) => ({
          name,
          value: Number(value),
        }))
        .sort((a, b) => b.value - a.value);
  };

  const articlesByYear = useMemo(() => {
    return [...(data?.ArticlesByYearData || [])]
        .filter((item) => item?.year !== undefined && item?.year !== null)
        .map((item) => ({
          year: item.year,
          count: Number(item.count || 0),
        }))
        .sort((a, b) => Number(a.year) - Number(b.year));
  }, [data]);

  const researchTopics = useMemo(() => {
    return sortObjectData(data?.ResearchByTopicData || {});
  }, [data]);

  const topResearchTopics = useMemo(() => {
    return researchTopics.slice(0, 10);
  }, [researchTopics]);

  const studyTypes = useMemo(() => {
    return sortObjectData(data?.StudyByTypeData || {});
  }, [data]);

  const species = useMemo(() => {
    return sortObjectData(data?.StudyBySpeciesData || {});
  }, [data]);

  const organs = useMemo(() => {
    return [...(data?.StudyByOrganData || [])]
        .filter((item) => item.name && Number(item.count) > 0)
        .map((item) => ({
          name: item.name,
          count: Number(item.count),
        }))
        .sort((a, b) => b.count - a.count);
  }, [data]);

  const visibleOrgans = showAllOrgans ? organs : organs.slice(0, 18);

  const articlesByYearData = {
    labels: articlesByYear.map((item) => item.year),
    datasets: [
      {
        label: "Articles",
        data: articlesByYear.map((item) => item.count),
        borderColor: primaryColor,
        backgroundColor: "rgba(0, 76, 120, 0.12)",
        pointBackgroundColor: primaryColor,
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const researchTopicChartData = {
    labels: topResearchTopics.map((item) => item.name),
    datasets: [
      {
        label: "Articles",
        data: topResearchTopics.map((item) => item.value),
        backgroundColor: generateContrastColors(topResearchTopics.length),
        hoverBackgroundColor: primaryHoverColor,
        borderRadius: 8,
        borderWidth: 0,
        barPercentage: 0.75,
        categoryPercentage: 0.8,
      },
    ],
  };

  const totalStudyTypes = getObjectTotal(studyTypes);
  const totalSpecies = getObjectTotal(species);
  const maxSpeciesValue = Math.max(...species.map((item) => item.value), 1);
  const maxOrganValue = Math.max(...organs.map((item) => item.count), 1);


  const handleYearClick = (yearIndex) => {
    const year = articlesByYearData.labels[yearIndex];
    window.open(`${process.env.REACT_APP_WEB_BASE_URL}/articles?year=${encodeURIComponent(year)}`, "_blank");
  };

  const handleTopicClick = (topicIndex) => {
    const researchTopic = researchTopicChartData.labels[topicIndex];
    window.open(`${process.env.REACT_APP_WEB_BASE_URL}/articles?researchTopics=${encodeURIComponent(researchTopic)}`, "_blank");
  };

  const handleStudyTypeClick = (studyType) => {
    window.open(`${process.env.REACT_APP_WEB_BASE_URL}/articles?studyTypes=${encodeURIComponent(studyType)}`, "_blank");
  };

  const handleSpeciesClick = (specie) => {
    window.open(`${process.env.REACT_APP_WEB_BASE_URL}/articles?species=${encodeURIComponent(specie)}`, "_blank");
  };

  const handleOrganClick = (organ) => {
    window.open(`${process.env.REACT_APP_WEB_BASE_URL}/articles?organs=${encodeURIComponent(organ)}`, "_blank");
  };

  return (
      <div className="space-y-8">
        {/* Articles by Year + Research Topic */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Articles by Year */}
          <div className="bg-white p-5 rounded-2xl shadow-lg flex flex-col h-[460px]">
            <div className="flex justify-between items-start mb-5">
              <div>
                <div className="flex items-center gap-2 text-primary mb-1">
                  <FiTrendingUp className="h-5 w-5" />
                  <p className="text-sm font-semibold">Growth Trend</p>
                </div>

                <h2 className="text-xl font-bold">Articles by Year</h2>

                <p className="text-sm text-gray-500 mt-1">
                  Shows how research publication volume changes over time.
                </p>
              </div>
            </div>

            <div className="flex-1">
              {articlesByYear.length > 0 ? (
                  <Line
                      data={articlesByYearData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        onClick: (e, elements) => {
                          if (elements.length > 0) {
                            handleYearClick(elements[0].index);
                          }
                        },
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            callbacks: {
                              title: (context) => `Year: ${context[0].label}`,
                              label: (context) => `Articles: ${context.parsed.y}`,
                            },
                          },
                        },
                        scales: {
                          x: {
                            title: {
                              display: true,
                              text: "Year",
                              font: { weight: "bold" },
                            },
                            grid: { display: false },
                            ticks: {
                              autoSkip: false,
                              maxRotation: 45,
                              minRotation: 45,
                            },
                          },
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: "Number of Articles",
                              font: { weight: "bold" },
                            },
                            grid: { color: "#f0f0f0" },
                            ticks: { precision: 0 },
                          },
                        },
                      }}
                  />
              ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-500">
                      No yearly article data available
                    </p>
                  </div>
              )}
            </div>
          </div>

          {/* Research Topic */}
          <div className="bg-white p-5 rounded-2xl shadow-lg flex flex-col h-[460px]">
            <div className="flex justify-between items-start mb-5">
              <div>
                <div className="flex items-center gap-2 text-primary mb-1">
                  <FiBarChart2 className="h-5 w-5" />
                  <p className="text-sm font-semibold">Top Research Areas</p>
                </div>

                <h2 className="text-xl font-bold">Top 10 Research Topics</h2>

                <p className="text-sm text-gray-500 mt-1">
                  Most studied research areas ranked by article count.
                </p>
              </div>
            </div>

            <div className="flex-1">
              {topResearchTopics.length > 0 ? (
                  <Bar
                      data={researchTopicChartData}
                      options={{
                        indexAxis: "y",
                        responsive: true,
                        maintainAspectRatio: false,
                        onClick: (e, elements) => {
                          if (elements.length > 0) {
                            handleTopicClick(elements[0].index);
                          }
                        },
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            callbacks: {
                              label: (context) => `${context.parsed.x} articles`,
                            },
                          },
                        },
                        scales: {
                          x: {
                            beginAtZero: true,
                            grid: { color: "#f0f0f0" },
                            ticks: { precision: 0 },
                            title: {
                              display: true,
                              text: "Number of Articles",
                              font: { weight: "bold" },
                            },
                          },
                          y: {
                            grid: { display: false },
                            ticks: {
                              autoSkip: false,
                              font: { size: 11 },
                            },
                          },
                        },
                      }}
                  />
              ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-500">
                      No research topic data available
                    </p>
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Study Type Progress Cards */}
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 text-primary mb-1">
                <FiLayers className="h-5 w-5" />
                <p className="text-sm font-semibold">Study Classification</p>
              </div>

              <h2 className="text-xl font-bold">Study by Type</h2>

              <p className="text-sm text-gray-500 mt-1">
                A quick breakdown of the main study types in the database.
              </p>
            </div>
          </div>

          {studyTypes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {studyTypes.map((item, index) => {
                  const percentage = totalStudyTypes
                      ? ((item.value / totalStudyTypes) * 100).toFixed(1)
                      : 0;

                  return (
                      <button
                          key={item.name}
                          onClick={() => handleStudyTypeClick(item.name)}
                          className="text-left p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all"
                      >
                        <div className="flex justify-between items-start gap-3 mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {item.name}
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                              {item.value} articles
                            </p>
                          </div>

                          <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {percentage}%
                    </span>
                        </div>

                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                              className="h-full rounded-full"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor:
                                    generateContrastColors(studyTypes.length)[index],
                              }}
                          />
                        </div>
                      </button>
                  );
                })}
              </div>
          ) : (
              <div className="h-32 flex items-center justify-center">
                <p className="text-gray-500">No study type data available</p>
              </div>
          )}
        </div>

        {/* Species Icon/Stat Cards */}
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 text-primary mb-1">
                <FiUsers className="h-5 w-5" />
                <p className="text-sm font-semibold">Study Subjects</p>
              </div>

              <h2 className="text-xl font-bold">Study by Species</h2>

              <p className="text-sm text-gray-500 mt-1">
                View which species are most commonly used in molecular hydrogen
                studies.
              </p>
            </div>
          </div>

          {species.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                {species.slice(0, 10).map((item, index) => {
                  const percentage = totalSpecies
                      ? ((item.value / totalSpecies) * 100).toFixed(1)
                      : 0;

                  const strength = Math.max(
                      (item.value / maxSpeciesValue) * 100,
                      8
                  );

                  return (
                      <button
                          key={item.name}
                          onClick={() => handleSpeciesClick(item.name)}
                          className="group p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all text-left"
                      >
                        <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-white"
                            style={{
                              backgroundColor:
                                  generateContrastColors(species.length)[index],
                            }}
                        >
                          <FiUsers className="h-5 w-5" />
                        </div>

                        <h3 className="font-semibold text-gray-800 truncate">
                          {item.name}
                        </h3>

                        <p className="text-2xl font-bold text-primary mt-2">
                          {item.value}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {percentage}% of species studies
                        </p>

                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-3">
                          <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${strength}%` }}
                          />
                        </div>
                      </button>
                  );
                })}
              </div>
          ) : (
              <div className="h-32 flex items-center justify-center">
                <p className="text-gray-500">No species data available</p>
              </div>
          )}
        </div>

        {/* Organ Explorer */}
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-6">
            <div>
              <div className="flex items-center gap-2 text-primary mb-1">
                <FiGrid className="h-5 w-5" />
                <p className="text-sm font-semibold">Interactive Explorer</p>
              </div>

              <h2 className="text-xl font-bold">Study by Organ</h2>

              <p className="text-sm text-gray-500 mt-1 max-w-2xl">
                Click any organ tag to explore related research articles. Bigger
                numbers indicate more available studies.
              </p>
            </div>
          </div>

          {visibleOrgans.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {visibleOrgans.map((item, index) => {
                    const strength = Math.max(
                        (item.count / maxOrganValue) * 100,
                        10
                    );

                    return (
                        <button
                            key={item.name}
                            onClick={() => handleOrganClick(item.name)}
                            className="group p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all text-left"
                        >
                          <div className="flex justify-between items-center gap-3 mb-3">
                            <h3 className="font-semibold text-gray-800 truncate">
                              {item.name}
                            </h3>

                            <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                          {item.count}
                        </span>

                              <FiArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                            </div>
                          </div>

                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${strength}%`,
                                  backgroundColor:
                                      generateContrastColors(visibleOrgans.length)[index],
                                }}
                            />
                          </div>
                        </button>
                    );
                  })}
                </div>

                {organs.length > 18 && (
                    <div className="flex justify-center mt-6">
                      <button
                          className="px-5 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                          onClick={() => setShowAllOrgans((prev) => !prev)}
                      >
                        {showAllOrgans ? "Show Less Organs" : "Show All Organs"}
                      </button>
                    </div>
                )}
              </>
          ) : (
              <div className="h-32 flex items-center justify-center">
                <p className="text-gray-500">No organ data available</p>
              </div>
          )}
        </div>
      </div>
  );
};

export default DashboardCharts;
