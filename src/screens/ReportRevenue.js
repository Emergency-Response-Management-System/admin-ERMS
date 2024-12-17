import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import DashboardChart from "../components/DashboardEquipment/index";
import { useParams } from "react-router-dom";
import ReportRevenueChart from "../components/ReportRevenue";

const ReportRevenueScreen = () => {
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <ReportRevenueChart />
      </main>
    </>
  );
};

export default ReportRevenueScreen;
