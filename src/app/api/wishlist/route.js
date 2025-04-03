import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    const [wishlistData] = await db.query(
      'SELECT product_id, quantity FROM wishlist WHERE user_id = ?',
      [userId],
    );

    if (!wishlistData.length) {
      return NextResponse.json({
        success: true,
        status: 200,
        wishlist: [],
      });
    }

    const productIds = wishlistData.map((item) => item.product_id);
    const [wishlistProduct] = await db.query(
      'SELECT product_id,category_id, product_name, description, price, seller, in_stock, image_url FROM products WHERE product_id IN (?)',
      [productIds],
    );

    return NextResponse.json({
      success: true,
      status: 200,
      wishlist: wishlistProduct,
    });
  } catch (error) {
    console.error('Error fetching wishlist data:', error);
    return NextResponse.json({ error: 'Internal Server Error', status: 500 });
  }
}
