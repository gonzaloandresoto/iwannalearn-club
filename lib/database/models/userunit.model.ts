import { Schema, model, models } from 'mongoose';

const UserUnitSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    unitId: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    status: { type: String, default: 'NOT_STARTED', required: true },
    completedAt: { type: Date, default: null, required: false },
  },
  { timestamps: true }
);

const UserUnit = models.UserUnit || model('UserUnit', UserUnitSchema);

export default UserUnit;
