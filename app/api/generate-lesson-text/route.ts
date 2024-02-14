import { handleError } from '@/lib/utils';
import openai from '@/lib/openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { lessonTitle, courseTitle, courseSummary, lessonTitles } =
      await request.json();

    const prompt = [
      {
        role: 'system',
        content: `
          You are an expert in ${courseTitle} who runs a blog. You are tasked to write a short/concise article focused solely on ${lessonTitle}. You are to ensure the content is textbook-quality and utilizes Wikipedia's content if available. Your explanations should be clear and engaging, breaking down concepts into understandable parts, employing analogies, and connecting to everyday experiences. Avoid wordiness.

          Key Points:
          No main titles: Start directly with the educational content without a leading title.
          Conciseness is crucial: Eliminate wordiness, delivering content that's easy to digest.
          Use Markdown for structure: Apply formatting best practices, including tables, lists, and headings as needed.
          Assume course topic knowledge: Do not reintroduce or repeatedly mention the course topic.
          Avoid describing future content: Directly present the information instead of indicating what will be covered.
          Things to avoid: Skip summaries and conclusions in the body.
          Ensure content uniqueness: Avoid overlap with other article topics and maintain relevance to the course context.
            `,
      },
      {
        role: 'user',
        content: `
              Article Topic: ${lessonTitle}
              Blog Title: ${courseTitle}
              Blog Description: ${courseSummary}
              Article Topics To Avoid: ${lessonTitles},`,
      },
    ] as any;

    const response = await openai.chat.completions.create({
      messages: prompt,
      model: 'gpt-3.5-turbo-1106',
      max_tokens: 600,
      stream: true,
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
  } catch (error) {
    handleError(error);
  }
}
