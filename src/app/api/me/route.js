import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return NextResponse.json({ authenticated: false });
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        return NextResponse.json({ authenticated: true, user });
    } catch (error) {
        return NextResponse.json({ authenticated: false });
    }
}
