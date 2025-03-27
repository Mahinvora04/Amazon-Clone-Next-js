import { NextResponse } from 'next/server';

export async function GET() {
  const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URL}&response_type=code&scope=email profile`;

  return NextResponse.redirect(GOOGLE_AUTH_URL);
}
