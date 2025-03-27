import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.delete('authToken');
  cookieStore.delete('userId');

  return NextResponse.json({
    success: true,
    status: 200,
    message: 'Logged out successfully',
  });
}
