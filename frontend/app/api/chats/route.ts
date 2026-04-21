import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Chat from '@/lib/models/Chat';

// GET /api/chats?userId=xxx  →  fetch all chats for a user
export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        const chats = await Chat.find({ userId })
            .sort({ updatedAt: -1 })
            .select('_id name updatedAt')
            .lean();

        return NextResponse.json({ chats }, { status: 200 });
    } catch (error) {
        console.error('GET /api/chats error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/chats  →  create a new chat
export async function POST(req: Request) {
    try {
        await dbConnect();
        const { userId, name } = await req.json();

        if (!userId || !name) {
            return NextResponse.json({ error: 'userId and name are required' }, { status: 400 });
        }

        const chat = await Chat.create({ userId, name, messages: [] });

        return NextResponse.json({ chat: { _id: chat._id, name: chat.name } }, { status: 201 });
    } catch (error) {
        console.error('POST /api/chats error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
