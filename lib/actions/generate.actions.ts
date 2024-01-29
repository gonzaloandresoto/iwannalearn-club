'use server';
import { connectToDatabase } from '../database';
import openai from '../openai/index';

import Unit from '../database/models/unit.model';
import Course from '../database/models/course.model';
import Element from '../database/models/element.model';
import Quiz from '../database/models/quiz.model';
import UserCourse from '../database/models/usercourse.model';
import UserQuiz from '../database/models/userquiz.model';

import { handleError } from '../utils';
import UserUnit from '../database/models/userunit.model';
import console from 'console';

// SCHEMAS ---------------------------------------------------------------------
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

const unit_schema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      description: 'the title of the section',
    },
    lessons: {
      type: 'array',
      items: lesson_schema,
      minItems: 4,
    },
  },
  required: ['title', 'lessons'],
};

const course_schema = {
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
    table_of_contents: {
      type: 'array',
      items: unit_schema,
    },
  },
  required: ['title', 'summary', 'table_of_contents'],
};

const create_course = {
  name: 'create_course',
  description: 'creates a new course',
  parameters: course_schema,
};

const create_lessonsOLD = {
  name: 'create_lessons',
  description: 'creates lessons for a course along with a quiz per lesson',
  parameters: {
    type: 'object',
    properties: {
      lessons: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'the title of the lesson',
            },
            content: {
              type: 'string',
              description:
                'the content of the lesson in markdown format, without repeating the title',
            },
            quiz: {
              type: 'object',
              properties: {
                question: {
                  type: 'string',
                  description: 'the question of the quiz',
                },
                options: {
                  type: 'array',
                  items: {
                    type: 'string',
                    description:
                      'the potential answer options for the quiz question.',
                  },
                  minItems: 4,
                  maxItems: 4,
                },
                answer: {
                  type: 'number',
                  description:
                    'the index of the correct answer option for the quiz question',
                  enum: [0, 1, 2, 3],
                },
              },
              required: ['question', 'options', 'answer'],
            },
          },
          required: ['title', 'content', 'quiz'],
        },
        minItems: 2,
        maxItems: 4,
      },
    },
  },
};

const create_lessons = {
  name: 'create_lessons',
  description: 'creates lessons for a course',
  parameters: {
    type: 'object',
    properties: {
      lessons: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'the title of the lesson',
            },
            content: {
              type: 'string',
              description: 'the content of the lesson',
            },
            quiz: {
              type: 'object',
              properties: {
                question: {
                  type: 'string',
                  description: 'the question of the quiz',
                },
                options: {
                  type: 'array',
                  items: {
                    type: 'string',
                    description:
                      'the potential answer options for the quiz question',
                  },
                  minItems: 4,
                  maxItems: 4,
                },
                answer: {
                  type: 'number',
                  description:
                    'the index of the correct answer option for the quiz question',
                  enum: [0, 1, 2, 3],
                },
              },
              required: ['question', 'options', 'answer'],
            },
          },
          required: ['title', 'content', 'quiz'],
        },
      },
    },
  },
};

const create_quiz = {
  name: 'create_quiz',
  description: 'creates a quiz for a lesson',
  parameters: {
    type: 'object',
    properties: {
      question: {
        type: 'string',
        description: 'the question of the quiz',
      },
      options: {
        type: 'array',
        items: {
          type: 'string',
          description: 'the potential answer options for the quiz question.',
        },
        minItems: 4,
        maxItems: 4,
      },
      answer: {
        type: 'number',
        description:
          'the index of the correct answer option for the quiz question',
        enum: [0, 1, 2, 3],
      },
    },
    required: ['question', 'options', 'answer'],
  },
};

interface Quiz {
  question: string;
  options: string[];
  answer: number;
}

interface Lesson {
  title: string;
  content?: string;
  quiz?: Quiz;
}

interface Unit {
  title: string;
  lessons: Lesson[];
}

interface Course {
  title: string;
  summary: string;
  table_of_contents: Unit[];
}
// SCHEMAS ---------------------------------------------------------------------

