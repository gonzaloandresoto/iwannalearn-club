import { deleteCourseById } from '@/lib/actions/course.actions';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { courseId, userId } = await request.json();

    const response = await deleteCourseById(courseId, userId);

    if (!response) throw new Error();

    return NextResponse.json(response);
  } catch (error) {
    console.log('Error deleting course: ', error);
  }
}
