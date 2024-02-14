'use server';

import openai from '../openai/index';
import { connectToDatabase } from '../database';
import { handleError } from '../utils';

import Unit from '../database/models/unit.model';
import Course from '../database/models/course.model';
import Element from '../database/models/element.model';
import UserCourse from '../database/models/usercourse.model';
import UserUnit from '../database/models/userunit.model';

import {
  CourseCustomAttributes,
  CourseDetails,
  CourseWithLessonTitles,
  SampleTOC,
  SampleTopic,
} from '@/types';

// ----------------- SCHEMAS ----------------- //

const concepts_schema = {
  type: 'object',
  properties: {
    concepts: {
      type: 'array',
      items: {
        type: 'string',
      },
      minItems: 5,
    },
  },
  required: ['concepts'],
};

const toc_schema = {
  type: 'object',
  properties: {
    tableOfContents: {
      type: 'array',
      description: 'the table of contents for the topic',
      items: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description:
              'the title of the unit, worded like a duolingo blogpost',
          },
          id: {
            type: 'number',
            description: 'the id of the unit',
            enum: [1, 2, 3, 4, 5, 6],
          },
        },
        required: ['title', 'id'],
      },
      minItems: 4,
    },
  },
};

const course_details_schema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      description: 'the title of the course',
    },
    summary: {
      type: 'string',
      description: 'a short summary of the course',
    },
  },
  required: ['title', 'summary'],
};

const lesson_title_schema = {
  type: 'object',
  properties: {
    unit: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'the title of the lesson',
          },
        },
        required: ['title'],
      },
      minItems: 2,
      maxItems: 5,
    },
  },
};

// ----------------- FUNCTIONS ----------------- //

const suggest_concepts = {
  name: 'suggest_concepts',
  description: 'suggests 5 concepts to learn about a topic',
  parameters: concepts_schema,
};

const suggest_TOC = {
  name: 'suggest_TOC',
  description:
    'creates a table of contents for a topic with its given concepts',
  parameters: toc_schema,
};

const create_course_details = {
  name: 'create_course_details',
  description: 'Creates a title and summary for a course on a given topic',
  parameters: course_details_schema,
};

const custom_create_lesson_titles = {
  name: 'custom_create_lesson_titles',
  description: 'generates lesson titles for a unit',
  parameters: lesson_title_schema,
};

// ----------------- GENERATE MODAL FLOW ----------------- //

// Function to generate sample concepts for a topic
export const generateSampleConcepts = async (
  topic: string
): Promise<SampleTopic[]> => {
  const prompt = [
    {
      role: 'system',
      content:
        'As a highly knowledgeable teacher, please utilize Wikipedia as your main source to identify and provide a list of five fundamental concepts that are crucial for comprehending a specific topic. It is important that each concept is directly linked to the main topic and presented in a concise and informative manner.',
    },
    {
      role: 'user',
      content: `I want to learn about this topic: ${topic}.`,
    },
  ] as any;

  const response = await openai.chat.completions.create({
    messages: prompt,
    model: 'gpt-3.5-turbo-1106',
    tools: [
      {
        type: 'function',
        function: suggest_concepts,
      },
    ],
    tool_choice: {
      type: 'function',
      function: {
        name: 'suggest_concepts',
      },
    },
  });

  const concepts = JSON.parse(
    response.choices[0].message.tool_calls?.[0]?.function?.arguments || ''
  )?.concepts;

  return JSON.parse(JSON.stringify(concepts));
};

export const generateSampleTOC = async (
  topic: string,
  concepts: string
): Promise<SampleTOC[]> => {
  const prompt = [
    {
      role: 'system',
      content: `Create a logically ordered and comprehensive table of contents comprising four units for the given topic. The table of contents should be based on the concepts given to you. Do not include the word "unit" in the title of each unit. The unit titles should be descriptive and should not overlap with eachother.`,
    },
    {
      role: 'user',
      content: `Topic: ${topic}
                Concepts: ${concepts}.`,
    },
  ] as any;

  const response = await openai.chat.completions.create({
    messages: prompt,
    model: 'gpt-3.5-turbo-1106',
    tools: [
      {
        type: 'function',
        function: suggest_TOC,
      },
    ],
    tool_choice: {
      type: 'function',
      function: {
        name: 'suggest_TOC',
      },
    },
  });

  const sampleTOC = JSON.parse(
    response.choices[0].message.tool_calls?.[0]?.function?.arguments || ''
  )?.tableOfContents;

  return JSON.parse(JSON.stringify(sampleTOC));
};

// ----------------- MAIN GENERATE ----------------- //

export const generateCourseDetailsCustom = async (
  topic: string
): Promise<CourseDetails> => {
  const prompt = [
    {
      role: 'system',
      content: `You are a well-rounded, highly qualified teacher extremely knowledgable in ${topic}. You will generate a textbook quality course on the topic for them.`,
    },
    {
      role: 'user',
      content: `Topic: ${topic}.`,
    },
  ] as any;

  const response = await openai.chat.completions.create({
    messages: prompt,
    model: 'gpt-3.5-turbo-1106',
    tools: [
      {
        type: 'function',
        function: create_course_details,
      },
    ],
    tool_choice: {
      type: 'function',
      function: {
        name: 'create_course_details',
      },
    },
  });

  const courseDetails = JSON.parse(
    response.choices[0].message.tool_calls?.[0]?.function?.arguments || ''
  );

  return JSON.parse(JSON.stringify(courseDetails));
};

