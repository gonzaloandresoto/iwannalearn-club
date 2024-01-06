import { Schema, model, models } from 'mongoose';

const UnitSchema = new Schema(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: false, default: '' },
    order: { type: String, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
  },
  { timestamps: true }
);

const Unit = models.Unit || model('Unit', UnitSchema);

export default Unit;