// Generate course outline
const generateCourse = async (topic: string): Promise<Course> => {
  console.log('START GENERATING COURSE OPEN AI');

  const prompt = [
    {
      role: 'system',
      content: `You are a well-rounded, highly qualified teacher extremely knowledgable in ${topic}. Your students will ask about some high level topic and you will generate a textbook quality course on the topic for them.`,
    },
    {
      role: 'user',
      content: `I want to learn about ${topic}.`,
    },
  ] as any;

  const res = await openai.chat.completions.create({
    messages: prompt,
    model: 'gpt-3.5-turbo-1106',
    tools: [
      {
        type: 'function',
        function: create_course,
      },
    ],
    tool_choice: {
      type: 'function',
      function: {
        name: 'create_course',
      },
    },
  });

  // console.log('DONE GENERATING COURSE OPEN AI', res);

  const courseObject = JSON.parse(
    res.choices[0].message.tool_calls?.[0]?.function?.arguments || ''
  );
  // console.log('DONE GENERATING COURSE', courseObject);
  return JSON.parse(JSON.stringify(courseObject));
};

// Lessons: ${unit.lessons.map((lesson) => lesson.title).join(', ')}

const generateQuiz = async (lesson: Lesson): Promise<Quiz> => {
  try {
    const prompt = [
      {
        role: 'system',
        content: `You are a superhuman tutor that generates lesson quizzes based STRICTLY on the title and content given to you. The quiz should be multiple choice, with 4 options.`,
      },
      {
        role: 'user',
        content: `lesson_title: ${lesson.title},
        lesson_content: ${lesson.content}
        Create a quiz.`,
      },
    ] as any;

    const res = await openai.chat.completions.create({
      messages: prompt,
      model: 'gpt-3.5-turbo-1106',
      tools: [
        {
          type: 'function',
          function: create_quiz,
        },
      ],
      tool_choice: {
        type: 'function',
        function: {
          name: 'create_quiz',
        },
      },
    });
    const quizObject = JSON.parse(
      res.choices[0].message.tool_calls?.[0]?.function?.arguments || ''
    );
    console.log('Quiz Object', quizObject);
    return JSON.parse(JSON.stringify(quizObject));
  } catch (error) {
    handleError(error);
    return {
      question: '',
      options: [],
      answer: 0,
    };
  }
};

const generateLessons = async (
  course: Course,
  unit: Unit
): Promise<Lesson[]> => {
  const prompt = [
    {
      role: 'system',
      content: `You are a well-rounded, highly qualified teacher extremely knowledgable in a wide variety of subject matter. Your quality is text-book level, and as informative as Wikipedia. Based on a course outline, you will write detailed markdown informative lesson content for each of the lessons outlined along with a quiz question to test the student's understanding. Content should not describe what it will teach, but rather actually provide useful information. Each lesson should mantain the context of the course and not overlap with other lessons.`,
    },
    {
      role: 'user',
      content: `Course: ${course.title}
Course Summary: ${course.summary}
Unit: ${unit.title}
Lessons: ${unit.lessons.map((lesson) => lesson.title).join(', ')}
Write detailed lesson content for each.`,
    },
  ] as any;

  const res = await openai.chat.completions.create({
    messages: prompt,
    model: 'gpt-3.5-turbo-1106',
    tools: [
      {
        type: 'function',
        function: create_lessons,
      },
    ],
    tool_choice: {
      type: 'function',
      function: {
        name: 'create_lessons',
      },
    },
  });
  const lessonsObject = JSON.parse(
    res.choices[0].message.tool_calls?.[0]?.function?.arguments || ''
  );
  // console.log('Lessons Object', lessonsObject);
  return lessonsObject.lessons;
};