// Function to create lessons for custom TOC given
async function generateLessonTitlesCustom(
  topic: string,
  tableOfContents: SampleTOC[]
): Promise<CourseWithLessonTitles[]> {
  const unitTitles = tableOfContents.map((unit) => unit.title);
  const unitPromises = tableOfContents.map(async (unit, index) => {
    const prompt = [
      {
        role: 'system',
        content: `You are a highly qualified teacher extremely knowledgable in ${topic}. You are assigning lesson titles for the lessons within each unit. The lesson titles should not overlap with other lessons, or with other units. Avoid vague titles, ensure they all reference the overall course topic.`,
      },
      {
        role: 'user',
        content: `Course Topic: ${topic}
                  Unit Title: ${unit.title}
                  Other Unit Topics to Avoid Overlap With: ${unitTitles}`,
      },
    ] as any;

    const response = await openai.chat.completions.create({
      messages: prompt,
      model: 'gpt-3.5-turbo-1106',
      tools: [
        {
          type: 'function',
          function: custom_create_lesson_titles,
        },
      ],
      tool_choice: {
        type: 'function',
        function: {
          name: 'custom_create_lesson_titles',
        },
      },
    });

    const unitLessons = JSON.parse(
      response.choices[0].message.tool_calls?.[0]?.function?.arguments || ''
    ).unit;
    // console.log('DONE GENERATING UNIT LESSON POST YYY', unitLessons);

    return {
      title: unit.title,
      order: index + 1,
      lessons: unitLessons,
    };
  });

  const unitsResults = await Promise.all(unitPromises);

  const updatedTOC = unitsResults.map((unitResult) => ({
    ...unitResult,
  }));

  // console.log('DONE GENERATING ALL UNIT LESSONS', newTOC);
  return JSON.parse(JSON.stringify(updatedTOC));
}

// Function to create an upload the course
async function createAndUploadCourseCustom(
  course: CourseDetails,
  userId: string
): Promise<string> {
  const tableOfContents = course?.tableOfContents?.map((unit, index) => ({
    title: unit.title,
    id: index + 1,
  }));

  const newCourse = await Course.create({
    ...course,
    tableOfContents: JSON.stringify(tableOfContents),
    userId: userId,
  });

  if (!newCourse) throw new Error('Course could not be saved to database');

  const courseId = newCourse?._id;

  return JSON.parse(JSON.stringify(courseId));
}

// Function to assign a course to a user
async function assignCourseToUser(
  userId: string,
  courseId: string
): Promise<void> {
  try {
    await connectToDatabase();

    const UserCourseId = await UserCourse.create({
      userId: userId,
      courseId: courseId,
      completed: false,
    });

    if (!UserCourseId) throw new Error('UserCourse entry not created');
  } catch (error) {
    handleError(error);
  }
}

export async function uploadUnitsAndLessons(
  generatedTOC: CourseWithLessonTitles[],
  newCourseId: string,
  userId: string
): Promise<void> {
  try {
    await connectToDatabase();
    for (let item in generatedTOC) {
      const unitTitle = generatedTOC[item].title;

      // Uploading the unit to the database
      const uploadedUnit = await Unit.create({
        title: unitTitle,
        courseId: newCourseId,
        order: generatedTOC[item].order,
      });
      if (!uploadedUnit) throw new Error('Unit could not be saved to database');

      const uploadedUserUnit = await UserUnit.create({
        userId: userId,
        unitId: uploadedUnit._id,
        courseId: newCourseId,
        status: 'NOT_STARTED',
      });

      if (!uploadedUserUnit)
        throw new Error('UserUnit could not be saved to database');

      // creating all the lessons for each unit
      const unitLessons = generatedTOC[item].lessons;

      unitLessons.forEach(async (lesson, index) => {
        const lessonTitle = lesson.title;

        // Uploading the lesson to the database
        const uploadedLesson = await Element.create({
          title: lessonTitle,
          content: 'generate',
          type: 'lesson',
          order: index + 1,
          unitId: uploadedUnit._id,
        });

        if (!uploadedLesson)
          throw new Error('Lesson could not be saved to database');
      });
    }
  } catch (error) {
    handleError(error);
  }
}

export async function createCustomCourse(
  customAttributes: CourseCustomAttributes,
  userId: string
): Promise<any> {
  // console.log('GENERATING CUSTOM COURSE');
  try {
    const timeoutPromise = new Promise<{ message: string }>((resolve) => {
      setTimeout(() => {
        resolve({
          message: `Course creation is taking longer than expected. We'll redirect you shortly.`,
        });
      }, 9000);
    });

    const courseCreationPromise = (async () => {
      await connectToDatabase();

      const course = await generateCourseDetailsCustom(customAttributes.topic);
      if (!course) throw new Error('Course could not be generated');

      // console.log('DONE GENERATING COURSE DETAILS');

      const generatedTOC = await generateLessonTitlesCustom(
        customAttributes?.topic,
        customAttributes?.tableOfContents
      );

      // console.log('DONE GENERATING TOC');

      if (!generatedTOC)
        throw new Error('Lesson titles could not be generated');

      course.tableOfContents = generatedTOC;

      const newCourseId = await createAndUploadCourseCustom(course, userId);

      // console.log('DONE UPLOADING COURSE');

      await assignCourseToUser(userId, newCourseId);

      // console.log('DONE ASSIGNING COURSE TO USER');

      await uploadUnitsAndLessons(generatedTOC, newCourseId, userId);

      return JSON.parse(JSON.stringify(newCourseId));
    })();

    return await Promise.race([courseCreationPromise, timeoutPromise]);
  } catch (error) {
    handleError(error);
  }
}
