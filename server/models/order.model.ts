// Import Mongoose library and its components
import mongoose, { Document, Schema, Model } from "mongoose";

// Define the IOrder interface that extends Mongoose Document interface
export interface IOrder extends Document {
  // Unique identifier for the course
  courseId: string;

  // Unique identifier for the user
  userId: string;

  // Payment information for the course
  payment_info: object;
}

// Create a Mongoose Schema object for the IOrder interface
const orderSchema = new Schema<IOrder>(
  {
    // Define the courseId field (required)
    courseId: {
      type: String,
      required: true,
    },

    // Define the userId field (required)
    userId: {
      type: String,
      required: true,
    },

    // Define the payment_info field (not required)
    payment_info: {
      type: Object,
    },
  },
  // Enable timestamps for tracking createdAt and updatedAt fields
  { timestamps: true }
);

// Create a Mongoose Model object using the orderSchema and the "Order" model name
const OrderModel: Model<IOrder> = mongoose.model("Order", orderSchema);

// Export the OrderModel for use in other parts of the application
export default OrderModel;
