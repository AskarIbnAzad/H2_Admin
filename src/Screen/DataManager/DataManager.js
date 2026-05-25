import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMicroscope,
  FaUsers,
  FaBook,
  FaGlobe,
  FaPaw,
  FaUserTie,
  FaFileAlt,
  FaLightbulb,
  FaHeart,
  FaLungs,
  FaSyringe,
  FaUserShield,
  FaLayerGroup,
  FaTag,
  FaDisease, FaBars,
} from "react-icons/fa";

const DataManager = () => {
  const navigate = useNavigate();

  const screens = [
    {
      name: "Header",
      icon: <FaBars />,
      link: "/navigation",
      bgColor: "from-teal-50 to-teal-100",
      hoverBg: "from-teal-500 to-teal-600",
    },
    {
      name: "Article Type",
      icon: <FaFileAlt />,
      link: "/article-type",
      bgColor: "from-teal-50 to-teal-100",
      hoverBg: "from-teal-500 to-teal-600",
    },
    {
      name: "Authors",
      icon: <FaUsers />,
      link: "/article-authors",
      bgColor: "from-green-50 to-green-100",
      hoverBg: "from-green-500 to-green-600",
    },
    {
      name: "Biomarker",
      icon: <FaMicroscope />,
      link: "/BioMarkerHandling",
      bgColor: "from-blue-50 to-blue-100",
      hoverBg: "from-blue-500 to-blue-600",
    },
    {
      name: "Biomarker Category",
      icon: <FaLayerGroup />,
      link: "/biomarker-category",
      bgColor: "from-rose-50 to-rose-100",
      hoverBg: "from-rose-500 to-rose-600",
    },
    {
      name: "Countries",
      icon: <FaGlobe />,
      link: "/countries",
      bgColor: "from-purple-50 to-purple-100",
      hoverBg: "from-purple-500 to-purple-600",
    },
    {
      name: "Diseases/Disorders",
      icon: <FaDisease />,
      link: "/diseases",
      bgColor: "from-pink-50 to-pink-100",
      hoverBg: "from-pink-500 to-pink-600",
    },
    {
      name: "Keywords",
      icon: <FaTag />,
      link: "/keywords",
      bgColor: "from-amber-50 to-amber-100",
      hoverBg: "from-amber-500 to-amber-600",
    },
    {
      name: "Methods of Administration",
      icon: <FaSyringe />,
      link: "/methods-of-administration",
      bgColor: "from-emerald-50 to-emerald-100",
      hoverBg: "from-emerald-500 to-emerald-600",
    },
    {
      name: "Organs/Tissues",
      icon: <FaLungs />,
      link: "/organs-tissues",
      bgColor: "from-gray-50 to-gray-100",
      hoverBg: "from-gray-500 to-gray-600",
    },
    {
      name: "Physiological Systems",
      icon: <FaHeart />,
      link: "/physiological-systems",
      bgColor: "from-pink-50 to-pink-100",
      hoverBg: "from-pink-500 to-pink-600",
    },
    {
      name: "Research Topic",
      icon: <FaLightbulb />,
      link: "/research-topic",
      bgColor: "from-orange-50 to-orange-100",
      hoverBg: "from-orange-500 to-orange-600",
    },
    {
      name: "Roles",
      icon: <FaUserShield />,
      link: "/roles",
      bgColor: "from-cyan-50 to-cyan-100",
      hoverBg: "from-cyan-500 to-cyan-600",
    },
    {
      name: "Species",
      icon: <FaPaw />,
      link: "/species",
      bgColor: "from-red-50 to-red-100",
      hoverBg: "from-red-500 to-red-600",
    },
    {
      name: "Users",
      icon: <FaUserTie />,
      link: "/users",
      bgColor: "from-indigo-50 to-indigo-100",
      hoverBg: "from-indigo-500 to-indigo-600",
    },
  ];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12 tracking-wide">
        Explore the Data Manager
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {screens.map((screen, index) => (
          <div
            key={index}
            className="group relative bg-gradient-to-r from-gray-100 to-white border border-gray-200 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-transform transform hover:scale-110 hover:shadow-2xl hover:rotate-1"
            onClick={() => navigate(screen.link)}
          >
            <div
              className={`p-6 rounded-full bg-gradient-to-r ${screen.bgColor} group-hover:${screen.hoverBg} group-hover:text-white transition-all duration-300 ease-in-out`}
            >
              {React.cloneElement(screen.icon, {
                className:
                  "text-6xl group-hover:text-white transition-all duration-300",
              })}
            </div>
            <h2 className="text-lg font-semibold mt-4 text-gray-800 group-hover:text-[#004c78] transition-all duration-300 ease-in-out">
              {screen.name}
            </h2>
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 text-sm text-gray-500 transition-opacity duration-300">
              Click to explore
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataManager;
