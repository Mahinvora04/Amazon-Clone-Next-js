import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function POST(req, { params }) {
  const payload = await req.json();
  const { categoryId } = await params;

  console.log('payload : ', payload);

  const page = payload.page || 1;
  const limit = payload.limit || 10;
  const offset = (page - 1) * limit;
  const filters = payload.filters || {};

  try {
    let query = 'SELECT * FROM products WHERE category_id = ?';
    let countQuery =
      'SELECT COUNT(*) AS total FROM products WHERE category_id = ?';
    let queryParams = [categoryId];
    let countParams = [categoryId];

    if (filters.seller && filters.seller.length > 0) {
      const placeholders = filters.seller.map(() => '?').join(', ');
      query += ` AND seller IN (${placeholders})`;
      countQuery += ` AND seller IN (${placeholders})`;
      queryParams.push(...filters.seller);
      countParams.push(...filters.seller);
    }

    if (filters.in_stock !== null && filters.in_stock !== undefined) {
      query += ` AND in_stock = ?`;
      countQuery += ` AND in_stock = ?`;
      queryParams.push(filters.in_stock);
      countParams.push(filters.in_stock);
    }

    if (filters.price) {
      if (filters.price === 'low') {
        query += ' ORDER BY price ASC';
      } else if (filters.price === 'high') {
        query += ' ORDER BY price DESC';
      }
    }

    // pagination
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    // total records
    const [countResult] = await db.query(countQuery, countParams);
    const totalRecords = countResult[0]?.total || 0;

    const [products] = await db.query(query, queryParams);

    if (products.length === 0) {
      return NextResponse.json({
        message: 'No products found',
        success: false,
        status: 404,
      });
    }

    return NextResponse.json({
      success: true,
      status: 200,
      count: totalRecords,
      products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