const generateLessonsNEW = async (
  course: Course,
  unit: Unit
): Promise<Lesson[]> => {
  try {
    const prompt = [
      {
        role: 'system',
        content: `You are a superhuman educator specilaizing in ${course.title} in technical detail. Your content quality is text-book level, and leverages Wikipedia's vast information. You'll make complex topics easy to understand, using clear and engaging explanations. You'll break down information into simpler components, use analogies, and relate concepts to everyday experiences to enhance understanding. Based on the course outline, you will write a detailed informative lesson content for each of the lessons outlined. Avoid descirbing what youll teach or include in each lesson, but actually provide the educational content. Always include a quiz for each lesson.
  
        !IMPORTANT -> LESSON CONTENT SHOULD BE INFORMATIVE, PROVIDING ACTUAL CONTENT THAT CAN BE LEARNED.
  
        !IMPORTANT -> DO NOT DESCRIBE WHAT YOU WILL TEACH OR WHAT WILL BE IN THE LESSON UNDER ANY CIRCUMSTANCES.
        
        !IMPORTANT -> EACH LESSON SHOULD BE ACCOMPANIED BY A QUIZ BASED ON THE CONTENT

        !IMPORTANT-> LESSON CONTENT SHOULD BE STRUCTURED IN MARKDOWN FORMAT AND SHOULD FOLLOW BEST PRACTICES – DO NOT ADD A LESSON TITLE WITHIN THE BODY CONTENT.
        
        !IMPORTANT -> AVOID CONCLUSIONS AND SUMMARIES IN THE LESSON CONTENT.
        
        !IMPORTANT -> THERE SHOULD BE A MINIMUM OF THREE LESSONS PER UNIT.
        
        !IMPORTANT -> LESSON CONTENT SHOULD NOT OVERLAP WITH OTHER LESSONS.
        
        !IMPORTANT -> LESSONS SHOULD MANTAIN THE CONTEXT OF THE COURSE.
        
        `,
      },
      {
        role: 'user',
        content: `Course: ${course.title}
        Course Summary: ${course.summary}
        Unit: ${unit.title}
        Lessons: ${unit.lessons.map((lesson) => lesson.title).join(', ')},
        Write detailed infromative lesson content for each and ALWAYS INCLUDE THE QUIZ.`,
      },
    ] as any;

    const res = await openai.chat.completions.create({
      messages: prompt,
      model: 'gpt-3.5-turbo-1106',
      tools: [
        {
          type: 'function',
          function: create_lessons,
        },
      ],
      tool_choice: {
        type: 'function',
        function: {
          name: 'create_lessons',
        },
      },
    });
    const lessonsObject = JSON.parse(
      res.choices[0].message.tool_calls?.[0]?.function?.arguments || ''
    );

    return lessonsObject.lessons;

    // console.log('LESSON OBJ ALONE ', JSON.stringify(lessonsObject, null, 4));

    // const quizPromises = lessonsObject.lessons.map(async (lesson: Lesson) => {
    //   const quiz = await generateQuiz(lesson);
    //   lesson.quiz = quiz;
    //   return lesson;
    // });

    // const lessonsWithQuizzes = await Promise.all(quizPromises);
    // console.log(
    //   'LESSON + QUIZ OBJ ',
    //   JSON.stringify(lessonsWithQuizzes, null, 4)
    // );
    // return lessonsWithQuizzes;
  } catch (error) {
    handleError(error);
    return [];
  }
};

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

