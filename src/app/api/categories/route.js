import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function GET() {
  try {
    const [categories] = await db.query('SELECT * FROM category');

    return NextResponse.json({ success: true, status: 200, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal Server Error', status: 500 });
  }
}
