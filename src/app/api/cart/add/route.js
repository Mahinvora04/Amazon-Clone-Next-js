import { nanoid } from 'nanoid';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function POST(req) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 },
      );
    }

    const { productId } = await req.json(); // Extract productId from request body

    // Check if the product already exists in the cart
    const [existingCartItem] = await db.query(
      'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
      [userId, productId],
    );

    if (existingCartItem.length > 0) {
      // Remove product from the cart
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
      // Generate a unique cart_id using nanoid
      const cartId = nanoid();

      // Insert product into the cart
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
