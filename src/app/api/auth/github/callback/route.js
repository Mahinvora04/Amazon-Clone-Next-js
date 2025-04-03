import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function GET(req) {
  const cookieStore = await cookies();
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    let existingUser;

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code missing' },
        { status: 400 },
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      },
    );

    const { access_token } = await tokenResponse.json();
    if (!access_token) {
      return NextResponse.json(
        { error: 'Failed to get access token' },
        { status: 401 },
      );
    }

    // Fetch user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const user = await userResponse.json();

    // Fetch user email ( it's not included in the /user API by default)
    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const emails = await emailResponse.json();
    const primaryEmail =
      emails.find((email) => email.primary)?.email || emails[0]?.email || null;

    if (!user || !user.login) {
      return NextResponse.json(
        { error: 'Failed to get user info' },
        { status: 401 },
      );
    }

    // Generate JWT token
    const jwtToken = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    const [userResults] = await db.query(
      'SELECT user_id, email FROM users WHERE email = ?',
      [primaryEmail],
    );

    existingUser = userResults[0];

    if (!existingUser || userResults.length === 0) {
      const userId = nanoid();

      const [result] = await db.query(
        'INSERT INTO users (user_id, name , email ) VALUES (?, ?, ?)',
        [userId, user.name, primaryEmail],
      );

      if (result.affectedRows === 0) {
        return NextResponse.json(
          { error: 'Failed to register user' },
          { status: 500 },
        );
      }

      existingUser = { id: userId, email: primaryEmail };
    }

    cookieStore.set('authToken', jwtToken);
    cookieStore.set('userId', existingUser.user_id);

    const response = NextResponse.redirect(new URL('/', req.url));

    return response;
  } catch (error) {
    console.error('GitHub OAuth Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
