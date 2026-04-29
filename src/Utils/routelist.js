import React from "react";

import Articles from "../Screen/DashboardScreens/Articles/Articles";
import Home from "../Screen/DashboardScreens/Home/Home";
import Species from "../Screen/DashboardScreens/Species/Species";
import MainForm from "../Component/Forms/MainForm/MainForm";

import BioMarkerAddForm from "../Component/BioMarkerAddForm/BioMarkerAddForm";
import Users from "../Screen/DashboardScreens/Users/Users";
import Login from "../Screen/Login/Login";
import Dashboard from "../Screen/Dashboard/Dashboard";
import PMID from "../Screen/DashboardScreens/PMID/PMID";
import BioMarkerHandling from "../Screen/DashboardScreens/BioMarkerHandling/BioMarkerHandling";
import AuthorsHandling from "../Screen/DashboardScreens/Authors/Authors";
import AuthorsLibrary from "../Screen/DashboardScreens/AuthorsLibrary/AuthorsLibrary";
import CountryTable from "../Screen/DashboardScreens/CountryPage/CountryPage";
import DataManager from "../Screen/DataManager/DataManager";
import ArticleTypeTable from "../Screen/DashboardScreens/ArticleTypeTable/ArticleTypeTable";
import ResearchTopicTable from "../Screen/DashboardScreens/ResearchTopicTable/ResearchTopicTable";
import PhysiologicalSystemsTable from "../Screen/DashboardScreens/PhysiologicalSystemsTable/PhysiologicalSystemsTable";
import OrgansTable from "../Screen/DashboardScreens/OrgansTable/OrgansTable";
import MethodsOfAdministrationTable from "../Screen/DashboardScreens/MethodsOfAdministrationTable/MethodsOfAdministrationTable";
import { PdfViewer } from "../Component/PdfViewer/PdfViewer";
import RolesTable from "../Screen/DashboardScreens/RolesTable/RolesTable";
import SectionOneNew from "../Component/ArticleView/SectionOneNew";
import AdminFeedbackSystem from "../Screen/DashboardScreens/FeedbackSystem/FeedbackSystem";
import BiomarkerCategoryTable from "../Screen/DashboardScreens/BiomarkerCategory/BiomarkerCategory";
import AssignArticleScreen from "../Screen/DashboardScreens/ArticleAssign/ArticleAssign";
import ResearcherArticlesScreen from "../Screen/DashboardScreens/ViewAssignArticleResearcher/ViewAssignArticle";
import ContactFormManagement from "../Screen/DashboardScreens/ContactForm/ContactForm";
import Keywords from "../Screen/DashboardScreens/Keywords/Keywords";
import VolunteerContributorAdmin from "../Screen/DashboardScreens/VolunteerContributor/VolunteerContributor";
import DiseaseScreen from "../Screen/DashboardScreens/Diseases/Diseases";
import TutorialManager from "../Screen/TutorialManager/TutorialManager";
import Claims from "../Screen/DashboardScreens/Claims/Claims";

// Icons
import HomeIcon from "@mui/icons-material/Home";
import ArticleIcon from "@mui/icons-material/Article";
import { FaUpload } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa6";
import { GiArchiveResearch } from "react-icons/gi";
import { FaDatabase } from "react-icons/fa";
import { RiTeamLine } from "react-icons/ri";
import { MdAssignment, MdFeedback } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";
import { IoIosContacts } from "react-icons/io";
import { ROLE } from "./roles";

// ==========================
// Main routes (auth/no-auth)
// ==========================
export const mainRoutes = [
  {
    screenName: "Dashboard",
    linkTo: "/*",
    element: <Dashboard />,
    authRequired: true,
  },
  {
    screenName: "Login",
    linkTo: "/login",
    element: <Login />,
    authRequired: false,
  },
];

