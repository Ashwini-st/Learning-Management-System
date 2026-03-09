import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function CourseDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {

    // Fetch course details
    axios.get(`http://localhost:5000/api/courses/${id}`)
      .then(res => {
        setCourse(res.data);
      })
      .catch(err => {
        console.error(err);
      });

    const token = localStorage.getItem("token");

    if (token) {

      axios.get(
        "http://localhost:5000/api/my-courses",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then(res => {

        const enrolledCourses = res.data;

        const alreadyEnrolled = enrolledCourses.some(
          c => c.id === parseInt(id)
        );

        setEnrolled(alreadyEnrolled);

      })
      .catch(err => {
        console.error(err);
      });

    }

  }, [id]);



  const handleEnroll = async () => {

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {

      await axios.post(
        `http://localhost:5000/api/courses/${id}/enroll`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Successfully enrolled in course 🎉");

      setEnrolled(true);

    } catch (error) {

      alert("Enrollment failed or already enrolled");

    }

  };


  if (!course) {
    return <h2>Loading...</h2>;
  }

  return (

  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f7fb"
  }}>

    <div style={{
      width: "450px",
      padding: "30px",
      backgroundColor: "white",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      textAlign: "center"
    }}>

      <h2 style={{marginBottom:"15px"}}>
        {course.title}
      </h2>

      <p style={{color:"#555", marginBottom:"20px"}}>
        {course.description}
      </p>

      <p style={{marginBottom:"25px"}}>
        <b>Instructor:</b> {course.instructor}
      </p>

      <div style={{
        display:"flex",
        justifyContent:"space-between"
      }}>

        <button
          onClick={() => navigate("/")}
          style={{
            padding:"10px 20px",
            border:"none",
            backgroundColor:"#e0e0e0",
            borderRadius:"6px",
            cursor:"pointer"
          }}
        >
          Back
        </button>

        {enrolled ? (

          <button
            onClick={() => navigate(`/course/${id}/content`)}
            style={{
              padding:"10px 20px",
              border:"none",
              backgroundColor:"#2196F3",
              color:"white",
              borderRadius:"6px",
              cursor:"pointer"
            }}
          >
            Continue Learning
          </button>

        ) : (

          <button
            onClick={handleEnroll}
            style={{
              padding:"10px 20px",
              border:"none",
              backgroundColor:"#4CAF50",
              color:"white",
              borderRadius:"6px",
              cursor:"pointer"
            }}
          >
            Enroll
          </button>

        )}

      </div>

    </div>

  </div>

);

}

export default CourseDetails;