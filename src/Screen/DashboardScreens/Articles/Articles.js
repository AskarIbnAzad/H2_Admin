import React, { useEffect } from "react";
import MainForm from "../../../Component/Forms/MainForm/MainForm";
import ArticlesOverviewTable from "../../../Component/ArticlesOverviewTable/ArticlesOverviewTable";
import { useDispatch, useSelector } from "react-redux";
import { resetAddArticleData } from "../../../Store/slices/Article_slice";
import { useLocation } from "react-router-dom";

const Articles = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const addArticleData = useSelector((state) => state.article.add_article_data);

  // Reset whenever we land on /articles
  useEffect(() => {
    if (location.pathname === "/articles") {
      dispatch(resetAddArticleData());
      console.log("add_article_data reset to null");
    }
  }, []);

  // Log the latest value whenever it actually changes
  useEffect(() => {
    console.log("add_article_data is now:", addArticleData);
  }, [addArticleData]);

  return (
    <div>
      <ArticlesOverviewTable />
    </div>
  );
};

export default Articles;
