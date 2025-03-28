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

    // Check if the product already exists in the wishlist
    const [existingWishlistItem] = await db.query(
      'SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?',
      [userId, productId],
    );

    if (existingWishlistItem.length > 0) {
      // Remove product from the wishlist
      await db.query('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?', [
        userId,
        productId,
      ]);

      return NextResponse.json({
        success: true,
        status: 200,
        message: 'Product removed from wishlist',
      });
    } else {
      // Generate a unique wishlist_id using nanoid
      const wishlistId = nanoid();

      // Insert product into the wishlist
      await db.query(
        'INSERT INTO wishlist (wishlist_id, user_id, product_id) VALUES (?, ?, ?)',
        [wishlistId, userId, productId],
      );

      return NextResponse.json({
        success: true,
        status: 200,
        message: 'Product added to wishlist',
      });
    }
  } catch (error) {
    console.error('Error updating wishlist:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
