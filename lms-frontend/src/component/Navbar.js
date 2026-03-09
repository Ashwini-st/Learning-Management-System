import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {

const navigate = useNavigate();
const role = localStorage.getItem("role");

const logout = () => {
localStorage.removeItem("token");
localStorage.removeItem("role");
navigate("/login");
};

return (

<div style={styles.navbar}>

  <h2 style={styles.logo}>Learning Management System</h2>

  <div style={styles.navLinks}>

    <NavLink
      to="/"
      style={({ isActive }) => ({
        ...styles.link,
        borderBottom: isActive ? "2px solid #60a5fa" : "none"
      })}
      onMouseEnter={(e)=>e.target.style.color="#60a5fa"}
      onMouseLeave={(e)=>e.target.style.color="white"}
    >
      Home
    </NavLink>

    <NavLink
      to="/courses"
      style={({ isActive }) => ({
        ...styles.link,
        borderBottom: isActive ? "2px solid #60a5fa" : "none"
      })}
      onMouseEnter={(e)=>e.target.style.color="#60a5fa"}
      onMouseLeave={(e)=>e.target.style.color="white"}
    >
      Courses
    </NavLink>

    <NavLink
      to="/my-courses"
      style={({ isActive }) => ({
        ...styles.link,
        borderBottom: isActive ? "2px solid #60a5fa" : "none"
      })}
      onMouseEnter={(e)=>e.target.style.color="#60a5fa"}
      onMouseLeave={(e)=>e.target.style.color="white"}
    >
      My Courses
    </NavLink>

    {(role === "instructor" || role === "admin") && (
      <NavLink
        to="/create-course"
        style={({ isActive }) => ({
          ...styles.link,
          borderBottom: isActive ? "2px solid #60a5fa" : "none"
        })}
        onMouseEnter={(e)=>e.target.style.color="#60a5fa"}
        onMouseLeave={(e)=>e.target.style.color="white"}
      >
        Create Course
      </NavLink>
    )}

    <button
      style={styles.logout}
      onMouseEnter={(e)=>e.target.style.background="#b91c1c"}
      onMouseLeave={(e)=>e.target.style.background="red"}
      onClick={logout}
    >
      Logout
    </button>

  </div>

</div>

);
}

const styles = {

navbar:{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
background:"#1f2937",
color:"white",
padding:"15px 30px"
},

logo:{
margin:0
},

navLinks:{
display:"flex",
alignItems:"center",
gap:"20px"
},

link:{
color:"white",
textDecoration:"none",
fontSize:"16px",
paddingBottom:"3px",
transition:"color 0.2s ease"
},

logout:{
padding:"6px 12px",
background:"red",
color:"white",
border:"none",
borderRadius:"4px",
cursor:"pointer",
transition:"background 0.2s ease"
}

};

export default Navbar;
