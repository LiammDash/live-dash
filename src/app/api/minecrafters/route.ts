import { NextRequest, NextResponse } from 'next/server';

const HOME_ASSISTANT_URL = 'http://192.168.2.150:30103';
const HOME_ASSISTANT_TOKEN = process.env.HAsecret;

export async function GET() {
    try {
        const haRes = await fetch(
            `${HOME_ASSISTANT_URL}/api/states/sensor.192_168_2_150_25565_players_online`,
            {
                headers: {
                    'Authorization': `${HOME_ASSISTANT_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        
        if (!haRes.ok) {
            const error = await haRes.text();
            return NextResponse.json({ error }, { status: haRes.status });
        }

        const data = await haRes.json();
        return NextResponse.json({ value: data.state });
        
    } catch (error) {
        
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
