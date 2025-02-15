import React from "react";

const Loading = () => {
  return (
    <div className="loading-icon d-flex justify-content-center">
      <div
        className="spinner-border text-success"
        role="status"
        style={{ width: "50px", height: "50px" }}
      >
        <span className="sr-only">Đang tải...</span>
      </div>
    </div>
  );
};

export default Loading;
