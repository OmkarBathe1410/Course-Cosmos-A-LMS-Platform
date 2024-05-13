import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model";

// Defines a comment document interface extending the base Document type
// It includes properties for the user, question, and optional question replies
interface IComment extends Document {
  user: IUser;
  question: string;
  questionReplies?: IComment[];
}

// Defines a review document interface extending the base Document type
// It includes properties for the user, rating, comment, and optional comment replies
interface IReview extends Document {
  user: IUser;
  rating: number;
  comment: string;
  commentReplies?: IComment[];
}

// Defines a link document interface extending the base Document type
// It includes properties for the title and URL of the link
interface ILink extends Document {
  title: string;
  url: string;
}

// Defines a course data document interface extending the base Document type
// It includes properties specific to a course, such as title, description, video URL, and more
interface ICourseData extends Document {
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail: object;
  videoSection: string;
  videoLength: number;
  videoPlayer: string;
  links: ILink[];
  suggestion: string;
  questions: IComment[];
}

// Defines a course document interface extending the base Document type
// It includes various properties related to a course, such as name, description, price, tags, and more
interface ICourse extends Document {
  name: string;
  description: string;
  category: string;
  price: number;
  estimatedPrice?: number;
  thumbnail: object;
  tags: string;
  level: string;
  demoVideoUrl: string;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  reviews: IReview[];
  courseData: ICourseData[];
  ratings?: number;
  purchased?: number;
}

// Define the review schema with properties for user, rating, comment, and comment replies
const reviewSchema = new Schema<IReview>({
  user: Object,
  rating: {
    type: Number,
    default: 0,
  },
  comment: String,
  commentReplies: [Object],
});

// Define the link schema with properties for title and URL
const linkSchema = new Schema<ILink>({
  title: String,
  url: String,
});

// Define the comment schema with properties for user, question, and question replies
const commentSchema = new Schema<IComment>({
  user: Object,
  question: String,
  questionReplies: [Object],
});

// Define the course data schema with various properties such as title, description, video URL, links, and questions
const courseDataSchema = new Schema<ICourseData>({
  title: String,
  description: String,
  videoUrl: String,
  videoSection: String,
  videoLength: Number,
  videoPlayer: String,
  links: [linkSchema],
  suggestion: String,
  questions: [commentSchema],
});

// Define the course schema with various properties such as name, description, price, tags, and nested schemas like reviews and course data
const courseSchema = new Schema<ICourse>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      required: true,
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    estimatedPrice: {
      type: Number,
    },
    thumbnail: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    tags: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    demoVideoUrl: {
      type: String,
      required: true,
    },
    benefits: [{ title: String }],
    prerequisites: [{ title: String }],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    ratings: {
      type: Number,
      default: 0,
    },
    purchased: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true } // Adds timestamps (createdAt and updatedAt) to the schema
);

// Define the CourseModel as a Mongoose model with the 'Course' name and the courseSchema
const CourseModel: Model<ICourse> = mongoose.model("Course", courseSchema);

// Export the CourseModel for use in other parts of the application
export default CourseModel;