async function createUnitsAndLessons(
  course: Course,
  courseId: string,
  userId: string
): Promise<void> {
  const unitPromises = course.table_of_contents.map(async (unit, index) => {
    const newUnit = await Unit.create({
      title: unit.title,
      courseId: courseId,
      order: index + 1,
    });

    if (!newUnit) throw new Error('Unit could not be saved to database');

    await UserUnit.create({
      userId: userId,
      unitId: newUnit._id,
      courseId: courseId,
      status: 'NOT_STARTED',
    });

    console.log('✅ Uploaded Unit', newUnit);

    console.log('WILL NOW GENERATE LESSONS');

    // Generate lesson contents
    const lessons = await generateLessons(course, unit);

    console.log('LESSONS GENERATED< WILL NOW UPLOAD');

    if (!lessons) throw new Error('Lessons could not be generated');

    // Create lesson and quiz entries in database, parallel, asynchronously
    const lessonPromises = lessons.map(async (lesson, j) => {
      try {
        const newLesson = await Element.create({
          ...lesson,
          type: 'lesson',
          order: j + 1,
          title: lesson.title,
          content: lesson.content,
          unitId: newUnit._id,
        });

        if (!newLesson)
          throw new Error('Lesson could not be saved to database');
        console.log('✅ Uploaded Lesson', newLesson);

        // Create quiz if it exists in the lesson
        if (lesson.quiz) {
          const newQuiz = await Quiz.create({
            ...lesson.quiz,
            type: 'quiz',
            question: lesson.quiz.question,
            order: j + 1,
            choices: JSON.stringify(
              lesson.quiz.options.map((option, optionIndex) => ({
                id: optionIndex,
                option: option,
              }))
            ),
            answer: lesson.quiz.answer,
            unitId: newUnit._id,
          });

          if (!newQuiz) throw new Error('Quiz could not be saved to database');

          // --------- NO LONGER REQUIRED AS WE ARE NOT TRACKING QUIZ PROGRESS, ONLY UNIT PROGRESS --------- //
          const newUserQuiz = await UserQuiz.create({
            userId: userId,
            quizId: newQuiz._id,
            unitId: newUnit._id,
            completed: false,
          });

          if (!newUserQuiz)
            throw new Error('UserQuiz could not be saved to database');

          // --------- NO LONGER REQUIRED AS WE ARE NOT TRACKING QUIZ PROGRESS, ONLY UNIT PROGRESS --------- //
        }
      } catch (error) {
        handleError(error);
      }
    });

    await Promise.all(lessonPromises);
  });

  await Promise.all(unitPromises);
}

async function createAndUploadCourse(
  course: Course,
  userId: string
): Promise<string> {
  try {
    const tableOfContents = course.table_of_contents.map((unit, index) => ({
      title: unit.title,
      id: index + 1,
    }));

    const newCourse = await Course.create({
      ...course,
      tableOfContents: JSON.stringify(tableOfContents),
      userId: userId,
    });

    if (!newCourse) throw new Error('Course could not be saved to database');

    return newCourse._id;
  } catch (error) {
    handleError(error);
    return '';
  }
}

// Main function called to create the course + upload its contents to the database
export async function createCourse(
  topic: string,
  userId: string
): Promise<{ courseId: string } | { message: string }> {
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

      const course = await generateCourse(topic);
      if (!course) throw new Error('Course could not be generated');

      const newCourseId = await createAndUploadCourse(course, userId);
      // console.log('✅ Uploaded Course', newCourseId);

      await assignCourseToUser(userId, newCourseId);
      // console.log('✅ Assigned Course to User');

      createUnitsAndLessons(course, newCourseId, userId);
      console.log('✅ Units and Lessons created');

      return { courseId: newCourseId };
    })();

    return await Promise.race([courseCreationPromise, timeoutPromise]);
  } catch (error) {
    handleError(error);
    throw error;
  }
}

//////////////////////////  CUSTOM GENERATION CODE  //////////////////////////

// Schemas ---------------------------------------------------------------------

const suggest_concepts = {
  name: 'suggest_concepts',
  description: 'suggests 5 concepts to learn about a topic',
  parameters: {
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
  },
};

const suggest_TOC = {
  name: 'suggest_TOC',
  description: 'create a table of contents for a topic with its given concepts',
  parameters: {
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
  },
};

