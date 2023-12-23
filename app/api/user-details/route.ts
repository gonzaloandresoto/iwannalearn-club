import { getUserById } from '@/lib/actions/user.actions';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    const response = await getUserById(userId);

    if (!response) throw new Error();

    return NextResponse.json(response);
  } catch (error) {
    console.log('Error fetching user details', error);
  }
}
