import React from "react";
import "./Success.css";

const Success = ({ message, redirectText, redirectLink }) => {
  return (
    <div className="success-container">
      <div className="success-box">
        <h1>Success!</h1>
        <p>{message}</p>
        <a href={redirectLink}>{redirectText}</a>
      </div>
    </div>
  );
};

export default Success;
