import React from "react";
import Sidebar from "./../components/Sidebar";
import Header from "./../components/Header";
import DashboardChart from "../components/DashboardEquipment/index";
import { useParams } from "react-router-dom";

const ChartScreen = () => {
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <DashboardChart />
      </main>
    </>
  );
};

export default ChartScreen;
