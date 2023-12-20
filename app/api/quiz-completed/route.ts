import { markQuizCompleted } from '@/lib/actions/quiz.actions';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { quizId } = await request.json();

    const response = await markQuizCompleted(quizId);

    if (!response) throw new Error();

    return NextResponse.json(response);
  } catch (error) {
    console.log('Error marking quiz as completed', error);
  }
}
