'use server';

import { connectToDatabase } from '../database';
import Element from '../database/models/element.model';
import openai from '../openai/index';
import { handleError } from '../utils';

// const generateElement = async (courseTopic: string, unitName: string) => {
//   const stringifiedSchema = JSON.stringify(elementSchema);
//   const prompt = [
//     {
//       role: 'system',
//       content:
//         'You are a helpful assistant. Your response should be in JSON format and should match the schema given to you.',
//     },
//     {
//       role: 'user',
//       content: `You are currently creating an informative in-depth document about ${unitName} in the context of ${courseTopic}. Follow this schema for your response: ${stringifiedSchema}.`,
//     },
//   ] as any;

//   const openaiResponse = await openai.chat.completions.create({
//     messages: prompt,
//     model: 'gpt-3.5-turbo-1106',
//     response_format: { type: 'json_object' },
//   });

//   const contentString = openaiResponse.choices[0].message.content || '{}';
//   const parsedContent = JSON.parse(contentString);
//   const elementObject = Object.values(parsedContent)[0] || parsedContent;

//   console.log('Generated Object', elementObject);

//   return elementObject;
// };

// export async function createElement(
//   courseTopic: string,
//   unitName: string,
//   unitId: string,
// ) {
//   try {
//     await connectToDatabase();

//     const element = await generateElement(courseTopic, unitName);

//     console.log('Uploaded Element', element);

//     if (!element.length) return;

//     if (Array.isArray(element)) {
//       for (let i = 0; i < element.length; i++) {
//         await Element.create({
//           ...element[i],
//           type: element[i].type,
//           order: element[i].id,
//           title: element[i].title,
//           content: element[i].content,
//           unitId: unitId,
//         });

//         createQuiz(element[i].content, unitId, element[i].id);
//       }
//     } else if (element && typeof element === 'object') {
//       for (const key of Object.keys(element)) {
//         const item = element[key];
//         await Element.create({
//           ...item,
//           type: item.type,
//           order: item.id,
//           title: item.title,
//           content: item.content,
//           unitId: unitId,
//         });

//         createQuiz(item.content, unitId, item.id);
//       }
//     }

//     console.log('Uploaded Element', element);

//     return JSON.parse(JSON.stringify(element));
//   } catch (error) {
//     handleError(error);
//   }
// }
