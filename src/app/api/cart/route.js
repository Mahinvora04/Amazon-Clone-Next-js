import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    const [cartData] = await db.query(
      'SELECT product_id, quantity FROM cart WHERE user_id = ?',
      [userId],
    );

    if (!cartData.length) {
      return NextResponse.json({
        success: true,
        status: 200,
        cart: [],
      });
    }

    const productIds = cartData.map((item) => item.product_id);
    const [cartProducts] = await db.query(
      'SELECT product_id,category_id, product_name, description, price, seller, in_stock, image_url FROM products WHERE product_id IN (?)',
      [productIds],
    );

    const mergedCart = cartProducts.map((product) => ({
      ...product,
      quantity:
        cartData.find((item) => item.product_id === product.product_id)
          ?.quantity || 1,
    }));

    return NextResponse.json({
      success: true,
      status: 200,
      cart: mergedCart,
    });
  } catch (error) {
    console.error('Error fetching cart data:', error);
    return NextResponse.json({ error: 'Internal Server Error', status: 500 });
  }
}
