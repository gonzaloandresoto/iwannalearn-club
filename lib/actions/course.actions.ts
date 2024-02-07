'use server';

import { connectToDatabase } from '../database';
import openai from '../openai/index';
import Element from '../database/models/element.model';
import Course from '../database/models/course.model';
import UserCourse from '../database/models/usercourse.model';
import { handleError } from '../utils';
import Unit from '../database/models/unit.model';
import UserQuiz from '../database/models/userquiz.model';
import Quiz from '../database/models/quiz.model';
import { revalidatePath } from 'next/cache';
import UserUnit from '../database/models/userunit.model';
import { redirect } from 'next/navigation';

interface CourseForUser {
  _id: string;
  title: string;
  progress: number;
  createdAt: string;
}

interface UserCoursesResponse {
  courses: CourseForUser[];
  isNext: boolean;
}

interface UserCoursesParams {
  userId: string;
  page: number;
  limit: number;
}

export async function getCoursesByUserId(
  params: UserCoursesParams
): Promise<UserCoursesResponse> {
  const { userId, page, limit } = params;

  if (!userId) return { courses: [], isNext: false };
  try {
    await connectToDatabase();

    const totalCourses = await UserCourse.countDocuments({ userId: userId });

    const userCourses = await UserCourse.find({ userId: userId })
      .populate({
        path: 'courseId',
        select: 'title completed updatedAt createdAt',
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

    if (progress) {
      return progress;
    } else {
      return 0;
    }
  } catch (error) {
    handleError(error);
    return 0;
  }
}

export async function getCourseContentById(id: string) {
  try {
    await connectToDatabase();
    const units = await Unit.find({
      courseId: { $in: id },
    }).sort({ order: 1 });

    if (!units) throw new Error('Units not found');

    const unitIds = units.map((unit) => unit._id);

    //Fetching quizzes and lessons
    const courseQuizzes = await Quiz.find({ unitId: { $in: unitIds } });
    const courseLessons = await Element.find({ unitId: { $in: unitIds } });

    //Fetching the user quizzes
    const courseQuizIds = courseQuizzes.map((quiz) => quiz._id);
    // console.log('🚀 ~ courseQuizIds:', courseQuizIds);
    const userQuizes = await UserQuiz.find({ quizId: { $in: courseQuizIds } });
    // console.log('🚀 ~ userQuizes:', userQuizes);

    //Giving each quiz its completion status
    const mergedQuizes = courseQuizzes.map((quiz) => {
      const userQuiz = userQuizes.find((userQuiz) =>
        userQuiz.quizId.equals(quiz._id)
      );
      return {
        ...quiz._doc,
        completed: userQuiz ? userQuiz.completed : false,
      };
    });

    // console.log('🚀 ~ mergedQuizes:', mergedQuizes);

    //Merging the quizzes and lessons
    const mergedCourse = [...courseLessons, ...mergedQuizes].sort(
      (a, b) => a.order - b.order
    );

    // console.log('🚀 ~ mergedCourse:', mergedCourse);

    // Strucuture the course content by unit
    const groupedCourse = units.reduce((acc, unit) => {
      acc[unit._id.toString()] = {
        unitName: unit.title,
        courseId: unit.courseId,
        content: mergedCourse.filter((content) =>
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

export async function getCourseById(id: string, withTOC = false) {
  try {
    await connectToDatabase();

    const course = await Course.findById(id);

    if (!course) throw new Error('Course not found');

    if (withTOC) {
      const newTableOfContents = JSON.parse(course.tableOfContents);

      for (const item in newTableOfContents) {
        const unitName = newTableOfContents[item].title;

        const unit = await Unit.findOne({ title: unitName, courseId: id });

        if (unit && unit._id) {
          newTableOfContents[item].unitId = unit._id.toString();
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

export async function getMostRecentCourse(userId: string) {
  if (!userId) return;
  try {
    await connectToDatabase();

    const mostRecentCourse = await UserCourse.find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!mostRecentCourse) return { message: 'No course found' };

    return { courseId: mostRecentCourse[0].courseId };
  } catch (error) {
    handleError(error);
  }
}

export const goDeeper = async (
  lesson: any,
  unitId: string,
  comment: string
): Promise<string> => {
  const prompt = [
    {
      role: 'system',
      content: `You are a well-rounded, highly qualified teacher extremely knowledgable in ${unitId}. You are to expand on the given paragraph, providing more detail. Cover what the student is asking about, and anything else you think is relevant.`,
    },
    {
      role: 'user',
      content: `Respond using markdown format. This is the unit: ${unitId},
                This is the lesson: ${lesson.title},
                This is what I would like to know more about: ${comment}
                This is the paragraph: ${lesson.content}.
               `,
    },
  ] as any;

  const response = await openai.chat.completions.create({
    messages: prompt,
    model: 'gpt-3.5-turbo-1106',
    max_tokens: 600,
  });

  const result = response.choices[0].message.content;

  // upload
  await connectToDatabase();

  await Element.findOneAndUpdate({ _id: lesson._id }, { content: result });

  return 'Reload';
};

export const getRecentCourses = async ({ page, limit }: any) => {
  try {
    await connectToDatabase();

    // await Course.updateMany({}, { $set: { doneGenerating: false } })
    //   .then((result) => {
    //     console.log('Update result:', result);
    //   })
    //   .catch((err) => {
    //     console.error('Update error:', err);
    //   });

    const recentCourses = await Course.find({ doneGenerating: true })
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit);

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

    // redirect(`/course/${courseId}`);
  } catch (error) {
    handleError(error);
  }
};
