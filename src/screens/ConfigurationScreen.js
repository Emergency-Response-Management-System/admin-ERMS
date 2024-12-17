import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import MainConfiguration from "../components/Configuration/MainConfiguration";

const ConfigurationScreen = () => {
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <MainConfiguration />
      </main>
    </>
  );
};

export default ConfigurationScreen;
