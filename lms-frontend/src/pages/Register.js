import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const navigate = useNavigate();

  const registerUser = async () => {

    try {

      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
          role
        }
      );

      alert("Registration successful 🎉");

      navigate("/login");

    } catch (err) {

      alert(err.response?.data?.message || "Registration failed");

    }

  };

  return (

    <div style={containerStyle}>

      {/* LEFT SIDE DESIGN */}

      <div style={leftStyle}>

        <h1>LMS Platform</h1>

        <p>Learn Anytime, Anywhere 🚀</p>

        <p>Upgrade your skills with modern courses.</p>

      </div>


      {/* RIGHT SIDE REGISTER FORM */}

      <div style={rightStyle}>

        <div style={formCard}>

          <h2>Register</h2>

          <input
            style={inputStyle}
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            style={inputStyle}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={inputStyle}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* ROLE DROPDOWN */}

          <label>Select Role</label>

          <select
            style={inputStyle}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>

          <button style={buttonStyle} onClick={registerUser}>
            Register
          </button>

        </div>

      </div>

    </div>

  );

}

export default Register;



/* ---------- STYLES ---------- */

const containerStyle = {
  display: "flex",
  height: "100vh",
  fontFamily: "Arial"
};

const leftStyle = {
  flex: 1,
  background: "#2b7cff",
  color: "white",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px",
  textAlign: "center"
};

const rightStyle = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f5f5f5"
};

const formCard = {
  width: "320px",
  background: "white",
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  gap: "12px"
};

const inputStyle = {
  padding: "10px",
  fontSize: "15px",
  borderRadius: "5px",
  border: "1px solid #ccc"
};

const buttonStyle = {
  marginTop: "10px",
  padding: "10px",
  background: "#2b7cff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px"
};