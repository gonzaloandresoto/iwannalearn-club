import { Schema, model, models } from 'mongoose';

const UserOnboardingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    attribution: { type: String, required: true },
    whyLearn: { type: String, required: true },
  },
  { timestamps: true }
);

const UserOnboarding =
  models.UserOnboarding || model('UserOnboarding', UserOnboardingSchema);

export default UserOnboarding;
