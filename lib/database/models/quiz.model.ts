import { Schema, models, model } from 'mongoose';

const QuizSchema = new Schema(
  {
    type: { type: String, required: true },
    question: { type: String, required: true },
    order: { type: Number, required: true },
    choices: { type: String, required: true },
    answer: { type: String, required: true },
    unitId: { type: Schema.Types.ObjectId, ref: 'Unit' },
  },
  { timestamps: true }
);

const Quiz = models.Quiz || model('Quiz', QuizSchema);

export default Quiz;
