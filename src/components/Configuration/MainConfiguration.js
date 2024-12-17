import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Toast from "../LoadingError/Toast";
import { toast } from "react-toastify";
import EditConfiguration from "./EditConfiguration";
import { CONFIGURATION_UPDATE_RESET } from "../../Redux/Constants/ConfigurationConstants";
import { singleConfiguration } from "../../Redux/Actions/ConfigurationAction";

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000,
};
const MainConfiguration = () => {
  const dispatch = useDispatch();
 
  const [updateCallback, setUpdatecallback] = useState("");

  const updateCallbackFunction = (childData) => {
    setUpdatecallback(childData);
  };

  useEffect(() => {
    if (updateCallback) {
      toast.success("Cấu hình đã được cập nhật", ToastObjects);
      dispatch({ type: CONFIGURATION_UPDATE_RESET });
      setUpdatecallback(null);
    }
  }, [dispatch, updateCallback]);

  return (
    <>
      <Toast />
      <section className="content-main">
        <div className="content-header">
          <h2 className="content-title">Cấu hình</h2>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <div className="row">
              <EditConfiguration
                parentCallbackUpdate={updateCallbackFunction}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MainConfiguration;
