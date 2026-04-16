import Articles from "../Screen/DashboardScreens/Articles/Articles";
import Home from "../Screen/DashboardScreens/Home/Home";
import BioMarker from "../Screen/DashboardScreens/BioMarker/BioMarker";
import Species from "../Screen/DashboardScreens/Species/Species";
import HomeIcon from "@mui/icons-material/Home";
import ArticleIcon from "@mui/icons-material/Article";
import BiotechIcon from "@mui/icons-material/Biotech";
import PetsIcon from "@mui/icons-material/Pets";
import MainForm from "../Component/Forms/MainForm/MainForm";
import { FaUpload } from "react-icons/fa";
import { PiUsersFill } from "react-icons/pi";
import { FaBookmark } from "react-icons/fa6";
import { GiArchiveResearch, GiAstronautHelmet, GiHelp } from "react-icons/gi";
import { SiAegisauthenticator } from "react-icons/si";
import { GiWorld } from "react-icons/gi";
import { FaDatabase } from "react-icons/fa";
import { RiTeamLine } from 'react-icons/ri'; // Team/volunteer feel

import Upload from "../Screen/DashboardScreens/Upload/Upload";
import BioMarkerAddForm from "../Component/BioMarkerAddForm/BioMarkerAddForm";
import Users from "../Screen/DashboardScreens/Users/Users";
import Login from "../Screen/Login/Login";
import Dashboard from "../Screen/Dashboard/Dashboard";
import PMID from "../Screen/DashboardScreens/PMID/PMID";
import ArticlePreviewPage from "../Screen/DashboardScreens/Articles/ArticlePreviewPage";
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
import { MdAssignment, MdFeedback } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";
import AdminFeedbackSystem from "../Screen/DashboardScreens/FeedbackSystem/FeedbackSystem";
import BiomarkerCategoryTable from "../Screen/DashboardScreens/BiomarkerCategory/BiomarkerCategory";
import AssignArticleScreen from "../Screen/DashboardScreens/ArticleAssign/ArticleAssign";
import ResearcherArticlesScreen from "../Screen/DashboardScreens/ViewAssignArticleResearcher/ViewAssignArticle";
import { IoIosContacts } from "react-icons/io";
import ContactFormManagement from "../Screen/DashboardScreens/ContactForm/ContactForm";
import Keywords from "../Screen/DashboardScreens/Keywords/Keywords";
import VolunteerContributorAdmin from "../Screen/DashboardScreens/VolunteerContributor/VolunteerContributor";
import DiseaseScreen from "../Screen/DashboardScreens/Diseases/Diseases";
import TutorialManager from "../Screen/TutorialManager/TutorialManager";
import Claims from "../Screen/DashboardScreens/Claims/Claims";

