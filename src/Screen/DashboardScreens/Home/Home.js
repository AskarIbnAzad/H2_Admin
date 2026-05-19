import React, { useEffect, useMemo, useState } from "react";
import { Stack } from "@mui/material";
import DashboardHome from "../../../Component/DashboardCard/DashboardCard";
import { Oval } from "react-loader-spinner";
import { colorTheme } from "../../../Utils/colortheme";
import { apiHandle } from "../../../Config/ApiHandle/apiHandle";
import DashboardCharts from "../../../Component/DashboardCharts";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [homeData, setHomeData] = useState(null);

  useEffect(() => {
    fetchHomePageData();
  }, []);

  const fetchHomePageData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiHandle.get(
          `${process.env.REACT_APP_API_BASE_URL}/home-page`
      );

      if (response?.data?.data) {
        setHomeData(response.data.data);
      } else {
        setHomeData(null);
      }
    } catch (err) {
      setError("Error fetching data");
      setHomeData(null);
    } finally {
      setLoading(false);
    }
  };

  const cardData = homeData;

  const normalizeYearData = (raw) => {
    if (Array.isArray(raw)) {
      return raw.map((item) => ({
        year: item?.year,
        count: Number(item?.count || 0),
      }));
    }

    if (raw && typeof raw === "object") {
      return Object.entries(raw).map(([year, count]) => ({
        year,
        count: Number(count || 0),
      }));
    }

    return [];
  };

  const normalizeKeyValueData = (raw) => {
    if (Array.isArray(raw)) {
      return raw.reduce((acc, item) => {
        const key = item?.name ?? item?.key ?? item?.label;
        const value = Number(item?.value ?? item?.count ?? 0);

        if (key) acc[key] = value;
        return acc;
      }, {});
    }

    if (raw && typeof raw === "object") {
      return raw;
    }

    return {};
  };

  const normalizeOrganData = (raw) => {
    if (Array.isArray(raw)) {
      return raw.map((item) => ({
        name: item?.name,
        count: Number(item?.count || 0),
      }));
    }

    if (raw && typeof raw === "object") {
      return Object.entries(raw).map(([name, count]) => ({
        name,
        count: Number(count || 0),
      }));
    }

    return [];
  };

  /**
   * Keep the previous DashboardCharts data format.
   * This supports both old home-page keys and admin/api keys.
   */
  const dashboardChartData = useMemo(() => {
    return {
      ArticlesByYearData: normalizeYearData(
          homeData?.yearsGraph ?? homeData?.years_graph
      ),
      ResearchByTopicData: normalizeKeyValueData(
          homeData?.researchTopics ?? homeData?.research_topics
      ),
      StudyByTypeData: normalizeKeyValueData(
          homeData?.studyTypes ?? homeData?.study_type
      ),
      StudyBySpeciesData: normalizeKeyValueData(
          homeData?.species ?? homeData?.specie_count
      ),
      StudyByOrganData: normalizeOrganData(homeData?.organs),
    };
  }, [homeData]);

  if (loading) {
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

  if (error) {
    return (
        <div className="flex items-center justify-center py-20">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
    );
  }

  return (
      <div style={{ marginTop: "20px" }}>
        <Stack spacing={3}>
          <DashboardHome data={cardData} refetchData={fetchHomePageData} />

          <div className="max-w-[1200px] 1366px:max-w-[1280px] 1440px:max-w-[1360px] 1920px:max-w-[1800px] mx-auto p-4">
            <DashboardCharts data={dashboardChartData} />
          </div>
        </Stack>
      </div>
  );
};

export default Home;
