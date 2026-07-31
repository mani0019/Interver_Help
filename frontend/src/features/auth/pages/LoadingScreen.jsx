import React from "react";
import "../../../style/loading.scss";

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="bg-glow"></div>

      <div className="loading-content">

        <div className="loader">
          <div className="loader-ring"></div>
          <div className="loader-center"></div>
          <span>CN</span>
        </div>

        <h1>Carrier Navigator</h1>

        <p>
          Initializing AI Engine
          <span className="loading-dots"></span>
        </p>

      </div>
    </div>
  );
};

export default LoadingScreen;