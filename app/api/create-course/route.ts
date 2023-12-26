import { createCourse } from '@/lib/actions/generate.actions';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log('Creating course');
    const { topic, userId } = await request.json();

    const response = await createCourse(topic, userId);

    if (!response) throw new Error();

    return NextResponse.json(response);
  } catch (error) {
    console.log('Error creating course', error);
  }
}
