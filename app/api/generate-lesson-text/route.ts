import { handleError } from '@/lib/utils';
import openai from '@/lib/openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { saveGeneratedLessonText } from '@/lib/actions/element.action';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const {
      lessonId,
      courseTitle,
      courseSummary,
      unitTitle,
      unitLessons,
      lessonTitle,
    } = // unit lessons is currently just the table of contents
      await request.json();

    console.log('START GENERATING LESSON CONTENT OPEN AI');
    const prompt = [
      {
        role: 'system',
        content: `
            ABOUT YOU: You are a superhuman tutor specilaizing in ${courseTitle} in technical detail. Your content quality is text-book level, and leverages Wikipedia's vast information. 
            
            YOUR TASK: You'll make complex topics easy to understand, using clear and engaging explanations. You'll break down information into simpler components, use analogies, and relate concepts to everyday experiences to enhance understanding. Avoid descirbing what youll teach or include in each lesson, but actually provide the educational content.

            !IMPORTANT -> CONTENT SHOULD BE CONCISE AND EASILY DIGESTIBLE – AVOID WORDINESS.

            !IMPORTANT -> AVOID REINTRODUCING THE COURSE TOPIC IN THE CONTENT. THE READERS ALREADY KNOW THE COURSE TOPIC.

            !IMPORTANT -> DO NOT GIVE THE CONTENT A MAIN TITLE – AVOID THIS EXPLICITLY.
    
            !IMPORTANT -> CONTENT SHOULD BE INFORMATIVE, PROVIDING ACTUAL CONTENT THAT CAN BE LEARNED.
    
            !IMPORTANT -> DO NOT DESCRIBE WHAT YOU WILL TEACH OR WHAT WILL BE IN THE CONTENT UNDER ANY CIRCUMSTANCES.
    
            !IMPORTANT-> CONTENT SHOULD BE STRUCTURED IN MARKDOWN FORMAT AND SHOULD FOLLOW BEST FORMATTING PRACTICES, INLCUDING TABLES, LISTS, HEADINGS WHEN NEEDED.
            
            !IMPORTANT -> AVOID CONCLUSIONS AND SUMMARIES IN THE CONTENT, DONT REPEAT INFORMATION, DONT ADD SECTIONS THAT READ "IN SUMMARY....".
            
            !IMPORTANT -> CONTENT SHOULD NOT OVERLAP WITH OTHER UNITS.
            
            !IMPORTANT -> CONTENT SHOULD MANTAIN THE CONTEXT OF THE COURSE.
            
            `,
      },
      {
        role: 'user',
        content: `
              The lesson you are writing content for is: ${lessonTitle}.

              Other details to guide your content:
              Course: ${courseTitle}
              Course Summary: ${courseSummary}
              Unit: ${unitTitle}
              Lessons: ${unitLessons},
              Write detailed informative content.`,
      },
    ] as any;

    const response = await openai.chat.completions.create({
      messages: prompt,
      model: 'gpt-3.5-turbo-1106',
      max_tokens: 480,
      stream: true,
    });

    const stream = OpenAIStream(response, {
      onCompletion: async (completion: string) => {
        try {
        } catch (error) {
          handleError(error);
        }
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    handleError(error);
  }
}
