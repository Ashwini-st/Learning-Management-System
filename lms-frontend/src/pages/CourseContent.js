import React from "react";
import { useParams, useNavigate } from "react-router-dom";

function CourseContent() {

  const { id } = useParams();
  const navigate = useNavigate();

  const modules = [
    { id: 1, title: "Introduction to the Course" },
    { id: 2, title: "Basic Concepts" },
    { id: 3, title: "Advanced Topics" },
    { id: 4, title: "Final Project" }
  ];

  return (

    <div style={{ padding:"40px", maxWidth:"800px", margin:"auto" }}>

      <h2>Course Modules</h2>

      <p>Select a module to start learning.</p>

      <div style={{ marginTop:"30px", display:"flex", flexDirection:"column", gap:"15px" }}>

        {modules.map(module => (

          <div
            key={module.id}
            style={moduleStyle}
            onClick={() => navigate(`/course/${id}/module/${module.id}`)}
          >
            {module.title}
          </div>

        ))}

      </div>

    </div>

  );

}

const moduleStyle = {
  padding:"15px",
  border:"1px solid #ddd",
  borderRadius:"8px",
  background:"#f9f9f9",
  cursor:"pointer"
};

export default CourseContent;