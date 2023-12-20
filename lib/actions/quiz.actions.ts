'use server';
import Quiz from '../database/models/quiz.model';
import { connectToDatabase } from '../database';
import { handleError } from '../utils';
import { quizSchema } from '../openai/schemas/quiz.schema';
import openai from '../openai';

const generateQuiz = async (lessonContent: string) => {
  const prompt = [
    {
      role: 'system',
      content:
        'Your response should be in JSON format. You are creating a multiple choice quiz based on the lesson content given to you.',
    },
    {
      role: 'user',
      content: `This is the content you should base your question and choices off of "${lessonContent}". Follow this schema STRICTLY: ${JSON.stringify(
        quizSchema
      )}. DON NOT DEVIATE. YOU WILL BE REWARDED FOR MATCHING IT.`,
    },
  ] as any;

  const openaiResponse = await openai.chat.completions.create({
    messages: prompt,
    model: 'gpt-3.5-turbo-1106',
    response_format: { type: 'json_object' },
  });

  const elementObject =
    JSON.parse(openaiResponse.choices[0].message.content || '').data ||
    JSON.parse(openaiResponse.choices[0].message.content || '').quiz ||
    JSON.parse(openaiResponse.choices[0].message.content || '');

  return elementObject;
};

export async function createQuiz(
  lessonContent: string,
  unitId: string,
  order: string
) {
  try {
    await connectToDatabase();

    const quiz = await generateQuiz(lessonContent);

    console.log('Uploaded Quiz', quiz);

    const newQuiz = await Quiz.create({
      ...quiz,
      type: quiz.type,
      order: order,
      question: quiz.question,
      choices: JSON.stringify(quiz.choices),
      answer: quiz.answerId,
      status: false,
      unitId: unitId,
    });

    return newQuiz;
  } catch (error) {
    handleError(error);
  }
}
