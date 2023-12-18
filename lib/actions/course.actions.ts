'use server';

import { connectToDatabase } from '../database';
import Course from '../database/models/course.model';

import openai from '../openai/index';
import { courseSchema } from '../openai/schemas/course.schema';
import { handleError } from '../utils';

// Create course
const generateCourse = async (topic: string) => {
  const prompt = [
    {
      role: 'system',
      content:
        'Your response should be in JSON format. You are a former world-class educator and have collaborated with companies like Duolingo and Coursera to craft word-class learning experiences acrosss various subjects. You are known for your easy-to-understand language, and engaging writing. You are currently helping create course outlines that include a title, summary, and a table of contents consisting of 4 units. Only add the unit names. The topic will be given to you by the user.',
    },
    {
      role: 'user',
      content: `I want to learn about ${topic}. Use this schema for your response: ${courseSchema}`,
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

export async function createCourse(topic: string) {
  try {
    await connectToDatabase();

    const course = await generateCourse(topic);

    if (!course) throw new Error('Course could not be generated');

    console.log('OpenAI created: ', course);

    const newCourse = await Course.create({
      ...course,
      title: course.title,
      summary: course.summary,
      tableOfContents: course.table_of_contents || course.tableOfContents,
    });

    return JSON.parse(JSON.stringify(newCourse));
  } catch (error) {
    handleError(error);
  }
}
