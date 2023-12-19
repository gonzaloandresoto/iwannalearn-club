'use server';
import Unit from '../database/models/unit.model';
import { connectToDatabase } from '../database';
import { handleError } from '../utils';

export async function addUnitToDatabase(unitName: string, courseId: string) {
  try {
    await connectToDatabase();
    const newUnit = await Unit.create({
      title: unitName,
      courseId: courseId,
      status: 'NOT_STARTED',
    });
    return JSON.parse(JSON.stringify(newUnit));
  } catch (error) {
    handleError(error);
  }
}
