'use server';

import { connectToDatabase } from '../database';
import Feedback from '../database/models/feedback.model';
import { handleError } from '../utils';

export const uploadFeedback = async (
  feedback: string,
  userId: string,
  type: string
) => {
  try {
    await connectToDatabase();

    const newFeedback = await Feedback.create({
      feedback: feedback,
      userId: userId,
      type: type,
    });

    if (!newFeedback) {
      throw new Error('Feedback not found');
    }
  } catch (error) {
    handleError(error);
  }
};
