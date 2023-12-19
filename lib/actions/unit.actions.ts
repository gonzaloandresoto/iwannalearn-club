'use server';
import Unit from '../database/models/unit.model';
import { connectToDatabase } from '../database';
import { handleError } from '../utils';
import { createElement } from './element.action';

export async function addUnitToDatabase(
  courseTopic: string,
  unitName: string,
  courseId: string
) {
  try {
    await connectToDatabase();
    const newUnit = await Unit.create({
      title: unitName,
      courseId: courseId,
      status: 'NOT_STARTED',
    });

    const unitId = newUnit._id;
    createElement(courseTopic, unitName, unitId);

    return JSON.parse(JSON.stringify(newUnit));
  } catch (error) {
    handleError(error);
  }
}
