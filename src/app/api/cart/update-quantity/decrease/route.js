import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function PUT(req) {
  try {
    const cookieStore =await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 },
      );
    }

    const { productId } = await req.json();

    await db.query(
      'UPDATE cart SET quantity = quantity - 1 WHERE user_id = ? AND product_id = ?',
      [userId, productId],
    );

    return NextResponse.json({
      success: true,
      status: 200,
      message: 'Product quantity updated in cart',
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
