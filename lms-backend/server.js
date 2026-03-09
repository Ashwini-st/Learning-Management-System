const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const db = require("./config/db");

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("LMS API Running 🚀");
});


// ================= AUTH =================

// Register User
app.post("/api/auth/register", (req, res) => {

  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if email already exists
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
      [name, email, hashedPassword, role || "student"],
      (err) => {

        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Registration failed" });
        }

        res.status(201).json({
          message: "User registered successfully ✅"
        });

      }
    );

  });

});


// Login User
app.post("/api/auth/login", (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful ✅",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  });

});


// ================= DATABASE TABLES =================

db.query(`
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role ENUM('student','instructor','admin') DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`, () => console.log("Users table ready ✅"));


db.query(`
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  instructor_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (instructor_id) REFERENCES users(id)
)
`, () => console.log("Courses table ready ✅"));


db.query(`
CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  course_id INT,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
)
`, () => console.log("Enrollments table ready ✅"));


// ================= MIDDLEWARE =================

function authenticateToken(req, res, next) {

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access Denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

    if (err) return res.status(403).json({ message: "Invalid Token" });

    req.user = user;
    next();

  });

}


function authorizeRoles(...roles) {

  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access Forbidden"
      });
    }

    next();
  };

}


// ================= COURSES =================

// Create Course
app.post(
  "/api/courses",
  authenticateToken,
  authorizeRoles("instructor", "admin"),
  (req, res) => {

    console.log("User trying to create course:", req.user);

    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description required"
      });
    }

    db.query(
      "INSERT INTO courses (title, description, instructor_id) VALUES (?,?,?)",
      [title, description, req.user.id],
      (err, result) => {

        if (err) {
          console.error("Course Insert Error:", err);
          return res.status(500).json({
            message: "Course creation failed"
          });
        }

        console.log("Course inserted successfully:", result);

        res.status(201).json({
          message: "Course created successfully 🎉"
        });

      }
    );

  }
);


// Get All Courses
app.get("/api/courses",(req,res)=>{

  db.query(
    "SELECT id,title,description FROM courses",
    (err,results)=>{

      if(err){
        console.error(err);
        return res.status(500).json({
          message:"Failed to fetch courses"
        });
      }

      res.json(results);

  });

});


// Course Details
app.get("/api/courses/:id",(req,res)=>{

  const courseId = req.params.id;

  db.query(
`SELECT courses.id,courses.title,courses.description,users.name AS instructor
 FROM courses
 JOIN users ON courses.instructor_id = users.id
 WHERE courses.id = ?`,
  [courseId],
  (err,results)=>{

    if(err){
      console.error(err);
      return res.status(500).json({
        message:"Failed to fetch course"
      });
    }

    if(results.length === 0){
      return res.status(404).json({
        message:"Course not found"
      });
    }

    res.json(results[0]);

});

});


// ================= ENROLLMENT =================

app.post("/api/courses/:courseId/enroll",
authenticateToken,
authorizeRoles("student"),
(req,res)=>{

const courseId = req.params.courseId;
const userId = req.user.id;

db.query(
"SELECT * FROM enrollments WHERE user_id=? AND course_id=?",
[userId,courseId],
(err,results)=>{

if(results.length > 0){
return res.status(400).json({
message:"Already enrolled"
});
}

db.query(
"INSERT INTO enrollments (user_id,course_id) VALUES (?,?)",
[userId,courseId],
(err)=>{

if(err){
console.error(err);
return res.status(500).json({
message:"Enrollment failed"
});
}

res.status(201).json({
message:"Successfully enrolled 🎉"
});

});

});

});


// ================= MY COURSES =================

app.get("/api/my-courses", authenticateToken, (req, res) => {

const userId = req.user.id;
const role = req.user.role;

if(role === "student"){

db.query(
`SELECT courses.id,courses.title,courses.description
 FROM enrollments
 JOIN courses ON enrollments.course_id = courses.id
 WHERE enrollments.user_id = ?`,
[userId],
(err,results)=>{

if(err){
console.error(err);
return res.status(500).json({
message:"Failed to fetch courses"
});
}

res.json(results);

});

}

// Instructor → courses they created
else if(role === "instructor"){

db.query(
`SELECT id,title,description
 FROM courses
 WHERE instructor_id = ?`,
[userId],
(err,results)=>{

if(err){
console.error(err);
return res.status(500).json({
message:"Failed to fetch courses"
});
}

res.json(results);

});

}

// Admin → all courses
else if(role === "admin"){

db.query(
`SELECT id,title,description FROM courses`,
(err,results)=>{

if(err){
console.error(err);
return res.status(500).json({
message:"Failed to fetch courses"
});
}

res.json(results);

});

}

});

// ================= DELETE COURSE =================

app.delete(
  "/api/courses/:id",
  authenticateToken,
  authorizeRoles("instructor", "admin"),
  (req, res) => {

    const courseId = req.params.id;
    const userId = req.user.id;
    const role = req.user.role;

    db.query(
      "SELECT * FROM courses WHERE id = ?",
      [courseId],
      (err, results) => {

        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Server error" });
        }

        if (results.length === 0) {
          return res.status(404).json({ message: "Course not found" });
        }

        const course = results[0];

        if (role === "instructor" && course.instructor_id !== userId) {
          return res.status(403).json({
            message: "You can delete only your courses"
          });
        }

        // delete enrollments first
        db.query(
          "DELETE FROM enrollments WHERE course_id = ?",
          [courseId],
          (err) => {

            if (err) {
              console.error(err);
              return res.status(500).json({
                message: "Failed to remove enrollments"
              });
            }

            // delete course
            db.query(
              "DELETE FROM courses WHERE id = ?",
              [courseId],
              (err) => {

                if (err) {
                  console.error(err);
                  return res.status(500).json({
                    message: "Failed to delete course"
                  });
                }

                res.json({
                  message: "Course deleted successfully"
                });

              }
            );

          }
        );

      }
    );

});

// ================= SERVER =================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});