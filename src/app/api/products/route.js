import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function POST(req) {
  const payload = await req.json();

  console.log('payload : ', payload);

  const page = payload.page || 1;
  const limit = payload.limit || 10;
  const offset = (page - 1) * limit;
  const filters = payload.filters || {};

  try {
    let query = 'SELECT * FROM products WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) AS total FROM products WHERE 1=1';
    let queryParams = [];
    let countParams = [];

    if (filters.seller && filters.seller.length > 0) {
      const placeholders = filters.seller.map(() => '?').join(', ');
      query += ` AND seller IN (${placeholders})`;
      countQuery += ` AND seller IN (${placeholders})`;
      queryParams.push(...filters.seller);
      countParams.push(...filters.seller);
    }

    if (filters.in_stock !== null && filters.in_stock !== undefined) {
      const stockValue = filters.in_stock === '1' ? 1 : 0;
      query += ` AND in_stock = ?`;
      countQuery += ` AND in_stock = ?`;
      queryParams.push(stockValue);
      countParams.push(stockValue);
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

    // total count
    const [countResult] = await db.query(countQuery, countParams);
    const totalRecords = countResult.length > 0 ? countResult[0].total : 0;

    // Fetch products with filters and pagination
    const [products] = await db.query(query, queryParams);

    return NextResponse.json({
      success: true,
      status: 200,
      products,
      count: totalRecords,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
