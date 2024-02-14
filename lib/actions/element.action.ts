'use server';

import { Lesson } from '@/types';
import { connectToDatabase } from '../database';
import { handleError } from '../utils';

import Element from '../database/models/element.model';

export const getLessonById = async (
  lessonId: string
): Promise<Lesson | undefined> => {
  try {
    await connectToDatabase();

    const lesson = await Element.findById({ _id: lessonId });

    if (!lesson) throw new Error('Lesson not found');

    return JSON.parse(JSON.stringify(lesson));
  } catch (error) {
    handleError(error);
  }
};

export const saveGeneratedLessonText = async (
  lessonId: string,
  completion: string
): Promise<void> => {
  try {
    await connectToDatabase();

    const newLesson = await Element.findOneAndUpdate(
      { _id: lessonId },
      { content: completion }
    );

    if (!newLesson) throw new Error('Lesson not found');
  } catch (error) {
    handleError(error);
  }
};

export const saveFurtherReadingLinks = async (
  lessonId: string,
  links: string
): Promise<void> => {
  try {
    await connectToDatabase();

    const updatedLesson = await Element.findOneAndUpdate(
      { _id: lessonId },
      { links: links }
    );

    if (!updatedLesson) {
      throw new Error('Lesson not found');
    }
  } catch (error) {
    handleError(error);
  }
};
