'use server';

import { connectToDatabase } from '../database';
import { handleError } from '../utils';
import Unit from '../database/models/unit.model';

import Element from '../database/models/element.model';
import UserUnit from '../database/models/userunit.model';
import { UnitLessons } from '@/types';

export async function updateUnitStatus(
  unitId: string,
  userId: string,
  status: string
) {
  if (!unitId || !userId) return;
  try {
    await connectToDatabase();

    const updatedUnit = await UserUnit.findOneAndUpdate(
      { unitId: unitId, userId: userId },
      { status: status },
      { new: true }
    );

    if (!updatedUnit) throw new Error('Unit could not be updated');

    return;
  } catch (error) {
    handleError(error);
  }
}

export async function getUnitContentById(unitId: string) {
  try {
    await connectToDatabase();

    const unit = await Unit.findById(unitId);

    if (!unit) {
      return { message: 'No unit found' };
    }

    return JSON.parse(JSON.stringify(unit));
  } catch (error) {
    handleError(error);
  }
}

// Function to get the next uncompleted unit
export async function getNextUncompletedUnit(
  courseId: string,
  unitId: string
): Promise<any | null> {
  try {
    const currentUnit = await Unit.findById(unitId);
    if (!currentUnit) {
      return null;
    }

    const nextUnit = await Unit.findOne(
      {
        courseId: courseId,
        order: { $gt: currentUnit.order },
      },
      { _id: 1 }
    ).sort({ order: 1 });

    if (!nextUnit) {
      return null;
    }

    const firstLesson = await Element.findOne(
      { unitId: nextUnit?._id },
      { _id: 1 }
    );

    return {
      nextUnit: nextUnit?._id.toString() || null,
      firstLesson: firstLesson?._id.toString() || null,
    };
  } catch (error) {
    handleError(error);
    return null;
  }
}

// Function to get the status of all units in a course
export async function getUnitCompletions(courseId: string) {
  if (!courseId) return;
  try {
    await connectToDatabase();

    const userUnits = await UserUnit.find(
      { courseId: courseId },
      { unitId: 1, status: 1 }
    );

    if (!userUnits.length) return { message: 'No units found for this course' };

    const userUnitsIndexed: any = {};
    for (const userUnit of userUnits) {
      userUnitsIndexed[userUnit?.unitId] = userUnit?.status;
    }

    const unitDetails = await Unit.find(
      { courseId: courseId },
      { _id: 1, order: 1 }
    );

    if (!unitDetails.length)
      return { message: 'No units found for this course' };

    const unitCompletions: any = {};
    unitDetails
      ?.sort((a, b) => a.order - b.order)
      .map((unit) => {
        unitCompletions[unit?._id] = {
          order: unit?.order,
          status: userUnitsIndexed[unit?._id],
        };
      });

    return unitCompletions;
  } catch (error) {
    handleError(error);
  }
}

export const getUnitLessonTitles = async (
  unitId: string
): Promise<UnitLessons | undefined> => {
  try {
    await connectToDatabase();

    const unitTitles = await Element.find(
      { unitId: unitId },
      { title: 1, order: 1 }
    ).sort({ order: 1 });

    return JSON.parse(JSON.stringify(unitTitles));
  } catch (error) {
    handleError(error);
  }
};
