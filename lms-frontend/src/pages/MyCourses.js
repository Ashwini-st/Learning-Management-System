import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyCourses() {

const [courses, setCourses] = useState([]);
const navigate = useNavigate();
const role = localStorage.getItem("role");

const deleteCourse = async (courseId) => {


const token = localStorage.getItem("token");

if (!window.confirm("Are you sure you want to delete this course?")) return;

try {

  await axios.delete(
    `http://localhost:5000/api/courses/${courseId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  alert("Course deleted successfully");

  setCourses(courses.filter(course => course.id !== courseId));

} catch (err) {

  console.error(err);
  alert("Delete failed");

}

};

useEffect(() => {

const token = localStorage.getItem("token");

if (!token) {
  alert("Please login first");
  navigate("/login");
  return;
}

axios.get(
  "http://localhost:5000/api/my-courses",
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
)
.then(res => {
  setCourses(res.data);
})
.catch(err => {
  console.error(err);
  alert("Failed to fetch courses");
});


}, [navigate]);

return (

<div style={pageStyle}>

  <h2 style={titleStyle}>My Courses</h2>

  {courses.length === 0 ? (

    <p style={emptyStyle}>
      You have not enrolled in any courses yet.
    </p>

  ) : (

    <div style={containerStyle}>

      {courses.map(course => (

        <div key={course.id} style={cardStyle}>

          <div>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
          </div>

          <div style={buttonContainer}>

            <button
              style={viewButton}
              onClick={() => navigate(`/course/${course.id}`)}
            >
              View
            </button>

            {role !== "student" && (
              <button
                style={deleteButton}
                onClick={() => deleteCourse(course.id)}
              >
                Delete
              </button>
            )}

          </div>

        </div>

      ))}

    </div>

  )}

</div>


);

}

export default MyCourses;

const pageStyle = {
padding: "40px"
};

const titleStyle = {
marginBottom: "30px"
};

const emptyStyle = {
textAlign: "center",
fontSize: "18px",
color: "#777"
};

const containerStyle = {
display: "grid",
gridTemplateColumns: "repeat(auto-fill, 250px)",
gap: "30px",
justifyContent: "center"
};

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "200px"
};

const buttonContainer = {
marginTop: "15px",
display: "flex",
gap: "90px"
};

const viewButton = {
padding: "8px 12px",
background: "#2b7cff",
color: "white",
border: "none",
borderRadius: "5px",
cursor: "pointer"
};

const deleteButton = {
padding: "8px 12px",
background: "#e63946",
color: "white",
border: "none",
borderRadius: "5px",
cursor: "pointer"
};
