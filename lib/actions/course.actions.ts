'use server';

import { connectToDatabase } from '../database';
import openai from '../openai/index';
import Element from '../database/models/element.model';

export const goDeeper = async (
  lesson: any,
  unitId: string,
  comment: string
): Promise<string> => {
  console.log('GOING DEEPER');
  const prompt = [
    {
      role: 'system',
      content:
        'You are a well-rounded, highly qualified teacher extremely knowledgable in a wide variety of subject matter. You are to expand on the given paragraph, providing more detail. Cover what the student is asking about, and anything else you think is relevant.',
    },
    {
      role: 'user',
      content: `Responsd in text use newline '\n\n' separators in between paragraphs. This is the unit: ${unitId},
                This is the lesson: ${lesson.title},
                This is what I would like to know more about: ${comment}
                This is the paragraph: ${lesson.content}.
               `,
    },
  ] as any;

  const response = await openai.chat.completions.create({
    messages: prompt,
    model: 'gpt-3.5-turbo-1106',
    max_tokens: 600,
  });

  const result = response.choices[0].message.content;

  console.log('FINAL DEEPER RESULT', result);

  // upload
  await connectToDatabase();

  await Element.findOneAndUpdate({ _id: lesson._id }, { content: result });

  return 'hey';
};
