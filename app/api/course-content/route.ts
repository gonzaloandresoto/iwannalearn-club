import { getCourseContentById } from '@/lib/actions/course.actions';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    const response = await getCourseContentById(id);

    if (!response) throw new Error();

    return NextResponse.json(response);
  } catch (error) {
    console.log('Error getting course progress', error);
  }
}
