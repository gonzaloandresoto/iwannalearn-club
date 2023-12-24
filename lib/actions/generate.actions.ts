'use server';

import mongoose from 'mongoose';
import { connectToDatabase } from '../database';
import Course from '../database/models/course.model';
import Unit from '../database/models/unit.model';
import Element from '../database/models/element.model';

import openai from '../openai/index';
import { courseSchema } from '../openai/schemas/course.schema';
import { handleError } from '../utils';
import Quiz from '../database/models/quiz.model';

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
    description: {
      type: 'string',
      description: 'a short description of the section',
    },
    lessons: {
      type: 'array',
      items: lesson_schema,
    },
  },
  required: ['title', 'description', 'lessons'],
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
  const prompt = [
    {
      role: 'system',
      content:
        'You are a well-rounded, highly qualified teacher extremely knowledgable in a wide variety of subject matter. Your students will ask about some high level topic and you will generate a textbook quality course on the topic for them. ',
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

  const courseObject = JSON.parse(
    res.choices[0].message.tool_calls?.[0]?.function?.arguments || ''
  );
  console.log(courseObject);
  return courseObject;
};

const generateLessons = async (
  course: Course,
  unit: Unit
): Promise<Lesson[]> => {
  const prompt = [
    {
      role: 'system',
      content: `You are a well-rounded, highly qualified teacher extremely knowledgable in a wide variety of subject matter. 
      Based on a course outline, you will write detailed two paragraph lesson content for each of the lessons outlined along with a quiz question to test the student's understanding.`,
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
  console.log(lessonsObject);
  return lessonsObject.lessons;
};

// Main func to course and upload (self+children) to database
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
      tableOfContents: JSON.stringify(
        course.table_of_contents.map((unit: any) => ({
          title: unit.title,
          id: course.table_of_contents.indexOf(unit) + 1,
        }))
      ),
    });
    // console.log('Uploaded Course', newCourse);

    // Create units
    const tableOfContents = course.table_of_contents;
    for (let i = 0; i < tableOfContents.length; i++) {
      const unit = tableOfContents[i];
      const unitIdx = (i + 1).toString();

      const newUnit = await Unit.create({
        title: unit.title,
        courseId: newCourse._id,
        status: 'NOT_STARTED',
        order: unitIdx,
      });
      // console.log('Uploaded Unit', newUnit);

      // create unit's lessons
      const lessons = await generateLessons(course, unit);

      // add each lesson to database (linked to unit._id)
      for (let j = 0; j < lessons.length; j++) {
        const newLesson = await Element.create({
          ...lessons[j],
          type: 'lesson',
          order: j,
          title: lessons[j].title,
          content: lessons[j].content,
          unitId: newUnit._id,
        });
        console.log('Uploaded Lesson', newLesson);

        if (lessons[j].quiz) {
          console.log('Quiz', lessons[j].quiz);

          const newQuiz = await Quiz.create({
            ...lessons[j],
            type: 'quiz',
            question: lessons[j].quiz?.question,
            order: j,
            choices: JSON.stringify(
              lessons[j].quiz?.options.map((option) => ({
                id: lessons[j].quiz?.options.indexOf(option),
                option: option,
              }))
            ),
            answer: lessons[j].quiz?.answer,
            status: false,
            unitId: newUnit._id,
          });
          console.log('Uploaded Quiz', newQuiz);
        } else {
          console.log('\n\n\n\n\n\n\nNo Quiz\n\n\n\n\n\n\n\n\n\n');
        }
      }
      // console.log('Uploaded Element', lessons);
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
    // console.log('Quizzes', quizzes);

    const elements = await Element.find({ unitId: { $in: unitIds } });

    const mergedCourse = [...elements, ...quizzes].sort(
      (a, b) => a.order - b.order
    );
    // console.log('Merged Course', mergedCourse);

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
