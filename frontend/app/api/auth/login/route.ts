import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        await dbConnect();
        
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Please provide email and password' }, { status: 400 });
        }

        // Check user existence
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
        }

        return NextResponse.json({ 
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        }, { status: 200 });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
