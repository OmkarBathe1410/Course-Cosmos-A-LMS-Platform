// Importing necessary modules from 'mongoose' for MongoDB object modeling and 'bcryptjs' for password hashing
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

// Regular expression pattern for validating email addresses
const emailRegExPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Interface defining the structure of a user document in the database
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{ courseId: string }>;
  comparePassword: (password: string) => Promise<boolean>;
}

// Defining the user schema using Mongoose Schema
const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (value: string) {
          return emailRegExPattern.test(value);
        },
        message: "Please enter a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      minLength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: String,
      },
    ],
  },
  { timestamps: true }
);

// Middleware to hash the password before saving the user document
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare entered password with the hashed password in the database
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Creating the User model based on the user schema
const userModel: Model<IUser> = mongoose.model("User", userSchema);

// Exporting the User model for use in other parts of the application
export default userModel;