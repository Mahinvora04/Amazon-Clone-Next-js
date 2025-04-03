import { nanoid } from 'nanoid';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function POST(req) {
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

    const [existingCartItem] = await db.query(
      'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
      [userId, productId],
    );

    if (existingCartItem.length > 0) {
      await db.query('DELETE FROM cart WHERE user_id = ? AND product_id = ?', [
        userId,
        productId,
      ]);

      return NextResponse.json({
        success: true,
        status: 200,
        message: 'Product removed from cart',
      });
    } else {
      const cartId = nanoid();

      await db.query(
        'INSERT INTO cart (cart_id, user_id, product_id, quantity) VALUES (?, ?, ?, ?)',
        [cartId, userId, productId, 1],
      );

      return NextResponse.json({
        success: true,
        status: 200,
        message: 'Product added to cart',
      });
    }
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
