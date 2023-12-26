'use server';

import mongoose from 'mongoose';
import { connectToDatabase } from '../database';
import Course from '../database/models/course.model';
import Unit from '../database/models/unit.model';
import Element from '../database/models/element.model';
import UserCourse from '../database/models/usercourse.model';

import openai from '../openai/index';
import { courseSchema } from '../openai/schemas/course.schema';
import { handleError } from '../utils';
import { addUnitToDatabase } from './unit.actions';
import Quiz from '../database/models/quiz.model';

// Generate course outline
const generateCourse = async (topic: string) => {
  const prompt = [
    {
      role: 'system',
      content:
        'Your response should be in JSON format. You are a former world-class educator and have collaborated with companies like Duolingo and Coursera to craft word-class learning experiences acrosss various subjects. You are known for your easy-to-understand language, and engaging writing. You are currently helping create course outlines that include a title, summary, and a table of contents consisting of 4 units which will be in an array. Only add the unit names. The topic will be given to you by the user. Follow the schema strictly.',
    },
    {
      role: 'user',
      content: `I want to learn about ${topic}. Use this schema for your response: ${JSON.stringify(
        courseSchema
      )}`,
    },
  ] as any;

  const openaiResponse = await openai.chat.completions.create({
    messages: prompt,
    model: 'gpt-3.5-turbo-1106',
    response_format: { type: 'json_object' },
  });

  const courseObject =
    JSON.parse(openaiResponse.choices[0].message.content || '').course ||
    JSON.parse(openaiResponse.choices[0].message.content || '');

  return courseObject;
};

// Create course and upload to database
export async function createCourse(topic: string) {
  try {
    await connectToDatabase();

    // Create course outline and upload to database
    const course = await generateCourse(topic);

    if (!course) throw new Error('Course could not be generated');

    const newCourse = await Course.create({
      ...course,
      title: course.title,
      summary: course.summary,
      tableOfContents:
        JSON.stringify(course.table_of_contents) ||
        JSON.stringify(course.tableOfContents),
    });

    console.log('Uploaded Course', newCourse);

    // Create units
    const tableOfContents =
      JSON.parse(newCourse.tableOfContents).units ||
      JSON.parse(newCourse.tableOfContents);

    for (let i = 0; i < tableOfContents.length; i++) {
      const unitName = tableOfContents[i].title;
      const unitId = (i + 1).toString();
      await addUnitToDatabase(newCourse.title, unitName, newCourse._id, unitId);
    }

    return newCourse._id;
  } catch (error) {
    handleError(error);
  }
}

// Get course details by id

export async function getCourseById(id: string) {
  try {
    await connectToDatabase();

    const course = await Course.findById(id);

    if (!course) throw new Error('Course not found');

    return course;
  } catch (error) {
    console.log(error);
  }
}

// Get course progress percent by id

export async function getCourseProgressById(id: string) {
  try {
    await connectToDatabase();

    const units = await Unit.find({
      courseId: { $in: id },
    });

    if (!units) throw new Error('Units not found');

    const unitIds = units.map((unit) => unit._id);

    const quizzes = await Quiz.find({ unitId: { $in: unitIds } });

    let total = quizzes.length;
    let completed = quizzes.filter((quiz) => quiz.status).length;
    const progress = Math.round((completed / total) * 100);

    return { progress: progress };
  } catch (error) {
    handleError(error);
  }
}

// Piece together course content
export async function getCourseContentById(id: string) {
  try {
    await connectToDatabase();
    const units = await Unit.find({
      courseId: { $in: id },
    });

    if (!units) throw new Error('Units not found');

    const unitIds = units.map((unit) => unit._id);

    const quizzes = await Quiz.find({ unitId: { $in: unitIds } });

    const elements = await Element.find({ unitId: { $in: unitIds } });

    const mergedCourse = [...elements, ...quizzes].sort(
      (a, b) => a.order - b.order
    );

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

    return groupedCourse;
  } catch (error) {
    handleError(error);
  }
}

// Fetch all courses for a user

export async function getUserCourses(userId: string) {
  try {
    await connectToDatabase();

    const userCourseResponse = await UserCourse.find(
      { userId: { $in: userId } },
      { courseId: 1, _id: 0 }
    );

    const courseIds = userCourseResponse.map((course) => course.courseId);

    // console.log('Course ids: ', courseIds);

    if (!courseIds) throw new Error('Courses not found');

    const userCourses = await Course.find(
      { _id: { $in: courseIds } },
      { title: 1, summary: 1 }
    );

    // console.log('User courses: ', userCourses);

    return userCourses;
  } catch (error) {
    handleError(error);
  }
}
