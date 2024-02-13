'use server';
import { connectToDatabase } from '../database';
import openai from '../openai/index';
import { handleError } from '../utils';

import Unit from '../database/models/unit.model';
import Course from '../database/models/course.model';
import Element from '../database/models/element.model';
import UserCourse from '../database/models/usercourse.model';
import UserUnit from '../database/models/userunit.model';
import { CourseDetails, SampleTOC, SampleTopic } from '@/types';

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
            enum: [1, 2, 3, 4],
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

const lesson_schema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      description: 'the title of the lesson',
    },
  },
  required: ['title'],
};

const lesson_title_schema = {
  type: 'object',
  properties: {
    unit: { type: 'array', items: lesson_schema, minItems: 2, maxItems: 5 },
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

// ----------------- TYPES ----------------- //

interface CustomCourse {
  topic: string;
  concepts: string[];
  tableOfContents: any;
  experienceLevel: string | null;
}

interface PreLessonsTOC {
  title: string;
  id: number;
}

interface PostLessonsTOC {
  title: string;
  order: number;
  lessons: {
    title: string;
    content: string;
  }[];
}

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
      content: `Create a logically ordered and comprehensive table of contents comprising four units for the given topic. The table of contents should be based on the concepts given to you. Do not include the word "unit" in the title of the units. `,
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

  // console.log('DONE GENERATING COURSE', courseObject);
  return JSON.parse(JSON.stringify(courseDetails));
};

// Function to create lessons for custom TOC given
async function generateLessonTitlesCustom(
  topic: string,
  tableOfContents: any
): Promise<PostLessonsTOC[]> {
  const unitTitles = tableOfContents.map((unit) => unit.title);
  const unitPromises = tableOfContents.map(async (unit, index) => {
    // console.log('UNIT TITLE FOR LESSONS: ', unit.title);
    const prompt = [
      {
        role: 'system',
        content: `You are a highly qualified teacher extremely knowledgable in ${topic}. You are creating the structure for a course, suggesting lesson titles for lessons in a unit with respect to its course. The lesson titles should not overlap with other lessons.`,
      },
      {
        role: 'user',
        content: `Course: ${topic}
                  Unit Title: ${unit.title}
                  Topics to Avoid Overlap With: ${unitTitles}`,
      },
    ] as any;

    const res = await openai.chat.completions.create({
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
      res.choices[0].message.tool_calls?.[0]?.function?.arguments || ''
    ).unit;
    // console.log('DONE GENERATING UNIT LESSONS', unitLessons);

    return {
      title: unit.title,
      order: index + 1,
      lessons: unitLessons,
    };
  });

  const unitsResults = await Promise.all(unitPromises);
  const newTOC = unitsResults.map((unitResult) => ({
    ...unitResult,
  }));

  // console.log('DONE GENERATING ALL UNIT LESSONS', newTOC);
  return newTOC;
}

// Function to create an upload the course
async function createAndUploadCourseCustom(
  course: CourseDetails,
  userId: string
): Promise<string> {
  const tableOfContents = course.table_of_contents.map((unit, index) => ({
    title: unit.title,
    id: index + 1,
  }));

  const newCourse = await Course.create({
    ...course,
    tableOfContents: JSON.stringify(tableOfContents),
    userId: userId,
  });

  return newCourse._id;
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

export async function createCourseCustomV2(
  customAttributes: CustomCourse,
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

      const generatedTOC = await generateLessonTitlesCustom(
        customAttributes.topic,
        customAttributes.tableOfContents
      );

      course.table_of_contents = generatedTOC;

      if (!course.table_of_contents)
        throw new Error('Table of contents could not be generated');

      const newCourseId = await createAndUploadCourseCustom(course, userId);
      // console.log('✅ Uploaded Course', newCourseId);

      await assignCourseToUser(userId, newCourseId);

      for (let item in generatedTOC) {
        const unitTitle = generatedTOC[item].title;

        // Uploading the unit to the database
        const uploadedUnit = await Unit.create({
          title: unitTitle,
          courseId: newCourseId,
          order: generatedTOC[item].order,
        });
        if (!uploadedUnit)
          throw new Error('Unit could not be saved to database');

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

      return { courseId: newCourseId };
    })();

    return await Promise.race([courseCreationPromise, timeoutPromise]);
  } catch (error) {
    handleError(error);
    throw error;
  }
}