export const
  oldmainRoutes = [
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

export const oldroutelist = [
  {
    screenName: "Home",
    linkTo: "/",
    icon: <HomeIcon />,
  },
  {
    screenName: "Articles",
    linkTo: "/articles",
    icon: <ArticleIcon />,
  },
  {
    screenName: "Assign Article",
    linkTo: "/assign-articles",
    icon: <MdAssignment size={20} />,
  },
  {
    screenName: "Data Manager",
    linkTo: "/DataManager",
    icon: <FaDatabase />,
  },
  {
      screenName: "Tutorial Manager",
      linkTo: "/tutorial-manager",
      icon: <FaUpload />
  },
  {
    screenName: "Ownership Claims",
    linkTo: "/ownership-claims",
    icon: <FaClipboardList />,
  },

  {
    screenName: "PMID",
    linkTo: "/pmid",
    icon: <FaBookmark />,
  },
  {
    screenName: "Feedback",
    linkTo: "/feedback",
    icon: <MdFeedback />,
  },
  {
    screenName: "Contact Form",
    linkTo: "/contact-form",
    icon: <IoIosContacts size={20} />,
  },
  {
    screenName: "Volunteer",
    linkTo: "/volunteer-contributor",
    icon: <RiTeamLine size={20} />,
  },
];

export const oldResearcherRoute = [
  {
    screenName: "Home",
    linkTo: "/",
    icon: <HomeIcon />,
  },
  {
    screenName: "Quality Assurance",
    linkTo: "/quality-assurance",
    icon: <GiArchiveResearch size={20} />,
  },
  {
    screenName: "Trainings/Tutorials",
    linkTo: "/tutorial-manager",
    icon: <GiHelp size={20} />,
  },
];
export const olduserRoute = [
  {
    screenName: "Home",
    linkTo: "/",
    icon: <HomeIcon />,
  },
  {
    screenName: "Articles",
    linkTo: "/articles",
    
    icon: <ArticleIcon />,
  },

];

export const oldroutelistScreens = [
  {
    screenName: "Home",
    linkTo: "/",
    element: <Home />,
  },
  {
    screenName: "Articles",
    linkTo: "/articles",
    element: <Articles />,
  },
  {
    screenName: "Assign Article",
    linkTo: "/assign-articles",
    element: <AssignArticleScreen />,
  },
  {
    screenName: "DataManager",
    linkTo: "/DataManager",
    element: <DataManager />,
  },
  {
    screenName: "Tutorial Manager", 
    linkTo: "/tutorial-manager",
    element: <TutorialManager />,

  },
  {
    screenName: "Ownership Claims",
    linkTo: "/ownership-claims",
    element: <Claims />,
  },
  {
    screenName: "Biomarker Handling",
    linkTo: "/BioMarkerHandling",
    element: <BioMarkerHandling />,
  },
  {
    screenName: "Biomarker Category",
    linkTo: "/biomarker-category",
    element: <BiomarkerCategoryTable />,
  },
  {
    screenName: "Article-Authors",
    linkTo: "/Article-Authors",
    element: <AuthorsHandling />,
  },
  {
    screenName: "Authors-Library",
    linkTo: "/Authors-Library",
    element: <AuthorsLibrary />,
  },
  {
    screenName: "Countries",
    linkTo: "/countries",
    element: <CountryTable />,
  },
  {
    screenName: "Species",
    linkTo: "/species",
    element: <Species />,
  },
  {
    screenName: "Researcher",
    linkTo: "/users",
    element: <Users />,
  },
  {
    screenName: "Roles",
    linkTo: "/roles",
    element: <RolesTable />,
  },
  {
    screenName: "PMID",
    linkTo: "/pmid",
    element: <PMID />,
  },
  {
    screenName: "MainForm",
    linkTo: "/main-form",
    element: <MainForm />,
  },
  {
    screenName: "BioMarkerAddForm",
    linkTo: "/biomarkar-add-form",
    element: <BioMarkerAddForm />,
  },
  {
    screenName: "ArticlePreviewPage",
    linkTo: "/article-preview/:id",
    element: <SectionOneNew />,
  },
  {
    screenName: "article-type",
    linkTo: "/article-type",
    element: <ArticleTypeTable />,
  },
  {
    screenName: "research-topic",
    linkTo: "/research-topic",
    element: <ResearchTopicTable />,
  },
  {
    screenName: "physiological-systems",
    linkTo: "/physiological-systems",
    element: <PhysiologicalSystemsTable />,
  },
  {
    screenName: "organs-tissues",
    linkTo: "/organs-tissues",
    element: <OrgansTable />,
  },
  {
    screenName: "AdminFeedbackSystem",
    linkTo: "/feedback",
    element: <AdminFeedbackSystem />,
  },
  {
    screenName: "methods-of-administration",
    linkTo: "/methods-of-administration",
    element: <MethodsOfAdministrationTable />,
  },
  {
    screenName: "pdf-viewer",
    linkTo: "/pdf-viewer",
    element: <PdfViewer />,
  },
  {
    screenName: "Quality Assurance",
    linkTo: "/quality-assurance",
    element: <ResearcherArticlesScreen />,
  },
  {
    screenName: "Contact Forn",
    linkTo: "/contact-form",
    element: <ContactFormManagement />,
  },
  {
    screenName: "Volunteer",
    linkTo: "/volunteer-contributor",
    element: <VolunteerContributorAdmin />,
  },
  {
    screenName: "Keywords",
    linkTo: "/keywords",
    element: <Keywords />,
  },


  {
    screenName: "Diseases/Disorders",
    linkTo: "/diseases",
    element: <DiseaseScreen />,
  },
  //add 
];
