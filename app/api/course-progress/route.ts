import { getCourseProgressById } from '@/lib/actions/generate.actions';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    const response = await getCourseProgressById(id);

    if (!response) throw new Error();

    return NextResponse.json(response.progress);
  } catch (error) {
    console.log('Error getting course progress', error);
  }
}
