'use server';

import { connectToDatabase } from '../database';
import Feedback from '../database/models/feedback.model';
import { handleError } from '../utils';

export const uploadFeedback = async (formData: any) => {
  try {
    await connectToDatabase();

    const userId = formData.get('userId') as string;
    const transformedUserId = userId ? userId : null;

    const feedbackDetails = {
      issue: formData.get('issue') as string,
      userId: transformedUserId,
      type: formData.get('type') as string,
    };
    if (!feedbackDetails.issue) return;

    const newFeedback = await Feedback.create({
      feedback: feedbackDetails.issue,
      userId: feedbackDetails.userId,
      type: feedbackDetails.type,
    });
    if (!newFeedback) {
      throw new Error('Feedback not found');
    }
  } catch (error) {
    handleError(error);
  }
};
