import axios from 'axios';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { db } from '../../../../../lib/db';

export async function GET(req) {
  const cookieStore = await cookies();
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code missing' },
        { status: 400 },
      );
    }

    const { data: tokenData } = await axios.post(
      'https://oauth2.googleapis.com/token',
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URL,
        grant_type: 'authorization_code',
        code,
      },
    );

    const { access_token } = tokenData;

    // Fetch user details from Google
    const { data: user } = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: { Authorization: `Bearer ${access_token}` },
      },
    );

    // Generate JWT token
    const jwtToken = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Check if user exists
    const [userResults] = await db.query(
      'SELECT user_id, email FROM users WHERE email = ?',
      [user.email],
    );

    let existingUser = userResults[0];

    //  if user does not exist then register user
    if (!existingUser || userResults.length === 0) {
      const userId = nanoid();
      const [result] = await db.query(
        'INSERT INTO users (user_id, name, email) VALUES (?, ?, ?)',
        [userId, user.name, user.email],
      );

      if (result.affectedRows === 0) {
        return NextResponse.json(
          { error: 'Failed to register user' },
          { status: 500 },
        );
      }

      existingUser = { id: userId, email: user.email };
    }

    const response = NextResponse.redirect(new URL('/', req.url));

    cookieStore.set('authToken', jwtToken);
    cookieStore.set('userId', existingUser.user_id);

    return response;
  } catch (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.json({ error: 'OAuth login failed' }, { status: 500 });
  }
}
