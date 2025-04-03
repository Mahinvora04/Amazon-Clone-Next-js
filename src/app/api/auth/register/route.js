import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function POST(req) {
  const cookieStore = await cookies();
  try {
    const formData = await req.formData();

    const full_name = formData.get('full_name');
    const email = formData.get('email');
    const password = formData.get('password');
    const contact = formData.get('contact');
    const address = formData.get('address');

    // Check if email already exists
    const [existingUser] = await db.query(
      'SELECT email FROM users WHERE email = ?',
      [email],
    );

    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 },
      );
    }

    const userId = nanoid();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user data into the database
    const [result] = await db.query(
      'INSERT INTO users (user_id, name, email, password,contact,address ) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, full_name, email, hashedPassword, contact, address],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Failed to register user' },
        { status: 500 },
      );
    }

    const authToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    cookieStore.set('authToken', authToken);
    cookieStore.set('userId', userId);

    return NextResponse.json({
      success: true,
      status: 200,
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
