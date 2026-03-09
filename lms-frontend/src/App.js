import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Register from "./pages/Register";
import Courses from "./pages/Courses";
import Login from "./pages/LoginPage";
import CourseDetails from "./pages/CourseDetails";
import MyCourses from "./pages/MyCourses";
import Navbar from "./component/Navbar";
import CreateCourse from "./pages/CreateCourse";
import CourseContent from "./pages/CourseContent";
import ModuleContent from "./pages/ModuleContent";
import Home from "./pages/Home";


function Layout() {

  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/courses" element={<Courses />} />

        <Route path="/" element={<Courses />} />

        <Route path="/courses" element={<Courses />} />
        
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/course/:id" element={<CourseDetails />} />

        <Route path="/my-courses" element={<MyCourses />} />

        <Route path="/create-course" element={<CreateCourse />} />

        <Route path="/course/:id/content" element={<CourseContent />} />

        <Route path="/course/:id/module/:moduleId" element={<ModuleContent />} />     

      </Routes>
    </>
  );
}


function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;