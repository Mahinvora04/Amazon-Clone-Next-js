import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const authToken = await cookies().get('authToken');

  if (!authToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Protect these routes
export const config = {
  matcher: ['/cart','/wishlist','/checkout', '/profile'],
};
