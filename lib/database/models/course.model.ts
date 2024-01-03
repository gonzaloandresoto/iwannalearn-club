import { Schema, model, models } from 'mongoose';

export interface ICourse extends Document {
  _id: string;
  title: string;
  summary: string;
  tableOfContents: String;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    tableOfContents: { type: String, required: true },
  },
  { timestamps: true }
);

const Course = models.Course || model('Course', CourseSchema);

export default Course;
