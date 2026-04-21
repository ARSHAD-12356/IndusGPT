import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();
        const apiKey = process.env.HF_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'HF_API_KEY is not configured' }, { status: 500 });
        }

        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
            {
                headers: { 
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json({ error: `Hugging Face API error: ${errorText}` }, { status: response.status });
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString('base64');
        const imageUrl = `data:image/png;base64,${base64Image}`;

        return NextResponse.json({ imageUrl });
    } catch (error: any) {
        console.error('Image Generation Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
