import { NextResponse } from 'next/server';

export async function GET() {
  const GITHUB_AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`;

  return NextResponse.redirect(GITHUB_AUTH_URL);
}
