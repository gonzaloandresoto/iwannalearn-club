import { Schema, models, model } from 'mongoose';

export interface IElement extends Document {
  _id: string;
  type: string;
  question: string;
  order: string;
  choices: string;
  answer: string;
  status: boolean;
  unitId: { _id: string };
}

const QuizSchema = new Schema({
  type: { type: String, required: true },
  question: { type: String, required: false },
  order: { type: String, required: false },
  choices: { type: String, required: false },
  answer: { type: String, required: false },
  status: { type: Boolean, required: false },
  unitId: { type: Schema.Types.ObjectId, ref: 'Unit' },
});

const Quiz = models.Quiz || model('Quiz', QuizSchema);

export default Quiz;
