'use server';
import Unit from '../database/models/unit.model';
import { connectToDatabase } from '../database';
import { handleError } from '../utils';
import Quiz from '../database/models/quiz.model';
import Element from '../database/models/element.model';
import UserQuiz from '../database/models/userquiz.model';
import UserUnit from '../database/models/userunit.model';
import { connect } from 'http2';

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

// export async function addUnitToDatabase(
//   courseTopic: string,
//   unitName: string,
//   courseId: string,
//   id: string
// ) {
//   try {
//     await connectToDatabase();

//     const newUnit = await Unit.create({
//       title: unitName,
//       courseId: courseId,
//       status: 'NOT_STARTED',
//       order: id,
//     });

//     const unitId = newUnit._id;

//     createElement(courseTopic, unitName, unitId);

//     return JSON.parse(JSON.stringify(newUnit));
//   } catch (error) {
//     handleError(error);
//   }
// }

export async function getUnitContentById(unitId: string) {
  try {
    await connectToDatabase();

    const unit = await Unit.findById(unitId);

    if (!unit) {
      return { message: 'No unit found' };
    }

    return unit;
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

    return JSON.parse(JSON.stringify(unitContent));
  } catch (error) {
    handleError(error);
  }
}

// Function to get the next uncompleted unit
export async function getNextUncompletedUnit(courseId: string) {
  try {
    const unitCompletions = await getUnitCompletions(courseId);

    if (unitCompletions) {
      for (const unitId of Object.keys(unitCompletions)) {
        if (unitCompletions[unitId].status !== 'COMPLETE') {
          return unitId;
        }
      }
    }

    return null;
  } catch (error) {
    handleError(error);
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

export async function updateUnitStatusBasedOnQuizCompletion(unitId: string) {
  try {
    await connectToDatabase();

    const quizzes = await Quiz.find({ unitId: unitId });

    if (quizzes.length === 0) {
      return { message: 'No quizzes to evaluate' };
    }

    const completedQuizzes = quizzes.filter(
      (quiz) => quiz.status === true
    ).length;

    let newStatus;
    if (completedQuizzes === quizzes.length) {
      newStatus = 'COMPLETED';
    } else if (completedQuizzes > 0) {
      newStatus = 'IN-PROGRESS';
    } else {
      return { message: 'No quizzes completed' };
    }

    const updatedUnit = await Unit.findByIdAndUpdate(
      unitId,
      { status: newStatus },
      { new: true }
    );

    return updatedUnit;
  } catch (error) {
    handleError(error);
  }
}
