import { getUnitElementsById } from '@/lib/actions/unit.actions';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { unit } = await request.json();

    const response = await getUnitElementsById(unit);

    if (!response) throw new Error();

    return NextResponse.json(response);
  } catch (error) {
    console.log('Error getting course progress', error);
  }
}
