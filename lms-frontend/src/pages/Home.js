import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {

  const navigate = useNavigate();

  return (

    <div style={homeStyle}>

      <h1>Welcome to LMS</h1>

      <p>
        Learn new skills, explore courses, and improve your knowledge.
      </p>

      <button
        style={buttonStyle}
        onClick={() => navigate("/courses")}
      >
        Browse Courses
      </button>

    </div>

  );

}

export default Home;

const homeStyle = {
  textAlign: "center",
  marginTop: "120px"
};

const buttonStyle = {
  marginTop: "20px",
  padding: "10px 16px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};