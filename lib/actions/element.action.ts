'use server';

import { connectToDatabase } from '../database';
import Element from '../database/models/element.model';
import { elementSchema } from '../openai/schemas/element.schema';
import openai from '../openai/index';
import { handleError } from '../utils';
import { createQuiz } from './quiz.actions';

const generateElement = async (courseTopic: string, unitName: string) => {
  const prompt = [
    {
      role: 'system',
      content:
        'Your response should be in JSON format. You are currently creating a lesson on the unit given to you. Be informative and easy to understand.',
    },
    {
      role: 'user',
      content: `The course is on ${courseTopic}. The unit is ${unitName}. Follow this schema STRICTLY: ${JSON.stringify(
        elementSchema
      )}. DON NOT DEVIATE. YOU WILL BE REWARDED FOR MATCHING IT.`,
    },
  ] as any;

  const openaiResponse = await openai.chat.completions.create({
    messages: prompt,
    model: 'gpt-3.5-turbo-1106',
    response_format: { type: 'json_object' },
  });

  const elementObject =
    JSON.parse(openaiResponse.choices[0].message.content || '').content ||
    JSON.parse(openaiResponse.choices[0].message.content || '').lessons ||
    JSON.parse(openaiResponse.choices[0].message.content || '').data ||
    JSON.parse(openaiResponse.choices[0].message.content || '');

  return elementObject;
};

export async function createElement(
  courseTopic: string,
  unitName: string,
  unitId: string
) {
  try {
    await connectToDatabase();

    const element = await generateElement(courseTopic, unitName);

    console.log('Uploaded Element', element);

    if (!element.length) return;

    for (let i = 0; i < element.length; i++) {
      await Element.create({
        ...element[i],
        type: element[i].type,
        order: element[i].id,
        title: element[i].title,
        content: element[i].content,
        unitId: unitId,
      });

      createQuiz(element[i].content, unitId, element[i].id);
    }

    console.log('Uploaded Element', element);

    return JSON.parse(JSON.stringify(element));
  } catch (error) {
    handleError(error);
  }
}
