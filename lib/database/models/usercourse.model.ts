import { Schema, model, models } from 'mongoose';

const UserCourseSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    completed: { type: Boolean, default: false, required: true },
    completedAt: { type: Date, default: null, required: false },
  },
  { timestamps: true }
);

const UserCourse = models.UserCourse || model('UserCourse', UserCourseSchema);

export default UserCourse;
