import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userIdCookie = cookieStore.get('userId')?.value;

    console.log('cookie in users api : ' + userIdCookie);

    if (!userIdCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const [userResults] = await db.query(
      'SELECT user_id, name, email, contact,address FROM users WHERE user_id = ?',
      [userIdCookie],
    );

    if (!userResults || userResults.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userResult = userResults[0];

    return NextResponse.json({ success: true, userResult, status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

// Update user profile
export async function PUT(req) {
  try {
    const cookieStore = await cookies();
    const userIdCookie = cookieStore.get('userId')?.value;

    if (!userIdCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { contact, address } = await req.json();

    await db.query(
      'UPDATE users SET contact = ?, address = ? WHERE user_id = ?',
      [contact, address, userIdCookie],
    );

    return NextResponse.json(
      { message: 'Profile updated successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
