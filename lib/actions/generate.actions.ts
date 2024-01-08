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
  description: string;
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

  console.log('DONE GENERATING COURSE OPEN AI', res);

  const courseObject = JSON.parse(
    res.choices[0].message.tool_calls?.[0]?.function?.arguments || ''
  );
  console.log('DONE GENERATING COURSE', courseObject);
  return courseObject;
};

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
Unit description: ${unit.description}
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
      console.log('✅ Uploaded Lesson', newLesson);

      // Create quiz if it exists in the lesson
      if (lesson.quiz) {
        await Quiz.create({
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
        // await UserQuiz.create({
        //   userId: userId,
        //   quizId: newQuiz._id,
        //   unitId: newUnit._id,
        //   completed: false,
        // });
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
        resolve({ message: 'Course creation is taking longer than expected!' });
      }, 1000);
    });

    const courseCreationPromise = (async () => {
      await connectToDatabase();

      const course = await generateCourse(topic);
      if (!course) throw new Error('Course could not be generated');

      const newCourseId = await createAndUploadCourse(course, userId);
      // console.log('✅ Uploaded Course', newCourseId);

      await assignCourseToUser(userId, newCourseId);
      // console.log('✅ Assigned Course to User');

      // createUnitsAndLessons(course, newCourseId, userId);
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

    await UserCourse.findByIdAndDelete({ courseId: courseId, userId: userId });

    const remainingUsersOnCourse = await UserCourse.find({
      courseId: courseId,
    });

    if (remainingUsersOnCourse.length === 0) {
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
    );

    return courses;
  } catch (error) {
    handleError(error);
    return [];
  }
}
