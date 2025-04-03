import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function GET(req, { params }) {
  const { categoryId } = await params;

  try {
    const [category] = await db.query(
      'SELECT * FROM category WHERE category_id = ?',
      [categoryId],
    );

    if (category.length === 0) {
      return NextResponse.json(
        { message: 'No Category found' },
        { status: 404 },
      );
    }

    const categoryType = category[0];

    return NextResponse.json({ success: true, status: 200, categoryType });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
