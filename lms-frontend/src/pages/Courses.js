import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Courses() {

  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    axios.get("http://localhost:5000/api/courses")
      .then(res => {
        console.log("Courses from API:", res.data);
        setCourses(res.data);
      })
      .catch(err => {
        console.error(err);
      });

  }, []);

  return (

    <div style={containerStyle}>

      {courses.length === 0 && (
        <h2>Loading courses...</h2>
      )}

      {courses.map(course => (

  <div key={course.id} style={cardStyle}>

    <div>
      <h3>{course.title}</h3>
      <p>{course.description}</p>
    </div>

    <button
      style={buttonStyle}
      onMouseEnter={(e) => e.target.style.background = "#1d4ed8"}
      onMouseLeave={(e) => e.target.style.background = "#2563eb"}
      onClick={() => navigate(`/course/${course.id}`)}
    >
    View Course
    </button>

  </div>

))}

    </div>

  );

}

export default Courses;



const containerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "30px"
};

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  minHeight: "200px"
};

const buttonStyle = {
  marginTop: "10px",
  padding: "8px 12px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  transition: "background 0.2s ease"
};