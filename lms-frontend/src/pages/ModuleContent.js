import React from "react";
import { useParams, useNavigate } from "react-router-dom";

function ModuleContent() {

  const { id, moduleId } = useParams();
  const navigate = useNavigate();

  const moduleContent = {
    1: "Welcome to the course! In this module we introduce the main concepts.",
    2: "Here you will learn the basic concepts and foundations.",
    3: "This module covers advanced topics with real-world examples.",
    4: "In this final module you will complete a small project."
  };

  return (

    <div style={{ padding:"40px", maxWidth:"800px", margin:"auto" }}>

      <h2>Module {moduleId}</h2>

      <p style={{ marginTop:"20px" }}>
        {moduleContent[moduleId]}
      </p>

      <button
        onClick={() => navigate(`/course/${id}/content`)}
        style={{
          marginTop:"30px",
          padding:"10px 20px",
          border:"none",
          background:"#2b7cff",
          color:"white",
          borderRadius:"6px",
          cursor:"pointer"
        }}
      >
        Back to Modules
      </button>

    </div>

  );

}

export default ModuleContent;