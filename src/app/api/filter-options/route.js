import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function GET() {
  try {
    const data = [
      { value: 'price', label: 'Price' },
      { value: 'seller', label: 'Seller' },
      { value: 'availability', label: 'Availability' },
    ];

    const stockFilterValues = ['In stock', 'Out of stock'];

    const [sellerFilterValues] = await db.query(
      'SELECT DISTINCT seller FROM products',
    );

    const sellerArray = sellerFilterValues.map((item) => item.seller);

    return NextResponse.json({
      success: true,
      status: 200,
      data,
      sellerArray,
      stockFilterValues,
    });
  } catch (err) {
    console.error('Error fetching filter options:', err);
    return NextResponse.json({
      success: false,
      status: 500,
      error: 'Internal Server Error',
    });
  }
}