const custom_course_schema = {
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

const custom_create_course = {
  name: 'custom_create_course',
  description: 'creates a new course',
  parameters: custom_course_schema,
};

// Schemas ---------------------------------------------------------------------

export const generateSampleTopics = async (
  topic: string
): Promise<string[]> => {
  const prompt = [
    {
      role: 'system',
      content:
        ' As a highly knowledgeable teacher, please utilize Wikipedia as your main source to identify and provide a list of five fundamental concepts that are crucial for comprehending a specific subject. It is important that each concept is directly linked to the main topic and presented in a concise and informative manner.',
    },
    {
      role: 'user',
      content: `I want to learn about this topic: ${topic}.`,
    },
  ] as any;

  const res = await openai.chat.completions.create({
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

  const functioneResponse = JSON.parse(
    res.choices[0].message.tool_calls?.[0]?.function?.arguments || ''
  );

  const topics = functioneResponse?.concepts;
  console.log('TOPICS WIKI', topics);
  return topics;
};

export const generateSampleTOC = async (
  topic: string,
  concepts: string
): Promise<string[]> => {
  const prompt = [
    {
      role: 'system',
      content: `Create a meticulously organized and comprehensive table of contents comprising four units. These units should be centered around a specific topic chosen by student, and should effectively incorporate the specific concepts they have provided. It is crucial that the units thoroughly address the requested concepts while maintaining a clear focus on the main topic. Additionally, please ensure that the units are logically arranged to facilitate a coherent and structured learning experience.
        
      !IMPORTANT -> UNIT TITLES SHOULD NOT CONTAIN THE WORD UNIT IN THEM, AVOID FORMATS LIKE "UNIT X: TITLE" INSETAD JUST PROVIDE THE TITLE.`,
    },
    {
      role: 'user',
      content: `I want to learn about this topic: ${topic}, making sure we cover these concepts:${concepts} about it.`,
    },
  ] as any;

  const res = await openai.chat.completions.create({
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

  const functioneResponse = JSON.parse(
    res.choices[0].message.tool_calls?.[0]?.function?.arguments || ''
  );

  const TOC = functioneResponse?.tableOfContents;
  console.log('TOCZ', TOC);
  return TOC;
};

interface CourseDetails {
  table_of_contents: { title: string; order: number }[];
  title: string;
  summary: string;
}

export const generateCourseDetailsCustom = async (
  topic: string
): Promise<CourseDetails> => {
  console.log('START GENERATING COURSE DETAILS OPEN AI');

  const prompt = [
    {
      role: 'system',
      content:
        'You are a well-rounded, highly qualified teacher extremely knowledgable in a wide variety of subject matter. Your students will ask about some high level topic and you will generate a textbook quality course on the topic for them.',
    },
    {
      role: 'user',
      content: `I want to learn about this topic: ${topic}.`,
    },
  ] as any;

  const res = await openai.chat.completions.create({
    messages: prompt,
    model: 'gpt-3.5-turbo-1106',
    tools: [
      {
        type: 'function',
        function: custom_create_course,
      },
    ],
    tool_choice: {
      type: 'function',
      function: {
        name: 'custom_create_course',
      },
    },
  });

  const courseObject = JSON.parse(
    res.choices[0].message.tool_calls?.[0]?.function?.arguments || ''
  );

  console.log('DONE GENERATING COURSE', courseObject);
  return courseObject;
};

async function createUnitsAndLessonsCustom(
  course: any,
  courseId: string,
  userId: string
): Promise<void> {
  if (!course.table_of_contents) throw new Error('No table of contents');
  const unitPromises = course.table_of_contents.map(
    async (unit: any, index: number) => {
      const newUnit = await Unit.create({
        title: unit.title,
        courseId: courseId,
        order: index + 1,
      });

      if (!newUnit) throw new Error('Unit could not be saved to database');

      await UserUnit.create({
        userId: userId,
        unitId: newUnit._id,
        courseId: courseId,
        status: 'NOT_STARTED',
      });

      // console.log('✅ Uploaded Unit', newUnit);

      // Generate lesson contents
      const lessons = await generateLessons(course, unit);

      console.log('CUSTOM LESSONS GENERATED WILL NOW UPLOAD');

      if (!lessons) throw new Error('Lessons could not be generated');

      // Create lesson and quiz entries in database, parallel, asynchronously
      const lessonPromises = lessons.map(async (lesson, j) => {
        try {
          const newLesson = await Element.create({
            ...lesson,
            type: 'lesson',
            order: j + 1,
            title: lesson.title,
            content: lesson.content,
            unitId: newUnit._id,
          });

          if (!newLesson)
            throw new Error('Lesson could not be saved to database');
          // console.log('✅ Uploaded Lesson', newLesson);

          // Create quiz if it exists in the lesson
          if (lesson.quiz) {
            const newQuiz = await Quiz.create({
              ...lesson.quiz,
              type: 'quiz',
              question: lesson.quiz.question,
              order: j + 1,
              choices: JSON.stringify(
                lesson.quiz.options.map((option, optionIndex) => ({
                  id: optionIndex,
                  option: option,
                }))
              ),
              answer: lesson.quiz.answer,
              unitId: newUnit._id,
            });

            if (!newQuiz)
              throw new Error('Quiz could not be saved to database');

            // console.log('✅ Uploaded Quiz', newQuiz);

            // --------- NO LONGER REQUIRED AS WE ARE NOT TRACKING QUIZ PROGRESS, ONLY UNIT PROGRESS --------- //
            const newUserQuiz = await UserQuiz.create({
              userId: userId,
              quizId: newQuiz._id,
              unitId: newUnit._id,
              completed: false,
            });

            if (!newUserQuiz)
              throw new Error('UserQuiz could not be saved to database');
            // --------- NO LONGER REQUIRED AS WE ARE NOT TRACKING QUIZ PROGRESS, ONLY UNIT PROGRESS --------- //
          }
        } catch (error) {
          handleError(error);
        }
      });

      console.log('DONE WITH ALL LESSON / QUIZ GENERATION');
      await Promise.all(lessonPromises);
    }
  );

  await Promise.all(unitPromises);
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
    quiz: {
      question: string;
      options: string[];
      answer: number;
    };
  }[];
}

const custom_create_lesson_titles = {
  name: 'custom_create_lesson_titles',
  description: 'generates lesson titles for a unit',
  parameters: {
    type: 'object',
    properties: {
      unit: { type: 'array', items: lesson_schema, minItems: 1, maxItems: 3 },
    },
  },
};

// Function to create lessons for custom TOC given
async function generateLessonTitlesCustom(
  toc: PreLessonsTOC[]
): Promise<PostLessonsTOC[]> {
  const unitTitles = toc.map((unit) => unit.title);
  const unitPromises = toc.map(async (unit, index) => {
    console.log('UNIT TITLE FOR LESSONS: ', unit.title);
    const prompt = [
      {
        role: 'system',
        content:
          'You are a well-rounded, highly qualified teacher extremely knowledgable in a wide variety of subject matter. You are generating lesson titles for a course with respect to the unit title you are given. The lesson titles should not overlap with other lessons.',
      },
      {
        role: 'user',
        content: `This is the unit title: ${unit.title}. DOn't overlap with these units under any ciscumstance: ${unitTitles}`,
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
    console.log('DONE GENERATING UNIT LESSONS', unitLessons);

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

  console.log('DONE GENERATING ALL UNIT LESSONS', newTOC);
  return newTOC;
}

interface CustomCourse {
  topic: string;
  concepts: string[];
  tableOfContents: any;
  experienceLevel: string | null;
}

// Main function called to create the course + upload its contents to the database
export async function createCourseCustom(
  customAttributes: CustomCourse,
  userId: string
): Promise<any> {
  console.log('GENERATING CUSTOM COURSE');
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

      course.table_of_contents = await generateLessonTitlesCustom(
        customAttributes.tableOfContents
      );

      if (!course.table_of_contents)
        throw new Error('Table of contents could not be generated');

      const newCourseId = await createAndUploadCourseCustom(course, userId);
      // console.log('✅ Uploaded Course', newCourseId);

      await assignCourseToUser(userId, newCourseId);
      console.log('✅ Assigned Course to User');

      createUnitsAndLessonsCustom(course, newCourseId, userId);
      // console.log('✅ Units and Lessons created');

      // return course;
      return { courseId: newCourseId };
    })();

    return await Promise.race([courseCreationPromise, timeoutPromise]);
  } catch (error) {
    handleError(error);
    throw error;
  }
}