// =======================================================
// SINGLE SOURCE OF TRUTH: routelistScreens
// - icon present => show in sidebar
// - no icon => route exists but hidden from sidebar
// - allowedRoles => role-based security
// =======================================================
export const routelistScreens = [
  // ======================
  // Common (Admin + Researcher + User)
  // ======================
  {
    screenName: "Home",
    linkTo: "/",
    element: <Home />,
    icon: <HomeIcon />,
    allowedRoles: [ROLE.ADMIN, ROLE.RESEARCHER, ROLE.USER, ROLE.PREMIUM],
  },
  {
    screenName: "Articles",
    linkTo: "/articles",
    element: <Articles />,
    icon: <ArticleIcon />,
    allowedRoles: [ROLE.ADMIN, ROLE.USER],
  },
  {
    screenName: "PMID",
    linkTo: "/pmid",
    element: <PMID />,
    icon: <FaBookmark />,
    allowedRoles: [ROLE.ADMIN, ROLE.PREMIUM],
  },
  {
    screenName: "Feedback",
    linkTo: "/feedback",
    element: <AdminFeedbackSystem />,
    icon: <MdFeedback />,
    allowedRoles: [ROLE.ADMIN],
  },
  {
    screenName: "Contact Form",
    linkTo: "/contact-form",
    element: <ContactFormManagement />,
    icon: <IoIosContacts size={20} />,
    allowedRoles: [ROLE.ADMIN],
  },

  // ======================
  // Researcher pages (Researcher + Admin)
  // ======================
  {
    screenName: "Quality Assurance",
    linkTo: "/quality-assurance",
    element: <ResearcherArticlesScreen />,
    icon: <GiArchiveResearch size={20} />,
    allowedRoles: [ROLE.RESEARCHER],
  },
  {
    screenName: "Tutorial Manager",
    linkTo: "/tutorial-manager",
    element: <TutorialManager />,
    icon: <FaUpload />,
    allowedRoles: [ROLE.RESEARCHER, ROLE.ADMIN, ROLE.PREMIUM],
  },

  // ======================
  // Admin-only menu pages
  // ======================
  {
    screenName: "Assign Article",
    linkTo: "/assign-articles",
    element: <AssignArticleScreen />,
    icon: <MdAssignment size={20} />,
    allowedRoles: [ROLE.ADMIN],
  },
  {
    screenName: "Data Manager",
    linkTo: "/DataManager",
    element: <DataManager />,
    icon: <FaDatabase />,
    allowedRoles: [ROLE.ADMIN],
  },
  {
    screenName: "Ownership Claims",
    linkTo: "/ownership-claims",
    element: <Claims />,
    icon: <FaClipboardList />,
    allowedRoles: [ROLE.ADMIN],
  },
  {
    screenName: "Volunteer",
    linkTo: "/volunteer-contributor",
    element: <VolunteerContributorAdmin />,
    icon: <RiTeamLine size={20} />,
    allowedRoles: [ROLE.ADMIN],
  },

  // ======================
  // Admin-only (hidden from sidebar)
  // ======================
  {
    screenName: "Biomarker Handling",
    linkTo: "/BioMarkerHandling",
    element: <BioMarkerHandling />,
    allowedRoles: [ROLE.ADMIN],
  },
  {
    screenName: "Biomarker Category",
    linkTo: "/biomarker-category",
    element: <BiomarkerCategoryTable />,
    allowedRoles: [ROLE.ADMIN],
  },
  {
    screenName: "Article-Authors",
    linkTo: "/Article-Authors",
    element: <AuthorsHandling />,
    allowedRoles: [ROLE.ADMIN],
  },
  {
    screenName: "Authors-Library",
    linkTo: "/Authors-Library",
    element: <AuthorsLibrary />,
    allowedRoles: [ROLE.ADMIN],
  },
  {
    screenName: "Countries",
    linkTo: "/countries",
    element: <CountryTable />,
    allowedRoles: [ROLE.ADMIN],
  },
  {
    screenName: "Species",
    linkTo: "/species",
    element: <Species />,
    allowedRoles: [ROLE.ADMIN],
  },
  {
    screenName: "Researcher",
    linkTo: "/users",
    element: <Users />,
    allowedRoles: [ROLE.ADMIN],
  },
  {
    screenName: "Roles",
    linkTo: "/roles",
    element: <RolesTable />,
    allowedRoles: [ROLE.ADMIN],
  },
  {
    screenName: "article-type",
    linkTo: "/article-type",
    element: <ArticleTypeTable />,
    allowedRoles: [ROLE.ADMIN],
  },
  {
    screenName: "research-topic",
    linkTo: "/research-topic",
    element: <ResearchTopicTable />,
    allowedRoles: [ROLE.ADMIN],
  },
  {
    screenName: "physiological-systems",
    linkTo: "/physiological-systems",
    element: <PhysiologicalSystemsTable />,
    allowedRoles: [ROLE.ADMIN],
  },
  {
    screenName: "organs-tissues",
    linkTo: "/organs-tissues",
    element: <OrgansTable />,
    allowedRoles: [ROLE.ADMIN],
  },
  {
    screenName: "methods-of-administration",
    linkTo: "/methods-of-administration",
    element: <MethodsOfAdministrationTable />,
    allowedRoles: [ROLE.ADMIN],
  },
  {
    screenName: "Keywords",
    linkTo: "/keywords",
    element: <Keywords />,
    allowedRoles: [ROLE.ADMIN],
  },
  {
    screenName: "Diseases/Disorders",
    linkTo: "/diseases",
    element: <DiseaseScreen />,
    allowedRoles: [ROLE.ADMIN],
  },
  {
    screenName: "BioMarkerAddForm",
    linkTo: "/biomarkar-add-form",
    element: <BioMarkerAddForm />,
    allowedRoles: [ROLE.ADMIN],
  },

  // ======================
  // Common (hidden from sidebar)
  // ======================
  {
    screenName: "MainForm",
    linkTo: "/main-form",
    element: <MainForm />,
    allowedRoles: [ROLE.ADMIN, ROLE.RESEARCHER, ROLE.PREMIUM],
  },
  {
    screenName: "ArticlePreviewPage",
    linkTo: "/article-preview/:id",
    element: <SectionOneNew />,
    allowedRoles: [ROLE.ADMIN, ROLE.RESEARCHER, ROLE.PREMIUM],
  },
  {
    screenName: "pdf-viewer",
    linkTo: "/pdf-viewer",
    element: <PdfViewer />,
    allowedRoles: [ROLE.ADMIN, ROLE.RESEARCHER, ROLE.PREMIUM],
  },
];