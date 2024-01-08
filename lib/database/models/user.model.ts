import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    photo: { type: String, required: false },
    onboarding: { type: Boolean, default: false, required: false },
  },
  { timestamps: true }
);

const User = models.User || model('User', UserSchema);

export default User;
