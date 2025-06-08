import { NextRequest, NextResponse } from 'next/server';

const HOME_ASSISTANT_URL = 'http://192.168.2.150:30103'; // e.g. http://localhost:8123
const HOME_ASSISTANT_TOKEN = process.env.HAsecret; // Long-Lived Access Token

export async function POST(req: NextRequest) {
    try {
        const { entity_id, rgb_color } = await req.json();

        if (!entity_id || !rgb_color) {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        const haRes = await fetch(`${HOME_ASSISTANT_URL}/api/services/light/turn_on`, {
            method: 'POST',
            headers: {
                'Authorization': `${HOME_ASSISTANT_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                entity_id,
                rgb_color,
            }),
        });

        if (!haRes.ok) {
            const error = await haRes.text();
            return NextResponse.json({ error }, { status: haRes.status });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}