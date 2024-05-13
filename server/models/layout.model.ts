import mongoose, { Document, Model, Schema, model } from "mongoose";

// Define an interface representing Frequently Asked Questions (FAQ) items.
interface IFaqItem extends Document {
  question: string;
  answer: string;
}

// Define an interface representing content categories.
interface ICategory extends Document {
  title: string;
}

// Define an interface representing the overall page layout structure.
interface ILayout extends Document {
  type: string;
  faq: IFaqItem[];
  categories: ICategory[];
}

// Create Mongoose schema for the FAQ items.
const faqSchema = new Schema<IFaqItem>({
  question: {
    type: String,
  },
  answer: {
    type: String,
  },
});

// Create Mongoose schema for the content categories.
const categorySchema = new Schema<ICategory>({
  title: {
    type: String,
  },
});

// Create Mongoose schema for the overall page layout.
const layoutSchema = new Schema<ILayout>({
  type: {
    type: String,
  },
  faq: [faqSchema],
  categories: [categorySchema],
});

// Create Mongoose model for the overall page layout and store it under the 'Layout' collection.
const LayoutModel: Model<ILayout> = mongoose.model("Layout", layoutSchema);

// Export the LayoutModel as the default export to be used elsewhere in the application.
export default LayoutModel;
