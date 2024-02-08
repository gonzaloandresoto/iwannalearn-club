import { handleError } from '@/lib/utils';
import openai from '@/lib/openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { saveGeneratedLessonText } from '@/lib/actions/element.action';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { lessonTitle, courseTitle, courseSummary, lessonTitles } =
      await request.json();

    console.log('lessonTitle', lessonTitle);
    console.log('courseTitle', courseTitle);
    console.log('courseSummary', courseSummary);
    console.log('lessonTitles', lessonTitles);
    const prompt = [
      {
        role: 'system',
        content: `
          You are tasked with simplifying complex topics from ${courseTitle}, ensuring the content is textbook-quality and utilizes Wikipedia's depth. Your explanations should be clear and engaging, breaking down concepts into understandable parts, employing analogies, and connecting to everyday experiences. The goal is to teach directly rather than describing what will be taught.

          Key Points:
          DO NOT ADD A MAIN TITLE TO THE ARTICLE.
          Conciseness is crucial: Eliminate wordiness, delivering content that's easy to digest.
          Assume course topic knowledge: Do not reintroduce or repeatedly mention the course topic.
          No main titles: Start directly with the educational content without a leading title.
          Focus on providing learning material: Offer substantial information that adds value and knowledge.
          Avoid describing future content: Directly present the information instead of indicating what will be covered.
          Use Markdown for structure: Apply formatting best practices, including tables, lists, and headings as needed.
          Skip summaries and conclusions: Do not repeat information or include summary sections.
          Ensure content uniqueness: Avoid overlap with other units and maintain relevance to the course context.
            `,
      },
      {
        role: 'user',
        content: `
              The lesson you are writing content for is: ${lessonTitle}.

              Other details to guide your content:
              Article Topic: ${lessonTitle}
              Blog Title: ${courseTitle}
              Blog Description: ${courseSummary}
              Other Articles in Blog: ${lessonTitles},
              Write detailed informative content.`,
      },
    ] as any;

    const response = await openai.chat.completions.create({
      messages: prompt,
      model: 'gpt-3.5-turbo-1106',
      max_tokens: 480,
      stream: true,
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
  } catch (error) {
    handleError(error);
  }
}
