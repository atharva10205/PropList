import { cookies } from "next/headers";
import { NextResponse } from 'next/server';

export async function GET() {
    const cookieStore =await cookies(); // Renaming to avoid confusion with the 'cookies' function in useEffect
    const email =  cookieStore.get("email")?.value;
    return NextResponse.json({ email });
}
