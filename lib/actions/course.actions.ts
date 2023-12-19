'use server';

import { connectToDatabase } from '../database';
import Course from '../database/models/course.model';

import openai from '../openai/index';
import { courseSchema } from '../openai/schemas/course.schema';
import { handleError } from '../utils';
import { addUnitToDatabase } from './unit.actions';

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
      await addUnitToDatabase(newCourse.title, unitName, newCourse._id);
    }

    return;
  } catch (error) {
    handleError(error);
  }
}

// Get course details by id

export async function getCourseById(id: string) {
  try {
    console.log('Getting course by id', id);
    await connectToDatabase();

    const course = await Course.findById(id);

    if (!course) throw new Error('Course not found');

    return JSON.parse(JSON.stringify(course));
  } catch (error) {
    console.log(error);
  }
}
