import React, { useState } from "react";
import axios from "axios";

function CreateCourse() {

const role = localStorage.getItem("role");

const [title, setTitle] = useState("");
const [description, setDescription] = useState("");

// Restrict access to instructors/admins
if (role !== "instructor" && role !== "admin") {
return (
<h2 style={{ textAlign: "center", marginTop: "100px" }}>
Access Denied </h2>
);
}

const createCourse = async () => {

try {

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login again");
    return;
  }

  await axios.post(
    "http://localhost:5000/api/courses",
    {
      title,
      description
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  alert("Course created successfully 🎉");

  setTitle("");
  setDescription("");

} catch (err) {
  console.log(err.response);
  alert(err.response?.data?.message || "Course creation failed");
}

};

return (

<div style={{ textAlign: "center", marginTop: "100px" }}>

  <h2>Create Course</h2>

  <input
    placeholder="Course Title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    style={{
      padding: "8px",
      width: "250px"
    }}
  />

  <br /><br />

  <textarea
    placeholder="Course Description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    style={{
      padding: "8px",
      width: "250px",
      height: "80px"
    }}
  />

  <br /><br />

  <button
    onClick={createCourse}
    style={{
      padding: "10px 15px",
      background: "#2b7cff",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer"
    }}
  >
    Create Course
  </button>

</div>
);

}

export default CreateCourse;
