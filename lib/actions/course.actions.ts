'use server';

import { connectToDatabase } from '../database';
import { handleError } from '../utils';
import { revalidatePath } from 'next/cache';

import Element from '../database/models/element.model';
import Course from '../database/models/course.model';
import UserCourse from '../database/models/usercourse.model';
import UserUnit from '../database/models/userunit.model';
import Unit from '../database/models/unit.model';

import {
  Course as CourseType,
  StructuredCourseContent,
  UserCoursesGrid,
} from '@/types';

export async function getCoursesByUserId(
  userId: string,
  page: number,
  limit: number
): Promise<UserCoursesGrid> {
  if (!userId) return { courses: [], isNext: false };
  try {
    await connectToDatabase();

    const totalCourses = await UserCourse.countDocuments({ userId: userId });

    const userCourses = await UserCourse.find({ userId: userId })
      .populate({
        path: 'courseId',
      })
      .skip(page * limit)
      .limit(limit)
      .sort({ completed: 1, updatedAt: -1 });

    const coursesWithProgress = await Promise.all(
      userCourses.map(async (course) => {
        const progress = await getCourseProgressById(course.courseId._id);
        return {
          ...JSON.parse(JSON.stringify(course.courseId)),
          progress,
        };
      })
    );

    const isNext = page * limit + coursesWithProgress.length < totalCourses;

    return { courses: coursesWithProgress, isNext };
  } catch (error) {
    handleError(error);
    return { courses: [], isNext: false };
  }
}

export async function getCourseProgressById(id: string): Promise<number> {
  try {
    await connectToDatabase();

    const units = await UserUnit.find({
      courseId: { $in: id },
    });

    if (!units) throw new Error('Units not found for this course: ' + id);

    const completedUnits = units.filter((unit) => unit.status === 'COMPLETE');

    let total = units.length;
    let completed = completedUnits.length;
    const progress = Math.round((completed / total) * 100);

    return progress || 0;
  } catch (error) {
    handleError(error);
    return 0;
  }
}

export async function getCourseContentById(
  id: string
): Promise<StructuredCourseContent | undefined> {
  try {
    await connectToDatabase();

    const units = await Unit.find({
      courseId: { $in: id },
    }).sort({ order: 1 });

    if (!units) throw new Error('Units not found');

    const unitIds = units.map((unit) => unit._id);

    const courseLessons = await Element.find({ unitId: { $in: unitIds } });

    if (!courseLessons) throw new Error('Lessons not found');

    // Strucuture the course content by unit
    const groupedCourse = units.reduce((acc, unit) => {
      acc[unit._id.toString()] = {
        unitName: unit.title,
        courseId: unit.courseId,
        content: courseLessons.filter((content) =>
          content.unitId.equals(unit._id)
        ),
      };
      return acc;
    }, {});

    return JSON.parse(JSON.stringify(groupedCourse));
  } catch (error) {
    handleError(error);
  }
}

// Get course details by id

export async function getCourseById(
  id: string,
  withTOC = false
): Promise<CourseType | undefined> {
  try {
    await connectToDatabase();

    const course = await Course.findById(id);

    if (!course) throw new Error('Course not found');

    if (withTOC) {
      const newTableOfContents = JSON.parse(course.tableOfContents);

      for (const item in newTableOfContents) {
        const unitName = newTableOfContents[item].title;

        const unit = await Unit.findOne({ title: unitName, courseId: id });
        const firstLesson = await Element.findOne({ unitId: unit._id });

        if (unit && unit._id && firstLesson) {
          newTableOfContents[item].unitId = unit._id.toString();
          newTableOfContents[item].firstLessonId = firstLesson._id.toString();
        } else {
          return;
        }
      }

      course.tableOfContents = JSON.stringify(newTableOfContents);
    }
    return JSON.parse(JSON.stringify(course));
  } catch (error) {
    console.log(error);
  }
}

export async function deleteCourseById(
  courseId: string,
  userId: string,
  path: any
): Promise<void> {
  if (!courseId || !userId) return;
  try {
    await connectToDatabase();

    await UserCourse.findOneAndDelete({ courseId: courseId, userId: userId });

    const remainingUsersOnCourse = await UserCourse.find({
      courseId: courseId,
    });

    if (remainingUsersOnCourse.length === 0) {
      await Course.deleteOne({ _id: courseId });
    }

    revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}

export const getRecentCourses = async (
  page: number,
  limit: number
): Promise<CourseType[] | undefined> => {
  try {
    await connectToDatabase();

    const recentCourses = await Course.find({ doneGenerating: true })
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit);

    if (recentCourses.length === 0) return undefined;

    return JSON.parse(JSON.stringify(recentCourses));
  } catch (error) {
    handleError(error);
  }
};

export const markCourseAsComplete = async (courseId: string): Promise<void> => {
  try {
    await connectToDatabase();

    const course = await Course.findOneAndUpdate(
      { _id: courseId },
      { doneGenerating: true }
    );

    if (!course) throw new Error('Course was not found');

    const userCourse = await UserCourse.findOneAndUpdate(
      { courseId: courseId },
      { completed: true }
    );

    if (!userCourse) throw new Error('Course progress could not be saved');
  } catch (error) {
    handleError(error);
  }
};
