import { getUserById } from '@/lib/actions/user.actions';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId)
      return NextResponse.json({ status: 400, message: 'User ID is required' });

    const response = await getUserById(userId);

    return NextResponse.json({ status: 200, message: 'OK', data: response });
  } catch (error: any) {
    if (error.message === 'User not found')
      return NextResponse.json({ status: 404, message: 'User not found' });
    else {
      return NextResponse.json({
        status: 500,
        message: 'Server Error',
      });
    }
  }
}
