import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const navigate = useNavigate();

const handleLogin = async () => {


try {

  const res = await axios.post(
    "http://localhost:5000/api/auth/login",
    {
      email,
      password
    }
  );

  // Save token
  localStorage.setItem("token", res.data.token);

  // Decode token to extract role
  const payload = JSON.parse(
    atob(res.data.token.split(".")[1])
  );

  // Save role
  localStorage.setItem("role", payload.role);

  alert("Login Successful 🎉");

  navigate("/");

} catch (error) {

  alert(
    error.response?.data?.message || "Login Failed"
  );

}

};

return (


<div style={{ textAlign: "center", marginTop: "100px" }}>

  <h2>LMS Login</h2>

  <input
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    style={{ padding: "8px", width: "250px" }}
  />

  <br /><br />

  <input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    style={{ padding: "8px", width: "250px" }}
  />

  <br /><br />

  <button
    onClick={handleLogin}
    style={{
      padding: "10px 15px",
      background: "#2b7cff",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer"
    }}
  >
    Login
  </button>

  <p style={{ marginTop: "15px" }}>
    Don't have an account?
    <Link to="/register"> Register</Link>
  </p>

</div>

);

}

export default Login;
