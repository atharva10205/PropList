import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out successfully' });

  response.cookies.set({
    name: 'token',
    value: '',
    path: '/',
    httpOnly: true,
    expires: new Date(0), 
  });

  response.cookies.set({
    name: 'email',
    value: '',
    httpOnly: false, 
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0), 
  });

  return response;
}
