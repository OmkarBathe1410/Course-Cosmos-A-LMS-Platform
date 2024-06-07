"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // Importing the Express framework
const course_controller_1 = require("../controllers/course.controller"); // Importing course controller functions
const auth_1 = require("../middleware/auth"); // Importing authentication and authorization middleware
// Creating a new Express router for handling course-related routes
const courseRouter = express_1.default.Router();
// Setting up a POST route for creating a new course
// Middleware checks if the user is authenticated and has the "admin" role
courseRouter.post("/create-course", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), course_controller_1.uploadCourse);
// Setting up a PUT route for updating an existing course
// Middleware checks if the user is authenticated and has the "admin" role
courseRouter.put("/edit-course/:id", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), course_controller_1.editCourse);
// Setting up a GET route for fetching a single course
courseRouter.get("/get-course/:id", course_controller_1.getSingleCourse);
// Setting up a GET route for fetching all the courses
courseRouter.get("/get-courses", course_controller_1.getAllCourses);
// Setting up a GET route for fetching a single course's content [only for valid user]
courseRouter.get("/get-course-content/:id", auth_1.isAuthenticated, course_controller_1.getCourseByUser);
// Setting up a PUT route for adding a new question to the specified course
courseRouter.put("/add-question", auth_1.isAuthenticated, course_controller_1.addQuestion);
// Setting up a PUT route for adding a new answwer to the specified question in a course
courseRouter.put("/add-answer", auth_1.isAuthenticated, course_controller_1.addAnswer);
// Setting up a PUT route for adding a new review to the specified course
courseRouter.put("/add-review/:id", auth_1.isAuthenticated, course_controller_1.addReview);
// Setting up a PUT route for adding an answer to a review to the specified course
courseRouter.put("/add-review-reply", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), course_controller_1.addReplyToReview);
// Define a GET route "/get-all-courses/" using courseRouter
// Call the getAllCoursesForAdmin middleware function to fetch and send all courses as a JSON response
courseRouter.get("/get-all-courses/", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), course_controller_1.getAllCoursesForAdmin);
courseRouter.post("/getVdoCipherOTP", course_controller_1.generateVideoUrl);
/* Define a DELETE route for deleting a course. */
courseRouter.delete("/delete-course/:id", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), course_controller_1.deleteCourse);
// Exporting the courseRouter for use in the main application
exports.default = courseRouter;
