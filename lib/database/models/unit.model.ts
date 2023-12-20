import { Schema, model, models } from 'mongoose';

export interface IUnit extends Document {
  _id: string;
  title: string;
  imageUrl?: string;
  summary?: string;
  status: string;
  order: string;
  courseId: { _id: string };
}

const UnitSchema = new Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: false, default: '' },
  summary: { type: String, required: false },
  status: { type: String, required: true },
  order: { type: String, required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
});

const Unit = models.Unit || model('Unit', UnitSchema);

export default Unit;
