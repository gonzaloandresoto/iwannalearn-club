import { Schema, model, models } from 'mongoose';

const UserQuizSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  unitId: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
  completed: { type: Boolean, default: false },
});

const UserQuiz = models.UserQuiz || model('UserQuiz', UserQuizSchema);

export default UserQuiz;
