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
      content:
        'You are a well-rounded, highly qualified teacher extremely knowledgable in a wide variety of subject matter. Your students will ask about some high level topic and you will generate a textbook quality course on the topic for them.',
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
  return courseObject;
};

// Lessons: ${unit.lessons.map((lesson) => lesson.title).join(', ')}

const generateLessons = async (
  course: Course,
  unit: Unit
): Promise<Lesson[]> => {
  const prompt = [
    {
      role: 'system',
      content: `You are a well-rounded, highly qualified teacher extremely knowledgable in a wide variety of subject matter. Your quality is text-book level, and as informative as Wikipedia. Based on a course outline, you will write detailed two paragraph informative lesson content for each of the lessons outlined along with a quiz question to test the student's understanding. Content should not describe what it will teach, but rather actually provide useful information. Each lesson should mantain the context of the course and not overlap with other lessons.`,
    },
    {
      role: 'user',
      content: `Course: ${course.title}
Course Summary: ${course.summary}
Unit: ${unit.title}

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

    // console.log('✅ Uploaded Unit', newUnit);

    // Generate lesson contents
    const lessons = await generateLessons(course, unit);

    if (!lessons) throw new Error('Lessons could not be generated');

    // Create lesson and quiz entries in database, parallel, asynchronously
    const lessonPromises = lessons.map(async (lesson, j) => {
      const newLesson = await Element.create({
        ...lesson,
        type: 'lesson',
        order: j + 1,
        title: lesson.title,
        content: lesson.content,
        unitId: newUnit._id,
      });
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

        // --------- NO LONGER REQUIRED AS WE ARE NOT TRACKING QUIZ PROGRESS, ONLY UNIT PROGRESS --------- //
        await UserQuiz.create({
          userId: userId,
          quizId: newQuiz._id,
          unitId: newUnit._id,
          completed: false,
        });
        // --------- NO LONGER REQUIRED AS WE ARE NOT TRACKING QUIZ PROGRESS, ONLY UNIT PROGRESS --------- //
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
      // console.log('✅ Units and Lessons created');

      return { courseId: newCourseId };
    })();

    return await Promise.race([courseCreationPromise, timeoutPromise]);
  } catch (error) {
    handleError(error);
    throw error;
  }
}

// Get course details by id

export async function getCourseById(id: string) {
  try {
    await connectToDatabase();

    const course = await Course.findById(id);

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

    // console.log('🚀 ~ tableOfContents:', newTableOfContents);

    course.tableOfContents = JSON.stringify(newTableOfContents);

    // console.log('🚀 ~ course:', course);

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
    // console.log('🚀 ~ unitIds:', unitIds);

    const quizzes = await UserQuiz.find({ unitId: { $in: unitIds } });
    // console.log('🚀 ~ quizzes:', quizzes);

    if (!quizzes) throw new Error('Quizzes not found');

    let total = quizzes.length;
    let completed = quizzes.filter((quiz) => quiz.completed).length;
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
    return groupedCourse;
  } catch (error) {
    handleError(error);
  }
}

export async function deleteCourseById(
  courseId: string,
  userId: string
): Promise<void> {
  if (!courseId || !userId) return;
  try {
    await connectToDatabase();

    await UserCourse.findOneAndDelete({ courseId: courseId, userId: userId });

    const remainingUsersOnCourse = await UserCourse.find({
      courseId: courseId,
    });

    if (remainingUsersOnCourse.length === 0) {
      console.log('NO MORE USERS ON COURSE, SO DELETING ENTIRE COURSE');
      await Course.deleteOne({ _id: courseId });
    }

    return;
  } catch (error) {
    handleError(error);
  }
}

interface CourseForUser {
  _id: string;
  title: string;
}

export async function getCourseByUserId(
  userId: string
): Promise<CourseForUser[]> {
  if (!userId) return [];
  try {
    await connectToDatabase();

    const userCourses = await UserCourse.find(
      { userId: userId },
      { courseId: 1 }
    );

    const userCourseIds = userCourses.map((course) => course.courseId);

    const courses = await Course.find(
      { _id: { $in: userCourseIds } },
      { title: 1 }
    ).sort({ createdAt: -1 }); // Sort by completedAt field in descending order

    return JSON.parse(JSON.stringify(courses));
  } catch (error) {
    handleError(error);
    return [];
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

//////////////////////////  CUSTOM GENERATION CODE  //////////////////////////

// const lesson_schema = {
//   type: 'object',
//   properties: {
//     title: {
//       type: 'string',
//       description: 'the title of the lesson',
//     },
//   },
//   required: ['title'],
// };

// const unit_schema = {
//   type: 'object',
//   properties: {
//     title: {
//       type: 'string',
//       description: 'the title of the section',
//     },
//     lessons: {
//       type: 'array',
//       items: lesson_schema,
//     },
//   },
//   required: ['title', 'lessons'],
// };
// const create_course = {
//   name: 'create_course',
//   description: 'creates a new course',
//   parameters: course_schema,
// };

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

export const generateSampleTopics = async (
  topic: string
): Promise<string[]> => {
  const prompt = [
    {
      role: 'system',
      content:
        'You are an expert teacher with extensive knowledge in diverse subjects. When a student provides a topic, list 5 key concepts central to understanding that topic. Your first source of reference should be Wikipedia. Each concept should be directly related to the main topic and described in a concise, informative manner.',
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

export const generateSampleTOC = async (
  topic: string,
  concepts: string
): Promise<string[]> => {
  const prompt = [
    {
      role: 'system',
      content:
        'You are a well-rounded, highly qualified teacher extremely knowledgable in a wide variety of subject matter. Your students will give you a topic, and you will consolidate the concepts given to you into a table of contents with 4 units. The 4 units should encompass the concepts the user wants to learn about the topic, but should not stary from the main topic. It should also be ordered in a way that makes sense.',
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
  console.log('TOC', TOC);
  return TOC;
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

      if (!lessons) throw new Error('Lessons could not be generated');

      // Create lesson and quiz entries in database, parallel, asynchronously
      const lessonPromises = lessons.map(async (lesson, j) => {
        const newLesson = await Element.create({
          ...lesson,
          type: 'lesson',
          order: j + 1,
          title: lesson.title,
          content: lesson.content,
          unitId: newUnit._id,
        });
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

          // console.log('✅ Uploaded Quiz', newQuiz);

          // --------- NO LONGER REQUIRED AS WE ARE NOT TRACKING QUIZ PROGRESS, ONLY UNIT PROGRESS --------- //
          await UserQuiz.create({
            userId: userId,
            quizId: newQuiz._id,
            unitId: newUnit._id,
            completed: false,
          });
          // --------- NO LONGER REQUIRED AS WE ARE NOT TRACKING QUIZ PROGRESS, ONLY UNIT PROGRESS --------- //
        }
      });

      await Promise.all(lessonPromises);
    }
  );

  await Promise.all(unitPromises);
  console.log('DONE WITH EVERYTHING');
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
        content: `This is the unit title: ${unit.title}. DOn't overlap with these ${unitTitles}`,
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

interface CustomCourseUnit {
  title: string;
  order: number;
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

      const newCourseId = await createAndUploadCourseCustom(course, userId);
      // console.log('✅ Uploaded Course', newCourseId);

      await assignCourseToUser(userId, newCourseId);
      // console.log('✅ Assigned Course to User');

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
