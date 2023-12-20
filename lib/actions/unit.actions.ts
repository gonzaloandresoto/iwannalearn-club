'use server';
import Unit from '../database/models/unit.model';
import { connectToDatabase } from '../database';
import { handleError } from '../utils';
import { createElement } from './element.action';
import Quiz from '../database/models/quiz.model';
import Element from '../database/models/element.model';

export async function addUnitToDatabase(
  courseTopic: string,
  unitName: string,
  courseId: string,
  id: string
) {
  try {
    await connectToDatabase();
    const newUnit = await Unit.create({
      title: unitName,
      courseId: courseId,
      status: 'NOT_STARTED',
      order: id,
    });

    const unitId = newUnit._id;
    createElement(courseTopic, unitName, unitId);

    return JSON.parse(JSON.stringify(newUnit));
  } catch (error) {
    handleError(error);
  }
}

export async function getUnitElementsById(id: string) {
  try {
    await connectToDatabase();

    const quizzes = await Quiz.find({ unitId: { $in: id } });

    const elements = await Element.find({ unitId: { $in: id } });

    const unitContent = [...elements, ...quizzes].sort(
      (a, b) => a.order - b.order
    );

    return unitContent;
  } catch (error) {
    handleError(error);
  }
}
