import { updateUnitStatusBasedOnQuizCompletion } from '@/lib/actions/unit.actions';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { unitId } = await request.json();

    const response = await updateUnitStatusBasedOnQuizCompletion(unitId);

    if (!response) throw new Error();

    return NextResponse.json(response);
  } catch (error) {
    console.log('Error updating unit progress', error);
  }
}
