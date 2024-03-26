import express from "express"; // Importing the Express framework
import { editCourse, uploadCourse } from "../controllers/course.controller"; // Importing course controller functions
import { authorizeRoles, isAuthenticated } from "../middleware/auth"; // Importing authentication and authorization middleware
// Creating a new Express router for handling course-related routes
const courseRouter = express.Router();

// Setting up a POST route for creating a new course
// Middleware checks if the user is authenticated and has the "admin" role
courseRouter.post(
  "/create-course",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadCourse
);

// Setting up a PUT route for updating an existing course
// Middleware checks if the user is authenticated and has the "admin" role
courseRouter.put(
  "/edit-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  editCourse
);

// Exporting the courseRouter for use in the main application
export default courseRouter;
