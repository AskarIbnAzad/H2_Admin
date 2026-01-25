import React, { useEffect } from "react";
import { Stack } from "@mui/material";
import DashboardHome from "../../../Component/DashboardCard/DashboardCard";
import { useDispatch, useSelector } from "react-redux";
import { get_dashboard_data_service_auth } from "../../../Services/ArticleService";
import { Oval } from "react-loader-spinner";
import { asyncStatus } from "../../../Utils/asyncStatus";
import { colorTheme } from "../../../Utils/colortheme";
import DashboardCharts from "../../../Component/DashboardCharts";

const Home = () => {
  const dispatch = useDispatch();
  const {
    get_dashboard_data_status,
    get_dashboard_data_data,
    get_dashboard_data_error,
  } = useSelector((state) => state.article);

  useEffect(() => {
    dispatch(get_dashboard_data_service_auth());
  }, [dispatch]);

  const cardData = get_dashboard_data_data?.data;
  const chartData = {
    TotalArticlesOverTime: get_dashboard_data_data?.data?.years_graph,
    Organs: get_dashboard_data_data?.data?.organs,
    ResearchbyTopic: get_dashboard_data_data?.data?.research_topics,
    ResearchbySpecies: get_dashboard_data_data?.data?.specie_count,
    ArticlesbyStatus: get_dashboard_data_data?.data?.status,
    StudyTypes: get_dashboard_data_data?.data?.study_type,
  };

  console.log("Dashboard Data:", get_dashboard_data_data);

  if (get_dashboard_data_status === asyncStatus.LOADING) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Oval
          secondaryColor="lightblue"
          color={colorTheme.primary}
          height={50}
          width={50}
        />
        <p className="mt-4 text-lg font-medium text-gray-600">
          Loading please wait...
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <Stack>
        <DashboardHome
          data={cardData}
          refetchData={() => dispatch(get_dashboard_data_service_auth())}
        />
      </Stack>
      <DashboardCharts chartData={chartData} />
    </div>
  );
};

export default Home;
