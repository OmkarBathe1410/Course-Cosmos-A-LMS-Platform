import express from "express"; // Importing the Express framework
import {
  addAnswer,
  addQuestion,
  addReplyToReview,
  addReview,
  deleteCourse,
  editCourse,
  generateVideoUrl,
  getAllCourses,
  getAllCoursesForAdmin,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller"; // Importing course controller functions
import { authorizeRoles, isAuthenticated } from "../middleware/auth"; // Importing authentication and authorization middleware
import { updateAccessToken } from "../controllers/user.controller";

// Creating a new Express router for handling course-related routes
const courseRouter = express.Router();

// Setting up a POST route for creating a new course
// Middleware checks if the user is authenticated and has the "admin" role
courseRouter.post(
  "/create-course",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  uploadCourse
);

// Setting up a PUT route for updating an existing course
// Middleware checks if the user is authenticated and has the "admin" role
courseRouter.put(
  "/edit-course/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  editCourse
);

// Setting up a GET route for fetching a single course
courseRouter.get("/get-course/:id", getSingleCourse);

// Setting up a GET route for fetching all the courses
courseRouter.get("/get-courses", getAllCourses);

// Setting up a GET route for fetching a single course's content [only for valid user]
courseRouter.get(
  "/get-course-content/:id",
  updateAccessToken,
  isAuthenticated,
  getCourseByUser
);

// Setting up a PUT route for adding a new question to the specified course
courseRouter.put(
  "/add-question",
  updateAccessToken,
  isAuthenticated,
  addQuestion
);

// Setting up a PUT route for adding a new answwer to the specified question in a course
courseRouter.put("/add-answer", updateAccessToken, isAuthenticated, addAnswer);

// Setting up a PUT route for adding a new review to the specified course
courseRouter.put(
  "/add-review/:id",
  updateAccessToken,
  isAuthenticated,
  addReview
);

// Setting up a PUT route for adding an answer to a review to the specified course
courseRouter.put(
  "/add-review-reply/",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  addReplyToReview
);

// Define a GET route "/get-all-courses/" using courseRouter
// Call the getAllCoursesForAdmin middleware function to fetch and send all courses as a JSON response
courseRouter.get(
  "/get-all-courses/",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getAllCoursesForAdmin
);

courseRouter.post("/getVdoCipherOTP", generateVideoUrl);

/* Define a DELETE route for deleting a course. */
courseRouter.delete(
  "/delete-course/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  deleteCourse
);

// Exporting the courseRouter for use in the main application
export default courseRouter;
