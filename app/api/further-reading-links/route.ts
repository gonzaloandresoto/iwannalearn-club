import exa from '@/lib/metaphor';
import { handleError } from '@/lib/utils';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const { title } = await request.json();

    const searchQuery = `Further reading and relevant articles on ${title}`;

    const response = await exa.search(searchQuery, {
      numResults: 3,
      useAutoprompt: true,
    });

    const articles = response?.results?.map((result) => ({
      title: result.title,
      url: result.url,
    }));

    return NextResponse.json(articles);
  } catch (error) {
    handleError(error);
  }
}
