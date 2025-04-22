import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { cookies } from 'next/headers'


export async function GET() {

    const cookieStore = cookies()
    const email = cookieStore.get('email')?.value 
    
    const response = await prisma.User.findUnique({where : email})
    console.log(response.data)
}