import { Schema, model, models } from 'mongoose';

const FeedbackSchema = new Schema(
  {
    feedback: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      required: false,
    },
    type: { type: String, default: 'feedback' },
  },
  { timestamps: true }
);

const Feedback = models.Feedback || model('Feedback', FeedbackSchema);

export default Feedback;
