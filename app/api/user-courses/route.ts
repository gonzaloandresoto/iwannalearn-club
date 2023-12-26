import { getUserCourses } from '@/lib/actions/course.actions';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    const response = await getUserCourses(userId);

    if (!response) throw new Error();

    return NextResponse.json(response);
  } catch (error) {
    console.log('Error fetching user courses', error);
  }
}
