import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import MainDrugCancel from "../components/DrugCancel/MainDrugCancel";
import { withAuthorization } from "../util/withAuthorization ";
import { PERMISSIONS } from "../util/RolesContanst";

const DrugCancelScreen = ({ match }) => {
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <MainDrugCancel />
      </main>
    </>
  );
};

export default DrugCancelScreen;
